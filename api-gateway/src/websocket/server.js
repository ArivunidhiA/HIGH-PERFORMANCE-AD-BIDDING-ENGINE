import { getPubClient } from '../cache/redis.js';
import { EventEmitter } from 'events';

const bidEmitter = new EventEmitter();

export function initWebSocket(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Subscribe to bid stream
    socket.on('subscribe:bids', (campaignId) => {
      socket.join(`campaign:${campaignId}`);
      console.log(`Client ${socket.id} subscribed to campaign:${campaignId}`);
    });

    // Subscribe to metrics
    socket.on('subscribe:metrics', () => {
      socket.join('metrics');
      console.log(`Client ${socket.id} subscribed to metrics`);
    });

    // Unsubscribe
    socket.on('unsubscribe', (room) => {
      socket.leave(room);
      console.log(`Client ${socket.id} unsubscribed from ${room}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Emit bid events
  bidEmitter.on('bid:complete', (bid) => {
    io.to(`campaign:${bid.campaignId}`).emit('bid', bid);
    io.to('metrics').emit('bid', bid);
  });

  // Emit metrics every second
  setInterval(() => {
    const metrics = {
      timestamp: Date.now(),
      requestsPerSec: Math.floor(Math.random() * 1000) + 500, // Placeholder
      p99Latency: Math.random() * 10,
      availability: 99.9 + Math.random() * 0.1
    };
    io.to('metrics').emit('metrics', metrics);
  }, 1000);

  return bidEmitter;
}

export { bidEmitter };

