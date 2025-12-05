#pragma once

#include <atomic>
#include <memory>
#include <boost/lockfree/queue.hpp>

template<typename T>
class LockFreeQueue {
public:
    LockFreeQueue(size_t capacity = 10000) 
        : queue_(capacity) {
    }
    
    bool push(const T& item) {
        return queue_.push(item);
    }
    
    bool pop(T& item) {
        return queue_.pop(item);
    }
    
    bool empty() const {
        return queue_.empty();
    }
    
    size_t size() const {
        return queue_.size();
    }

private:
    boost::lockfree::queue<T> queue_;
};

