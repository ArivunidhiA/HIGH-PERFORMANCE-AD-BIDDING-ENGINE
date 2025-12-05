# Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- At least 8GB RAM available
- 20GB free disk space

## Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd bidding-platform
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start all services**
```bash
docker-compose up -d
```

4. **Run database migrations**
```bash
docker-compose exec api-gateway npm run migrate
```

5. **Access the application**
- Frontend: http://localhost:3000
- API Gateway: http://localhost:3001
- Grafana: http://localhost:3001/grafana (admin/admin)
- Prometheus: http://localhost:9091

## Production Deployment

### AWS Deployment

1. **Set up ECS Cluster**
```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name bidding-platform

# Create task definitions for each service
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

2. **Set up RDS PostgreSQL**
```bash
aws rds create-db-instance \
  --db-instance-identifier bidding-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --master-username admin \
  --master-user-password <password>
```

3. **Set up ElastiCache Redis**
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id bidding-redis \
  --engine redis \
  --cache-node-type cache.t3.medium
```

4. **Deploy with ECS**
```bash
aws ecs create-service \
  --cluster bidding-platform \
  --service-name api-gateway \
  --task-definition api-gateway \
  --desired-count 2
```

### GCP Deployment

1. **Set up Cloud SQL**
```bash
gcloud sql instances create bidding-db \
  --database-version=POSTGRES_15 \
  --tier=db-n1-standard-2
```

2. **Deploy to Cloud Run**
```bash
# Build and push images
gcloud builds submit --tag gcr.io/PROJECT_ID/bidding-engine
gcloud builds submit --tag gcr.io/PROJECT_ID/api-gateway

# Deploy services
gcloud run deploy bidding-engine --image gcr.io/PROJECT_ID/bidding-engine
gcloud run deploy api-gateway --image gcr.io/PROJECT_ID/api-gateway
```

### Netlify Deployment

1. **Build frontend**
```bash
cd frontend
npm install
npm run build
```

2. **Deploy to Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

3. **Configure environment variables in Netlify dashboard**
- `VITE_API_URL`: Your API gateway URL
- `VITE_WS_URL`: Your WebSocket URL

4. **Set up redirects**
Create `netlify.toml`:
```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-api-gateway.com/api/:splat"
  status = 200
  force = true
```

## Monitoring Setup

1. **Access Grafana**
- URL: http://localhost:3001/grafana
- Default credentials: admin/admin

2. **Import dashboards**
- Go to Dashboards > Import
- Import Prometheus data source
- Create custom dashboards for:
  - Request rate
  - Latency percentiles
  - Error rates
  - System resources

## Scaling

### Horizontal Scaling

```yaml
# docker-compose.yml
services:
  api-gateway:
    deploy:
      replicas: 5
  
  cpp-engine:
    deploy:
      replicas: 10
```

### Vertical Scaling

Adjust resource limits in Docker Compose:
```yaml
services:
  cpp-engine:
    deploy:
      resources:
        limits:
          cpus: '4'
          memory: 8G
```

## Health Checks

All services expose health check endpoints:
- API Gateway: `GET /api/v1/health`
- C++ Engine: `GET :9090/metrics`

## Troubleshooting

### Services not starting
```bash
# Check logs
docker-compose logs -f

# Restart services
docker-compose restart
```

### Database connection issues
```bash
# Check database status
docker-compose exec postgres psql -U bidding_user -d bidding_db

# Reset database
docker-compose down -v
docker-compose up -d postgres
docker-compose exec api-gateway npm run migrate
```

### High latency
- Check C++ engine thread pool size
- Monitor Redis cache hit rate
- Review database query performance
- Check network latency between services

