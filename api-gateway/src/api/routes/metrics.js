import express from 'express';
import db from '../../database/connection.js';

const router = express.Router();

// GET /api/v1/metrics - Get system metrics
router.get('/', async (req, res, next) => {
  try {
    // Get recent metrics from database
    const metrics = await db('metrics_snapshots')
      .orderBy('timestamp', 'desc')
      .limit(100);

    res.json(metrics);
  } catch (error) {
    next(error);
  }
});

export default router;

