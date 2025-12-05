#pragma once

#include <vector>
#include <memory>
#include <mutex>
#include <cstddef>

class MemoryPool {
public:
    MemoryPool(size_t pool_size);
    ~MemoryPool();
    
    void* allocate(size_t size);
    void deallocate(void* ptr);
    
    size_t getUsedCount() const { return used_count_; }
    size_t getTotalCount() const { return pool_size_; }

private:
    struct Block {
        void* data;
        bool in_use;
    };
    
    size_t pool_size_;
    std::vector<Block> blocks_;
    std::mutex mutex_;
    size_t used_count_;
};

