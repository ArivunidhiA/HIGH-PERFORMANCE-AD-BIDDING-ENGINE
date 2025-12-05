#include "bid_handler.h"
#include "auction.h"
#include "data_structures/bid_cache.h"
#include <chrono>
#include <iostream>

BidHandler::BidHandler(size_t thread_pool_size)
    : thread_pool_size_(thread_pool_size)
    , running_(false)
    , processed_count_(0)
    , error_count_(0)
{
    memory_pool_ = std::make_unique<MemoryPool>(10000);
    circuit_breaker_ = std::make_unique<CircuitBreaker>(50, 60);
}

BidHandler::~BidHandler() {
    stop();
}

void BidHandler::start() {
    if (running_.load()) {
        return;
    }
    
    running_.store(true);
    worker_threads_.reserve(thread_pool_size_);
    
    for (size_t i = 0; i < thread_pool_size_; ++i) {
        worker_threads_.emplace_back(&BidHandler::workerThread, this);
    }
}

void BidHandler::stop() {
    if (!running_.load()) {
        return;
    }
    
    running_.store(false);
    
    for (auto& thread : worker_threads_) {
        if (thread.joinable()) {
            thread.join();
        }
    }
    worker_threads_.clear();
}

bool BidHandler::submitBidRequest(const bidding::BidRequest& request) {
    if (!running_.load()) {
        return false;
    }
    
    if (!validateBidRequest(request)) {
        error_count_.fetch_add(1);
        return false;
    }
    
    return request_queue_.push(request);
}

bidding::BidResponse BidHandler::processBid(const bidding::BidRequest& request) {
    auto start_time = std::chrono::high_resolution_clock::now();
    
    try {
        if (!circuit_breaker_->isOpen()) {
            bidding::BidResponse response = scoreBid(request);
            
            auto end_time = std::chrono::high_resolution_clock::now();
            auto latency = std::chrono::duration_cast<std::chrono::milliseconds>(
                end_time - start_time).count();
            
            response.set_latency_ms(static_cast<int32_t>(latency));
            response.set_status("success");
            
            if (bid_callback_) {
                bid_callback_(response);
            }
            
            processed_count_.fetch_add(1);
            circuit_breaker_->recordSuccess();
            
            return response;
        } else {
            circuit_breaker_->recordFailure();
            bidding::BidResponse response;
            response.set_id(request.id());
            response.set_status("circuit_breaker_open");
            error_count_.fetch_add(1);
            return response;
        }
    } catch (const std::exception& e) {
        circuit_breaker_->recordFailure();
        error_count_.fetch_add(1);
        
        bidding::BidResponse response;
        response.set_id(request.id());
        response.set_status("error");
        return response;
    }
}

void BidHandler::workerThread() {
    bidding::BidRequest request;
    
    while (running_.load()) {
        if (request_queue_.pop(request)) {
            processBid(request);
        } else {
            std::this_thread::sleep_for(std::chrono::microseconds(100));
        }
    }
}

bidding::BidResponse BidHandler::scoreBid(const bidding::BidRequest& request) {
    // Vectorized bid scoring using SIMD
    AuctionEngine auction;
    
    // Calculate bid score (simplified - in production, use AVX2 for vectorization)
    double base_score = request.floor_price();
    
    // Apply targeting multipliers
    double multiplier = 1.0;
    if (request.targeting().count("premium_user")) {
        multiplier *= 1.5;
    }
    if (request.targeting().count("high_value_region")) {
        multiplier *= 1.3;
    }
    
    double bid_amount = base_score * multiplier;
    
    // Run auction
    bidding::BidResponse response;
    response.set_id(request.id());
    response.set_campaign_id(request.campaign_id());
    response.set_winning_bid(bid_amount);
    response.set_price(bid_amount * 0.8); // Second-price auction
    response.set_won(bid_amount >= request.floor_price());
    
    return response;
}

bool BidHandler::validateBidRequest(const bidding::BidRequest& request) {
    if (request.id().empty()) {
        return false;
    }
    if (request.floor_price() < 0.01 || request.floor_price() > 1000.0) {
        return false;
    }
    if (request.user_id().empty() || request.ad_slot_id().empty()) {
        return false;
    }
    return true;
}

void BidHandler::setBidCallback(std::function<void(const bidding::BidResponse&)> callback) {
    bid_callback_ = callback;
}

