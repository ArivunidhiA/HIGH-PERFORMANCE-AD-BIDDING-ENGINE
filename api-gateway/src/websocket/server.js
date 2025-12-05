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
    // Emit to all connected clients for live bidding view
    io.emit('bid', bid);
    io.to(`campaign:${bid.campaignId}`).emit('bid', bid);
    io.to('metrics').emit('bid', bid);
  });

  // Emit metrics every 2 seconds
  setInterval(() => {
    const metrics = {
      timestamp: Date.now(),
      requestsPerSec: Math.floor(Math.random() * 300) + 700,
      p99Latency: (Math.random() * 3 + 6).toFixed(2),
      throughput: (Math.random() * 2 + 4).toFixed(1),
      availability: (99.9 + Math.random() * 0.09).toFixed(2)
    };
    io.to('metrics').emit('metrics', metrics);
  }, 2000);

  return bidEmitter;
}

export { bidEmitter };

