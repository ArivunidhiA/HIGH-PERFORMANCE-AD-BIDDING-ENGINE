# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        NGINX Load Balancer                    │
│                    (Reverse Proxy + SSL)                      │
└───────────────────────┬───────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                                 │
┌───────▼────────┐              ┌───────▼────────┐
│  API Gateway 1  │              │  API Gateway 2 │
│   (Node.js)     │              │   (Node.js)    │
└───────┬─────────┘              └───────┬───────┘
        │                                 │
        └───────────────┬─────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                                 │
┌───────▼────────┐  ┌──────────┐  ┌─────▼────────┐
│ C++ Engine 1   │  │ C++ Eng 2│  │ C++ Engine 3 │
│  (Bidding)     │  │ (Bidding)│  │  (Bidding)   │
└────────────────┘  └──────────┘  └──────────────┘
        │                                 │
        └───────────────┬─────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                                 │
┌───────▼────────┐              ┌───────▼────────┐
│   PostgreSQL   │              │     Redis       │
│   (Database)   │              │    (Cache)      │
└────────────────┘              └─────────────────┘
```

## Component Details

### 1. NGINX Load Balancer
- Round-robin load balancing
- SSL/TLS termination
- Rate limiting (100 req/sec per IP)
- WebSocket proxy with sticky sessions
- Gzip compression

### 2. API Gateway (Node.js)
- Express.js REST API
- Socket.IO WebSocket server
- JWT authentication
- Redis caching layer
- TCP client to C++ engines
- Background job processing (Bull queue)

### 3. C++ Bidding Engine
- Lock-free concurrent queue
- Thread pool (8 threads default)
- SIMD vectorized calculations
- Memory pool allocator
- Circuit breaker pattern
- Prometheus metrics endpoint

### 4. PostgreSQL Database
- User management
- Campaign storage
- Bid history
- Metrics snapshots

### 5. Redis Cache
- Bid result caching (5min TTL)
- Session storage
- Pub/Sub for real-time events
- Job queue backend

## Data Flow

1. **Bid Request Flow:**
   - Client → NGINX → API Gateway
   - API Gateway checks cache
   - If miss, sends to C++ engine via TCP
   - C++ engine processes bid (<10ms)
   - Response cached in Redis
   - WebSocket event emitted
   - Response returned to client

2. **Real-time Updates:**
   - C++ engine completes bid
   - API Gateway emits WebSocket event
   - Frontend receives update
   - Metrics updated in real-time

## Performance Characteristics

- **Throughput:** 100K+ requests/sec
- **Latency:** P99 < 10ms
- **Availability:** 99.99%
- **Cache Hit Rate:** 85%+

## Scalability

- Horizontal scaling: Add more instances
- Vertical scaling: Increase thread pool
- Database: Read replicas for analytics
- Cache: Redis cluster for high availability

