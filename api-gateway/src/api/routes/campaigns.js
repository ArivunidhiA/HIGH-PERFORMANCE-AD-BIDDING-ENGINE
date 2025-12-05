import express from 'express';
import db from '../../database/connection.js';
import { z } from 'zod';

const router = express.Router();

const campaignSchema = z.object({
  name: z.string().min(1),
  budget: z.number().min(0.01),
  targeting_rules: z.record(z.any()).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional()
});

// GET /api/v1/campaigns - List campaigns
router.get('/', async (req, res, next) => {
  try {
    const campaigns = await db('campaigns')
      .where({ user_id: req.user.userId })
      .orderBy('created_at', 'desc');

    res.json(campaigns);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/campaigns - Create campaign
router.post('/', async (req, res, next) => {
  try {
    const validation = campaignSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    const data = validation.data;
    const [campaign] = await db('campaigns')
      .insert({
        user_id: req.user.userId,
        name: data.name,
        budget: data.budget,
        targeting_rules: data.targeting_rules || {},
        start_date: data.start_date ? new Date(data.start_date) : null,
        end_date: data.end_date ? new Date(data.end_date) : null,
        status: 'active'
      })
      .returning('*');

    res.status(201).json(campaign);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/campaigns/:id - Get campaign
router.get('/:id', async (req, res, next) => {
  try {
    const campaign = await db('campaigns')
      .where({ id: req.params.id, user_id: req.user.userId })
      .first();

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/campaigns/:id - Update campaign
router.put('/:id', async (req, res, next) => {
  try {
    const validation = campaignSchema.partial().safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    const [campaign] = await db('campaigns')
      .where({ id: req.params.id, user_id: req.user.userId })
      .update(validation.data)
      .returning('*');

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/campaigns/:id - Delete campaign
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await db('campaigns')
      .where({ id: req.params.id, user_id: req.user.userId })
      .delete();

    if (!deleted) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({ message: 'Campaign deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;

