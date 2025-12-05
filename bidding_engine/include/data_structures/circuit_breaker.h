#pragma once

#include <atomic>
#include <chrono>
#include <mutex>

enum class CircuitState {
    CLOSED,
    OPEN,
    HALF_OPEN
};

class CircuitBreaker {
public:
    CircuitBreaker(size_t failure_threshold, size_t timeout_seconds);
    
    bool isOpen() const;
    void recordSuccess();
    void recordFailure();
    
    CircuitState getState() const { return state_.load(); }
    size_t getFailureCount() const { return failure_count_.load(); }

private:
    void checkAndUpdateState();
    
    std::atomic<CircuitState> state_;
    std::atomic<size_t> failure_count_;
    std::atomic<size_t> success_count_;
    size_t failure_threshold_;
    size_t timeout_seconds_;
    std::chrono::steady_clock::time_point last_failure_time_;
    mutable std::mutex mutex_;
    size_t half_open_requests_;
};

