# Quick Start Guide

## Prerequisites

- Docker Desktop installed and running
- At least 8GB RAM available
- Git

## Getting Started

### 1. Clone and Setup

```bash
cd "/Users/ariv07/Desktop/RESUME - 09 APRIL/Projects/Bidding - AppLovin"
```

### 2. Start Services

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Redis cache
- C++ bidding engines (3 instances)
- Node.js API gateway (2 instances)
- NGINX load balancer
- Prometheus
- Grafana

### 3. Run Database Migrations

```bash
docker-compose exec api-gateway npm run migrate
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:3001
- **Grafana**: http://localhost:3001/grafana (admin/admin)
- **Prometheus**: http://localhost:9091

### 5. Create Your First Account

1. Navigate to http://localhost:3000
2. Click "Register"
3. Create an account with email and password
4. You'll be automatically logged in

### 6. Test the System

1. Go to "Live Bidding" tab
2. Click "Start Simulation"
3. Watch real-time bids stream in
4. Check "Overview" tab for metrics

## Development

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### API Gateway Development

```bash
cd api-gateway
npm install
npm run dev
```

### C++ Engine Development

```bash
cd bidding_engine
./build.sh
./build/bidding_engine
```

## Troubleshooting

### Services won't start

```bash
# Check logs
docker-compose logs

# Restart services
docker-compose restart
```

### Database connection errors

```bash
# Reset database
docker-compose down -v
docker-compose up -d postgres
docker-compose exec api-gateway npm run migrate
```

### Port conflicts

Edit `docker-compose.yml` to change port mappings if needed.

## Next Steps

- Read [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for system design
- Read [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for production deployment
- Customize configuration in `.env` file

