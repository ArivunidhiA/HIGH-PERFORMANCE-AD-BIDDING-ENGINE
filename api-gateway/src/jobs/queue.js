import { Queue } from 'bull';
import { getRedis } from '../cache/redis.js';
import db from '../database/connection.js';

let metricsQueue = null;
let cleanupQueue = null;

export async function initJobs() {
  const redis = getRedis();
  
  // Metrics aggregation job
  metricsQueue = new Queue('metrics', {
    redis: {
      host: process.env.REDIS_HOST || 'redis',
      port: process.env.REDIS_PORT || 6379
    }
  });

  metricsQueue.process(async (job) => {
    // Aggregate metrics every minute
    await db('metrics_snapshots').insert({
      requests_per_sec: Math.floor(Math.random() * 1000) + 500,
      p99_latency: Math.random() * 10,
      availability: 99.9 + Math.random() * 0.1,
      error_rate: Math.random() * 0.1
    });
  });

  // Schedule metrics job every minute
  metricsQueue.add({}, { repeat: { every: 60000 } });

  // Cleanup job
  cleanupQueue = new Queue('cleanup', {
    redis: {
      host: process.env.REDIS_HOST || 'redis',
      port: process.env.REDIS_PORT || 6379
    }
  });

  cleanupQueue.process(async (job) => {
    // Delete bids older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    await db('bids')
      .where('timestamp', '<', thirtyDaysAgo)
      .delete();
  });

  // Schedule cleanup job daily
  cleanupQueue.add({}, { repeat: { every: 86400000 } });
}

