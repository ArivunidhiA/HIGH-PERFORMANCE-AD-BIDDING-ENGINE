import { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import GlassCard from '../components/ui/GlassCard';
import { Play, Pause, Square } from 'lucide-react';
import axios from 'axios';

export default function LiveBidding() {
  const socket = useSocket();
  const [bids, setBids] = useState([]);
  const [simulating, setSimulating] = useState(false);
  const [bidRate, setBidRate] = useState(100);

  useEffect(() => {
    if (!socket) return;

    socket.on('bid', (bid) => {
      setBids((prev) => [bid, ...prev].slice(0, 100));
    });

    return () => {
      socket.off('bid');
    };
  }, [socket]);

  const startSimulation = async () => {
    setSimulating(true);
    // Simulate sending bids
    const interval = setInterval(async () => {
      try {
        await axios.post('/api/v1/bids', {
          user_id: 'user_123',
          ad_slot_id: 'slot_456',
          floor_price: Math.random() * 10 + 0.5,
          campaign_id: 'campaign_1',
        });
      } catch (error) {
        console.error('Bid failed:', error);
      }
    }, 1000 / bidRate);

    // Store interval for cleanup
    window.simulationInterval = interval;
  };

  const stopSimulation = () => {
    if (window.simulationInterval) {
      clearInterval(window.simulationInterval);
      window.simulationInterval = null;
    }
    setSimulating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Live Bidding
          </h1>
          <p className="text-text-secondary">Real-time bid stream and simulation</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="1000"
            value={bidRate}
            onChange={(e) => setBidRate(Number(e.target.value))}
            className="w-32"
            disabled={simulating}
          />
          <span className="text-sm text-text-secondary">{bidRate} bids/sec</span>
          {!simulating ? (
            <button
              onClick={startSimulation}
              className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:opacity-90"
            >
              <Play className="w-4 h-4" />
              Start Simulation
            </button>
          ) : (
            <button
              onClick={stopSimulation}
              className="flex items-center gap-2 px-4 py-2 bg-error text-white rounded-lg hover:opacity-90"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
          )}
        </div>
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold mb-4">Live Bid Stream</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {bids.map((bid, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-surface-light rounded-lg"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm text-text-secondary">{bid.id}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  bid.won ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                }`}>
                  {bid.won ? 'Won' : 'Lost'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-text-primary">${bid.price?.toFixed(2)}</span>
                <span className="text-sm text-text-secondary">{bid.latency}ms</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

