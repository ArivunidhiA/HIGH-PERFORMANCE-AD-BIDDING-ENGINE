#include "metrics.h"
#include <algorithm>
#include <sstream>
#include <iomanip>

MetricsCollector::MetricsCollector()
    : total_requests_(0)
    , successful_requests_(0)
    , cache_hits_(0)
    , cache_misses_(0)
    , p50_latency_(0.0)
    , p95_latency_(0.0)
    , p99_latency_(0.0)
{
    latency_samples_.reserve(MAX_SAMPLES);
}

void MetricsCollector::recordRequest(int64_t latency_ms, bool success) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    total_requests_.fetch_add(1);
    if (success) {
        successful_requests_.fetch_add(1);
    }
    
    latency_samples_.push_back(latency_ms);
    if (latency_samples_.size() > MAX_SAMPLES) {
        latency_samples_.erase(latency_samples_.begin());
    }
    
    updatePercentiles();
}

void MetricsCollector::recordCacheHit(bool hit) {
    if (hit) {
        cache_hits_.fetch_add(1);
    } else {
        cache_misses_.fetch_add(1);
    }
}

bidding::Metrics MetricsCollector::getMetrics() const {
    std::lock_guard<std::mutex> lock(mutex_);
    
    bidding::Metrics metrics;
    
    uint64_t total = total_requests_.load();
    if (total > 0) {
        metrics.set_requests_per_sec(total); // Simplified
        metrics.set_p50_latency_ms(p50_latency_);
        metrics.set_p95_latency_ms(p95_latency_);
        metrics.set_p99_latency_ms(p99_latency_);
        
        double success_rate = static_cast<double>(successful_requests_.load()) / total * 100.0;
        metrics.set_success_rate(success_rate);
    }
    
    uint64_t cache_total = cache_hits_.load() + cache_misses_.load();
    if (cache_total > 0) {
        double hit_rate = static_cast<double>(cache_hits_.load()) / cache_total * 100.0;
        metrics.set_cache_hit_rate(hit_rate);
    }
    
    return metrics;
}

std::string MetricsCollector::getPrometheusFormat() const {
    std::lock_guard<std::mutex> lock(mutex_);
    
    std::ostringstream oss;
    oss << std::fixed << std::setprecision(2);
    
    oss << "# HELP bidding_requests_total Total number of requests\n";
    oss << "# TYPE bidding_requests_total counter\n";
    oss << "bidding_requests_total " << total_requests_.load() << "\n";
    
    oss << "# HELP bidding_requests_successful Total successful requests\n";
    oss << "# TYPE bidding_requests_successful counter\n";
    oss << "bidding_requests_successful " << successful_requests_.load() << "\n";
    
    oss << "# HELP bidding_latency_p50 P50 latency in milliseconds\n";
    oss << "# TYPE bidding_latency_p50 gauge\n";
    oss << "bidding_latency_p50 " << p50_latency_ << "\n";
    
    oss << "# HELP bidding_latency_p95 P95 latency in milliseconds\n";
    oss << "# TYPE bidding_latency_p95 gauge\n";
    oss << "bidding_latency_p95 " << p95_latency_ << "\n";
    
    oss << "# HELP bidding_latency_p99 P99 latency in milliseconds\n";
    oss << "# TYPE bidding_latency_p99 gauge\n";
    oss << "bidding_latency_p99 " << p99_latency_ << "\n";
    
    uint64_t cache_total = cache_hits_.load() + cache_misses_.load();
    if (cache_total > 0) {
        double hit_rate = static_cast<double>(cache_hits_.load()) / cache_total * 100.0;
        oss << "# HELP bidding_cache_hit_rate Cache hit rate percentage\n";
        oss << "# TYPE bidding_cache_hit_rate gauge\n";
        oss << "bidding_cache_hit_rate " << hit_rate << "\n";
    }
    
    return oss.str();
}

void MetricsCollector::reset() {
    std::lock_guard<std::mutex> lock(mutex_);
    latency_samples_.clear();
    total_requests_.store(0);
    successful_requests_.store(0);
    cache_hits_.store(0);
    cache_misses_.store(0);
    p50_latency_ = 0.0;
    p95_latency_ = 0.0;
    p99_latency_ = 0.0;
}

void MetricsCollector::updatePercentiles() {
    if (latency_samples_.empty()) {
        return;
    }
    
    std::vector<int64_t> sorted = latency_samples_;
    std::sort(sorted.begin(), sorted.end());
    
    size_t size = sorted.size();
    p50_latency_ = sorted[size * 0.5];
    p95_latency_ = sorted[size * 0.95];
    p99_latency_ = sorted[size * 0.99];
}

