import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';
import GlassCard from '../components/ui/GlassCard';
import { Play, Pause, Square, Zap, TrendingUp, DollarSign, Activity, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

export default function LiveBidding() {
  const socket = useSocket();
  const [bids, setBids] = useState([]);
  const [simulating, setSimulating] = useState(false);
  const [bidRate, setBidRate] = useState(100);
  const [stats, setStats] = useState({
    total: 0,
    won: 0,
    lost: 0,
    avgPrice: 0,
    avgLatency: 0,
  });
  const intervalRef = useRef(null);

  // Initialize with some sample bids for demo
  useEffect(() => {
    const sampleBids = Array.from({ length: 5 }, (_, i) => ({
      id: `bid_${Date.now() - i * 1000}_${Math.random().toString(36).substr(2, 9)}`,
      campaignId: `campaign_${Math.floor(Math.random() * 5) + 1}`,
      price: (Math.random() * 10 + 0.5).toFixed(2),
      won: Math.random() > 0.3,
      latency: Math.floor(Math.random() * 10) + 1,
      timestamp: Date.now() - i * 1000,
    }));
    
    setBids(sampleBids);
    const won = sampleBids.filter(b => b.won).length;
    const total = sampleBids.length;
    const avgPrice = sampleBids.reduce((sum, b) => sum + parseFloat(b.price), 0) / total;
    const avgLatency = sampleBids.reduce((sum, b) => sum + b.latency, 0) / total;
    
    setStats({
      total,
      won,
      lost: total - won,
      avgPrice,
      avgLatency,
    });
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('bid', (bid) => {
      if (bid) {
        setBids((prev) => {
          const newBids = [bid, ...prev].slice(0, 100);
          const won = newBids.filter(b => b.won).length;
          const total = newBids.length;
          const avgPrice = newBids.reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0) / total;
          const avgLatency = newBids.reduce((sum, b) => sum + (b.latency || 0), 0) / total;
          
          setStats({
            total,
            won,
            lost: total - won,
            avgPrice: avgPrice || 0,
            avgLatency: avgLatency || 0,
          });
          
          return newBids;
        });
      }
    });

    return () => {
      socket.off('bid');
    };
  }, [socket]);

  const sendBid = async () => {
    try {
      const response = await axios.post('/api/v1/bids', {
        user_id: 'demo_user',
        ad_slot_id: `slot_${Math.floor(Math.random() * 1000)}`,
        floor_price: Math.random() * 10 + 0.5,
        campaign_id: `campaign_${Math.floor(Math.random() * 5) + 1}`,
      });
      
      if (response.data) {
        const bid = {
          id: response.data.id || `bid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          campaignId: response.data.campaign_id || `campaign_${Math.floor(Math.random() * 5) + 1}`,
          price: response.data.price || response.data.winning_bid || (Math.random() * 10 + 0.5).toFixed(2),
          won: response.data.won !== undefined ? response.data.won : Math.random() > 0.3,
          latency: response.data.latency_ms || Math.floor(Math.random() * 10) + 1,
          timestamp: Date.now(),
        };
        
        setBids((prev) => {
          const newBids = [bid, ...prev].slice(0, 100);
          const won = newBids.filter(b => b.won).length;
          const total = newBids.length;
          const avgPrice = newBids.reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0) / total;
          const avgLatency = newBids.reduce((sum, b) => sum + (b.latency || 0), 0) / total;
          
          setStats({
            total,
            won,
            lost: total - won,
            avgPrice: avgPrice || 0,
            avgLatency: avgLatency || 0,
          });
          
          return newBids;
        });
      }
    } catch (error) {
      const mockBid = {
        id: `bid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        campaignId: `campaign_${Math.floor(Math.random() * 5) + 1}`,
        price: (Math.random() * 10 + 0.5).toFixed(2),
        won: Math.random() > 0.3,
        latency: Math.floor(Math.random() * 10) + 1,
        timestamp: Date.now(),
      };
      
      setBids((prev) => {
        const newBids = [mockBid, ...prev].slice(0, 100);
        const won = newBids.filter(b => b.won).length;
        const total = newBids.length;
        const avgPrice = newBids.reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0) / total;
        const avgLatency = newBids.reduce((sum, b) => sum + (b.latency || 0), 0) / total;
        
        setStats({
          total,
          won,
          lost: total - won,
          avgPrice: avgPrice || 0,
          avgLatency: avgLatency || 0,
        });
        
        return newBids;
      });
    }
  };

  const startSimulation = async () => {
    setSimulating(true);
    
    // Send initial batch
    for (let i = 0; i < 5; i++) {
      setTimeout(() => sendBid(), i * 100);
    }
  };

  const stopSimulation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSimulating(false);
  };

  // Update interval when bidRate or simulating changes
  useEffect(() => {
    if (simulating) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Start interval based on current bidRate
      intervalRef.current = setInterval(() => {
        const batchSize = Math.max(1, Math.ceil(bidRate / 10));
        for (let i = 0; i < batchSize; i++) {
          setTimeout(() => sendBid(), i * (1000 / bidRate));
        }
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [simulating, bidRate]);

  return (
    <div className="space-y-8 relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-5xl font-black mb-4 text-green-600" style={{ textShadow: '0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)' }}>
            Live Bidding
          </h1>
          <p className="text-gray-700 text-lg font-bold">
            Real-time bid stream and simulation engine
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3 bg-white border-2 border-blue-500 rounded-xl px-4 py-2 shadow-md" style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)' }}>
            <input
              type="range"
              min="1"
              max="1000"
              value={bidRate}
              onChange={(e) => setBidRate(Number(e.target.value))}
              className="w-32 accent-blue-600"
            />
            <span className="text-sm font-black text-gray-800 min-w-[80px]">{bidRate} bids/sec</span>
          </div>
          {!simulating ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startSimulation}
              className="flex items-center gap-2 px-6 py-3 bg-green-100 border-2 border-green-500 text-gray-900 rounded-xl font-black shadow-lg"
              style={{ boxShadow: '0 0 25px rgba(16, 185, 129, 0.5), 0 0 50px rgba(16, 185, 129, 0.3)' }}
            >
              <span className="text-gray-900 font-black">Start Simulation</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopSimulation}
              className="flex items-center gap-2 px-6 py-3 bg-red-100 border-2 border-red-500 text-gray-900 rounded-xl font-black shadow-lg"
              style={{ boxShadow: '0 0 25px rgba(239, 68, 68, 0.5), 0 0 50px rgba(239, 68, 68, 0.3)' }}
            >
              <span className="text-gray-900 font-black">Stop</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="relative overflow-hidden">
            <div className="relative">
              <p className="text-sm text-gray-600 mb-1 font-bold">Total Bids</p>
              <p className="text-3xl font-black text-blue-600" style={{ textShadow: '0 0 15px rgba(59, 130, 246, 0.6)' }}>{stats.total}</p>
            </div>
          </GlassCard>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="relative overflow-hidden">
            <div className="relative">
              <p className="text-sm text-gray-600 mb-1 font-bold">Won</p>
              <p className="text-3xl font-black text-green-600" style={{ textShadow: '0 0 15px rgba(16, 185, 129, 0.6)' }}>{stats.won}</p>
            </div>
          </GlassCard>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="relative overflow-hidden">
            <div className="relative">
              <p className="text-sm text-gray-600 mb-1 font-bold">Lost</p>
              <p className="text-3xl font-black text-red-600" style={{ textShadow: '0 0 15px rgba(239, 68, 68, 0.6)' }}>{stats.lost}</p>
            </div>
          </GlassCard>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="relative overflow-hidden">
            <div className="relative">
              <p className="text-sm text-gray-600 mb-1 font-bold">Avg Price</p>
              <p className="text-3xl font-black text-purple-600" style={{ textShadow: '0 0 15px rgba(167, 139, 250, 0.6)' }}>${stats.avgPrice.toFixed(2)}</p>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <GlassCard className="relative overflow-hidden">
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-blue-600" style={{ textShadow: '0 0 20px rgba(59, 130, 246, 0.6)' }}>
              Live Bid Stream
            </h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-white border-2 border-green-500 rounded-full shadow-md" style={{ boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}>
              <div className="w-2 h-2 bg-green-500 rounded-full" style={{ boxShadow: '0 0 10px rgba(16, 185, 129, 0.8)' }} />
              <span className="text-sm text-green-700 font-black">{simulating ? 'Simulating' : 'Ready'}</span>
            </div>
          </div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
            <AnimatePresence>
              {bids.length === 0 ? (
                <div className="text-center py-12">
                  <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-bold">No bids yet. Start the simulation to see live bids!</p>
                </div>
              ) : (
                bids.map((bid, index) => (
                  <motion.div
                    key={bid.id || index}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                      bid.won
                        ? 'bg-green-50 border-green-500 hover:border-green-600 shadow-lg'
                        : 'bg-red-50 border-red-500 hover:border-red-600 shadow-lg'
                    }`}
                    style={{ boxShadow: bid.won ? '0 0 20px rgba(16, 185, 129, 0.3)' : '0 0 20px rgba(239, 68, 68, 0.3)' }}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-3 h-3 rounded-full ${bid.won ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ boxShadow: bid.won ? '0 0 10px rgba(16, 185, 129, 0.8)' : '0 0 10px rgba(239, 68, 68, 0.8)' }}
                      />
                      <div>
                        <p className="text-sm font-mono text-gray-700 mb-1 font-bold">
                          {bid.id?.substring(0, 16) || `bid_${index}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {bid.timestamp ? formatDistanceToNow(new Date(bid.timestamp), { addSuffix: true }) : 'Just now'}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-black border-2 ${
                        bid.won
                          ? 'bg-green-100 text-green-700 border-green-500'
                          : 'bg-red-100 text-red-700 border-red-500'
                      }`}>
                        {bid.won ? 'Won' : 'Lost'}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xl font-black text-gray-800">
                          ${parseFloat(bid.price || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {bid.latency || 0}ms
                        </p>
                      </div>
                      {bid.won && (
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <DollarSign className="w-6 h-6 text-green-600" style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))' }} />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
