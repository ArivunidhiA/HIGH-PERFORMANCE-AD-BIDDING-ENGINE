#include "data_structures/memory_pool.h"
#include <cstdlib>
#include <algorithm>

MemoryPool::MemoryPool(size_t pool_size)
    : pool_size_(pool_size)
    , used_count_(0)
{
    blocks_.reserve(pool_size_);
    for (size_t i = 0; i < pool_size_; ++i) {
        Block block;
        block.data = std::malloc(1024); // 1KB per block
        block.in_use = false;
        blocks_.push_back(block);
    }
}

MemoryPool::~MemoryPool() {
    std::lock_guard<std::mutex> lock(mutex_);
    for (auto& block : blocks_) {
        if (block.data) {
            std::free(block.data);
        }
    }
}

void* MemoryPool::allocate(size_t size) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    if (size > 1024) {
        return std::malloc(size); // Fallback to malloc for large allocations
    }
    
    auto it = std::find_if(blocks_.begin(), blocks_.end(),
        [](const Block& b) { return !b.in_use; });
    
    if (it != blocks_.end()) {
        it->in_use = true;
        used_count_++;
        return it->data;
    }
    
    // Pool exhausted, fallback to malloc
    return std::malloc(size);
}

void MemoryPool::deallocate(void* ptr) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    auto it = std::find_if(blocks_.begin(), blocks_.end(),
        [ptr](const Block& b) { return b.data == ptr; });
    
    if (it != blocks_.end()) {
        it->in_use = false;
        used_count_--;
    } else {
        std::free(ptr); // Was allocated with malloc
    }
}

