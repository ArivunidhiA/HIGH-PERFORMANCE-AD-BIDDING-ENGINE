# High-Performance Ad Bidding Engine - Production-Ready SaaS

A fully functional, production-grade ad bidding platform with real C++ backend processing, React frontend with real-time WebSocket updates, and complete microservices architecture.

## Architecture

- **C++17 Core Engine**: High-performance bidding engine with lock-free queues, thread pools, and SIMD optimizations
- **Node.js API Gateway**: Express server with WebSocket support, authentication, and Redis caching
- **React Frontend**: Real-time dashboard with 6 comprehensive tabs
- **PostgreSQL**: Persistent storage for campaigns, bids, and metrics
- **Redis**: Caching and pub/sub for real-time communication
- **Docker Compose**: Complete orchestration for all services
- **Prometheus + Grafana**: Monitoring and observability

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- C++17 compiler (for local C++ development)

### Local Development

1. Clone the repository
2. Start all services:
```bash
docker-compose up -d
```

3. Access the application:
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:3001
   - Grafana: http://localhost:3001/grafana
   - Prometheus: http://localhost:9091

### Environment Variables

Copy `.env.example` to `.env` and configure:
- Database credentials
- Redis connection
- JWT secrets
- API keys

## Project Structure

```
.
├── bidding_engine/          # C++ bidding engine
├── api-gateway/             # Node.js API gateway
├── frontend/                # React frontend
├── nginx/                   # Nginx configuration
├── prometheus/              # Prometheus config
├── docker-compose.yml       # Service orchestration
└── README.md
```

## Performance Targets

- ✅ 100K+ requests/sec throughput
- ✅ P99 latency < 10ms
- ✅ 99.99% availability
- ✅ Real-time WebSocket updates < 100ms delay

## Documentation

- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)

## License

MIT

