#pragma once

#include <string>
#include <unordered_map>
#include <mutex>
#include <shared_mutex>
#include <chrono>
#include "proto/bid.pb.h"

class BidCache {
public:
    BidCache(size_t max_size = 10000, size_t ttl_seconds = 300);
    
    bool get(const std::string& key, bidding::BidResponse& value);
    void put(const std::string& key, const bidding::BidResponse& value);
    void evict(const std::string& key);
    void clear();
    
    size_t size() const;
    double getHitRate() const;

private:
    struct CacheEntry {
        bidding::BidResponse response;
        std::chrono::steady_clock::time_point expiry;
    };
    
    void evictExpired();
    
    size_t max_size_;
    size_t ttl_seconds_;
    std::unordered_map<std::string, CacheEntry> cache_;
    mutable std::shared_mutex mutex_;
    
    std::atomic<uint64_t> hits_;
    std::atomic<uint64_t> misses_;
};

