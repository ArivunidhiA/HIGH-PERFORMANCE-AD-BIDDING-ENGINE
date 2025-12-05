import { Registry, Counter, Histogram, Gauge } from 'prom-client';

const register = new Registry();

export function initMetrics() {
  // Request counter
  const httpRequestCounter = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status'],
    registers: [register]
  });

  // Request latency histogram
  const httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5],
    registers: [register]
  });

  // Active connections gauge
  const activeConnections = new Gauge({
    name: 'active_connections',
    help: 'Number of active connections',
    registers: [register]
  });

  return {
    register,
    httpRequestCounter,
    httpRequestDuration,
    activeConnections
  };
}

export function getMetrics() {
  return register;
}

