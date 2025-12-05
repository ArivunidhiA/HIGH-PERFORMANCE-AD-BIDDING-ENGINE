#pragma once

#include <vector>
#include <atomic>
#include <chrono>
#include <mutex>
#include <string>
#include "proto/bid.pb.h"

class MetricsCollector {
public:
    MetricsCollector();
    
    void recordRequest(int64_t latency_ms, bool success);
    void recordCacheHit(bool hit);
    
    bidding::Metrics getMetrics() const;
    std::string getPrometheusFormat() const;
    
    void reset();

private:
    void updatePercentiles();
    
    mutable std::mutex mutex_;
    std::vector<int64_t> latency_samples_;
    std::atomic<uint64_t> total_requests_;
    std::atomic<uint64_t> successful_requests_;
    std::atomic<uint64_t> cache_hits_;
    std::atomic<uint64_t> cache_misses_;
    
    double p50_latency_;
    double p95_latency_;
    double p99_latency_;
    
    static constexpr size_t MAX_SAMPLES = 10000;
};

