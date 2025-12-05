import express from 'express';
import { getCppClient } from '../../cpp-client/client.js';
import { cacheGet, cacheSet } from '../../cache/redis.js';
import db from '../../database/connection.js';
import { bidEmitter } from '../../websocket/server.js';
import { z } from 'zod';

const router = express.Router();

const bidRequestSchema = z.object({
  user_id: z.string(),
  ad_slot_id: z.string(),
  floor_price: z.number().min(0.01).max(1000),
  targeting: z.record(z.string()).optional(),
  campaign_id: z.string().optional()
});

// POST /api/v1/bids - Submit bid request
router.post('/', async (req, res, next) => {
  try {
    const validation = bidRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    const requestData = validation.data;
    const requestId = `bid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Check cache
    const cacheKey = `bid:${requestId}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Send to C++ engine (or use mock for local testing)
    const cppClient = getCppClient();
    if (!cppClient || !cppClient.connected) {
      // Mock response for local testing without C++ engine
      const mockResponse = {
        id: requestId,
        winningBid: requestData.floor_price * 1.2,
        price: requestData.floor_price * 0.8,
        latencyMs: Math.floor(Math.random() * 5) + 1,
        status: 'success',
        won: Math.random() > 0.3,
        campaignId: requestData.campaign_id || ''
      };
      
      const responseObj = {
        id: mockResponse.id,
        winning_bid: mockResponse.winningBid,
        price: mockResponse.price,
        latency_ms: mockResponse.latencyMs,
        status: mockResponse.status,
        won: mockResponse.won,
        campaign_id: mockResponse.campaignId
      };
      
      await cacheSet(cacheKey, responseObj, 300);
      
      if (responseObj.won && requestData.campaign_id) {
        await db('bids').insert({
          campaign_id: requestData.campaign_id,
          request_id: requestId,
          price: responseObj.price,
          won: responseObj.won,
          latency_ms: responseObj.latency_ms
        });
      }
      
      bidEmitter.emit('bid:complete', {
        id: responseObj.id,
        campaignId: responseObj.campaign_id,
        price: responseObj.price,
        won: responseObj.won,
        latency: responseObj.latency_ms,
        timestamp: Date.now()
      });
      
      return res.json(responseObj);
    }

    const bidRequest = {
      id: requestId,
      timestamp: Date.now(),
      userId: requestData.user_id,
      adSlotId: requestData.ad_slot_id,
      floorPrice: requestData.floor_price,
      targeting: requestData.targeting || {},
      campaignId: requestData.campaign_id || ''
    };

    const response = await cppClient.sendBidRequest(bidRequest);

    // Convert protobuf response to plain object
    const responseObj = {
      id: response.id || requestId,
      winning_bid: response.winningBid || 0,
      price: response.price || 0,
      latency_ms: response.latencyMs || 0,
      status: response.status || 'success',
      won: response.won || false,
      campaign_id: response.campaignId || requestData.campaign_id
    };

    // Cache response
    await cacheSet(cacheKey, responseObj, 300);

    // Store in database
    if (responseObj.won && requestData.campaign_id) {
      await db('bids').insert({
        campaign_id: requestData.campaign_id,
        request_id: requestId,
        price: responseObj.price,
        won: responseObj.won,
        latency_ms: responseObj.latency_ms
      });
    }

    // Emit WebSocket event
    bidEmitter.emit('bid:complete', {
      id: responseObj.id,
      campaignId: responseObj.campaign_id,
      price: responseObj.price,
      won: responseObj.won,
      latency: responseObj.latency_ms,
      timestamp: Date.now()
    });

    res.json(responseObj);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/bids/:id - Get bid result
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check cache
    const cacheKey = `bid:${id}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Check database
    const bid = await db('bids')
      .where({ request_id: id })
      .first();

    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    res.json(bid);
  } catch (error) {
    next(error);
  }
});

export default router;
