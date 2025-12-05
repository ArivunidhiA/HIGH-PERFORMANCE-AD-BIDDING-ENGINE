#include "data_structures/bid_cache.h"
#include <algorithm>

BidCache::BidCache(size_t max_size, size_t ttl_seconds)
    : max_size_(max_size)
    , ttl_seconds_(ttl_seconds)
    , hits_(0)
    , misses_(0)
{
}

bool BidCache::get(const std::string& key, bidding::BidResponse& value) {
    std::shared_lock<std::shared_mutex> lock(mutex_);
    
    auto it = cache_.find(key);
    if (it != cache_.end()) {
        auto now = std::chrono::steady_clock::now();
        if (now < it->second.expiry) {
            value = it->second.response;
            hits_.fetch_add(1);
            return true;
        } else {
            // Expired, remove it
            lock.unlock();
            evict(key);
        }
    }
    
    misses_.fetch_add(1);
    return false;
}

void BidCache::put(const std::string& key, const bidding::BidResponse& value) {
    std::unique_lock<std::shared_mutex> lock(mutex_);
    
    evictExpired();
    
    if (cache_.size() >= max_size_) {
        // Evict oldest entry (simple FIFO)
        if (!cache_.empty()) {
            cache_.erase(cache_.begin());
        }
    }
    
    CacheEntry entry;
    entry.response = value;
    entry.expiry = std::chrono::steady_clock::now() + 
                   std::chrono::seconds(ttl_seconds_);
    
    cache_[key] = entry;
}

void BidCache::evict(const std::string& key) {
    std::unique_lock<std::shared_mutex> lock(mutex_);
    cache_.erase(key);
}

void BidCache::clear() {
    std::unique_lock<std::shared_mutex> lock(mutex_);
    cache_.clear();
    hits_.store(0);
    misses_.store(0);
}

size_t BidCache::size() const {
    std::shared_lock<std::shared_mutex> lock(mutex_);
    return cache_.size();
}

double BidCache::getHitRate() const {
    uint64_t total = hits_.load() + misses_.load();
    if (total == 0) return 0.0;
    return static_cast<double>(hits_.load()) / total * 100.0;
}

void BidCache::evictExpired() {
    auto now = std::chrono::steady_clock::now();
    auto it = cache_.begin();
    while (it != cache_.end()) {
        if (now >= it->second.expiry) {
            it = cache_.erase(it);
        } else {
            ++it;
        }
    }
}

