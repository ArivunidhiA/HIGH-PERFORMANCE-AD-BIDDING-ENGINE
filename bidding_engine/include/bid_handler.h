#pragma once

#include <string>
#include <memory>
#include <thread>
#include <vector>
#include <atomic>
#include <functional>
#include "data_structures/lockfree_queue.h"
#include "data_structures/memory_pool.h"
#include "data_structures/circuit_breaker.h"
#include "proto/bid.pb.h"

class BidHandler {
public:
    BidHandler(size_t thread_pool_size = 8);
    ~BidHandler();

    void start();
    void stop();
    
    bool submitBidRequest(const bidding::BidRequest& request);
    bidding::BidResponse processBid(const bidding::BidRequest& request);
    
    void setBidCallback(std::function<void(const bidding::BidResponse&)> callback);
    
    // Statistics
    uint64_t getProcessedCount() const { return processed_count_.load(); }
    uint64_t getErrorCount() const { return error_count_.load(); }

private:
    void workerThread();
    bidding::BidResponse scoreBid(const bidding::BidRequest& request);
    bool validateBidRequest(const bidding::BidRequest& request);
    
    size_t thread_pool_size_;
    std::vector<std::thread> worker_threads_;
    std::atomic<bool> running_;
    
    LockFreeQueue<bidding::BidRequest> request_queue_;
    std::unique_ptr<MemoryPool> memory_pool_;
    std::unique_ptr<CircuitBreaker> circuit_breaker_;
    
    std::function<void(const bidding::BidResponse&)> bid_callback_;
    
    std::atomic<uint64_t> processed_count_;
    std::atomic<uint64_t> error_count_;
};

