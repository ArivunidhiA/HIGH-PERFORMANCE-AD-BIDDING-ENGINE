import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { initDatabase } from './database/connection.js';
import { initRedis } from './cache/redis.js';
import { initCppClient } from './cpp-client/client.js';
import { initWebSocket } from './websocket/server.js';
import { initJobs } from './jobs/queue.js';
import { initLogger } from './monitoring/logger.js';
import { initMetrics } from './monitoring/metrics.js';
import authRoutes from './api/routes/auth.js';
import bidRoutes from './api/routes/bids.js';
import campaignRoutes from './api/routes/campaigns.js';
import metricsRoutes from './api/routes/metrics.js';
import { errorHandler } from './api/middleware/errorHandler.js';
import { authenticateToken } from './api/middleware/auth.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.API_PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// Initialize services
const logger = initLogger();
const metrics = initMetrics();

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/bids', authenticateToken, bidRoutes);
app.use('/api/v1/campaigns', authenticateToken, campaignRoutes);
app.use('/api/v1/metrics', authenticateToken, metricsRoutes);

// Error handler
app.use(errorHandler);

// Initialize async services
async function start() {
  try {
    // Initialize database
    await initDatabase();
    logger.info('Database connected');

    // Initialize Redis
    await initRedis();
    logger.info('Redis connected');

    // Initialize C++ client
    await initCppClient();
    logger.info('C++ client connected');

    // Initialize WebSocket
    initWebSocket(io);
    logger.info('WebSocket server initialized');

    // Initialize background jobs
    await initJobs();
    logger.info('Background jobs initialized');

    // Start server
    httpServer.listen(PORT, () => {
      logger.info(`API Gateway running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

start();

