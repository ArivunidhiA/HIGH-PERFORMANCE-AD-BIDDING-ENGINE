#include "data_structures/circuit_breaker.h"
#include <thread>

CircuitBreaker::CircuitBreaker(size_t failure_threshold, size_t timeout_seconds)
    : state_(CircuitState::CLOSED)
    , failure_count_(0)
    , success_count_(0)
    , failure_threshold_(failure_threshold)
    , timeout_seconds_(timeout_seconds)
    , half_open_requests_(5)
{
}

bool CircuitBreaker::isOpen() const {
    checkAndUpdateState();
    return state_.load() == CircuitState::OPEN;
}

void CircuitBreaker::recordSuccess() {
    std::lock_guard<std::mutex> lock(mutex_);
    
    if (state_.load() == CircuitState::HALF_OPEN) {
        success_count_.fetch_add(1);
        if (success_count_.load() >= half_open_requests_) {
            state_.store(CircuitState::CLOSED);
            failure_count_.store(0);
            success_count_.store(0);
        }
    } else if (state_.load() == CircuitState::CLOSED) {
        failure_count_.store(0);
    }
}

void CircuitBreaker::recordFailure() {
    std::lock_guard<std::mutex> lock(mutex_);
    
    failure_count_.fetch_add(1);
    last_failure_time_ = std::chrono::steady_clock::now();
    
    if (state_.load() == CircuitState::HALF_OPEN) {
        state_.store(CircuitState::OPEN);
    } else if (failure_count_.load() >= failure_threshold_) {
        state_.store(CircuitState::OPEN);
    }
}

void CircuitBreaker::checkAndUpdateState() const {
    std::lock_guard<std::mutex> lock(mutex_);
    
    if (state_.load() == CircuitState::OPEN) {
        auto now = std::chrono::steady_clock::now();
        auto elapsed = std::chrono::duration_cast<std::chrono::seconds>(
            now - last_failure_time_).count();
        
        if (elapsed >= timeout_seconds_) {
            state_.store(CircuitState::HALF_OPEN);
            success_count_.store(0);
        }
    }
}

