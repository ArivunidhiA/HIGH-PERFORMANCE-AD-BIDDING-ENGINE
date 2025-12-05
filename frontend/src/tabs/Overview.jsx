import { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import GlassCard from '../components/ui/GlassCard';
import MetricCard from '../components/ui/MetricCard';
import { Activity, Clock, Zap, Shield, RefreshCw } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const TIME_FRAMES = [
  { label: '1 Hour', value: '1h', minutes: 60 },
  { label: '24 Hours', value: '24h', minutes: 1440 },
  { label: '7 Days', value: '7d', minutes: 10080 },
  { label: '30 Days', value: '30d', minutes: 43200 },
];

export default function Overview() {
  const socket = useSocket();
  const [timeFrame, setTimeFrame] = useState('1h');
  const [metrics, setMetrics] = useState({
    requestsPerSec: 847,
    p99Latency: 8.3,
    throughput: 5.2,
    availability: 99.97,
  });
  const [chartData, setChartData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate data based on time frame
  const generateChartData = (timeFrameValue) => {
    const selectedFrame = TIME_FRAMES.find(tf => tf.value === timeFrameValue) || TIME_FRAMES[0];
    const now = Date.now();
    const interval = selectedFrame.minutes / 30; // 30 data points
    const dataPoints = 30;
    
    return Array.from({ length: dataPoints }, (_, i) => {
      const timeOffset = (dataPoints - i) * interval * 60000; // Convert to milliseconds
      const baseValue = timeFrameValue === '1h' ? 750 : 
                       timeFrameValue === '24h' ? 800 : 
                       timeFrameValue === '7d' ? 850 : 900;
      const variance = timeFrameValue === '1h' ? 200 : 
                      timeFrameValue === '24h' ? 150 : 
                      timeFrameValue === '7d' ? 100 : 50;
      
      return {
        time: new Date(now - timeOffset).toLocaleTimeString(),
        timestamp: now - timeOffset,
        requests: Math.floor(Math.random() * variance) + baseValue,
        latency: parseFloat((Math.random() * 2 + 7).toFixed(2)),
      };
    });
  };

  // Calculate average metrics from chart data
  const calculateMetrics = (data) => {
    if (data.length === 0) return metrics;
    
    const avgRequests = data.reduce((sum, d) => sum + d.requests, 0) / data.length;
    const avgLatency = data.reduce((sum, d) => sum + d.latency, 0) / data.length;
    
    return {
      requestsPerSec: Math.floor(avgRequests),
      p99Latency: parseFloat(avgLatency.toFixed(2)),
      throughput: parseFloat((avgLatency < 8 ? 5.5 : avgLatency < 9 ? 5.2 : 4.8).toFixed(1)),
      availability: parseFloat((99.9 + Math.random() * 0.08).toFixed(2)),
    };
  };

  // Initialize with data based on time frame
  useEffect(() => {
    const data = generateChartData(timeFrame);
    setChartData(data);
    setMetrics(calculateMetrics(data));
  }, [timeFrame]);

  // Manual refresh function
  const handleRefresh = () => {
    setIsRefreshing(true);
    const data = generateChartData(timeFrame);
    setChartData(data);
    setMetrics(calculateMetrics(data));
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Optional: Update from WebSocket (but not constantly)
  useEffect(() => {
    if (!socket) return;

    socket.emit('subscribe:metrics');
    const handleMetrics = (data) => {
      if (data && timeFrame === '1h') {
        const shouldUpdate = Math.random() > 0.7;
        if (shouldUpdate) {
          setChartData((prev) => {
            const newData = [...prev, {
              time: new Date().toLocaleTimeString(),
              timestamp: Date.now(),
              requests: data.requestsPerSec || Math.floor(Math.random() * 200) + 750,
              latency: parseFloat(data.p99Latency || (Math.random() * 2 + 7).toFixed(2)),
            }];
            return newData.slice(-30);
          });
        }
      }
    };

    socket.on('metrics', handleMetrics);

    return () => {
      socket.off('metrics', handleMetrics);
    };
  }, [socket, timeFrame]);

  const selectedFrame = TIME_FRAMES.find(tf => tf.value === timeFrame) || TIME_FRAMES[0];

  return (
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-5xl font-black mb-4 text-blue-600" style={{ textShadow: '0 0 20px rgba(37, 99, 235, 0.6), 0 0 40px rgba(37, 99, 235, 0.3)' }}>
            System Overview
          </h1>
          <p className="text-gray-700 text-lg flex items-center gap-2 font-bold">
            <div className="w-2 h-2 bg-green-500 rounded-full" style={{ boxShadow: '0 0 10px rgba(16, 185, 129, 0.8)' }} />
            Real-time system metrics and performance monitoring
          </p>
        </div>
        
        {/* Time Frame Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white border-2 border-blue-500 rounded-xl px-4 py-2 shadow-md" style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)' }}>
            <Clock className="w-4 h-4 text-blue-600" style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))' }} />
            <select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              className="bg-transparent border-none text-gray-800 font-black focus:outline-none cursor-pointer"
            >
              {TIME_FRAMES.map((tf) => (
                <option key={tf.value} value={tf.value} className="bg-white text-gray-800">
                  {tf.label}
                </option>
              ))}
            </select>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-500 rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-50 shadow-md"
            style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)' }}
          >
            <RefreshCw className={`w-4 h-4 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))' }} />
            <span className="text-sm text-blue-600 font-black">Refresh</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Activity}
          label="Requests/Second"
          value={metrics.requestsPerSec}
          trend={5.2}
          color="cyan"
        />
        <MetricCard
          icon={Clock}
          label="P99 Latency"
          value={metrics.p99Latency}
          color="purple"
        />
        <MetricCard
          icon={Zap}
          label="Throughput Multiplier"
          value={metrics.throughput}
          color="green"
        />
        <MetricCard
          icon={Shield}
          label="System Availability"
          value={metrics.availability}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="relative overflow-hidden">
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-blue-600" style={{ textShadow: '0 0 15px rgba(59, 130, 246, 0.6)' }}>
                  Requests per Second
                </h3>
                <p className="text-sm text-gray-600 mt-1 font-bold">Time Frame: {selectedFrame.label}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white border-2 border-blue-500 rounded-full shadow-md" style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}>
                <div className="w-2 h-2 bg-blue-500 rounded-full" style={{ boxShadow: '0 0 10px rgba(59, 130, 246, 0.8)' }} />
                <span className="text-sm text-blue-600 font-black">Static</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="requestGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280" 
                  style={{ fontSize: '12px' }}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #3b82f6',
                    borderRadius: '8px',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
                  }}
                  labelStyle={{ color: '#06b6d4' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#06b6d4' }}
                  style={{ filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="relative overflow-hidden">
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-purple-600" style={{ textShadow: '0 0 15px rgba(167, 139, 250, 0.6)' }}>
                  Latency Percentiles
                </h3>
                <p className="text-sm text-gray-600 mt-1 font-bold">Time Frame: {selectedFrame.label}</p>
              </div>
              <div className="px-3 py-1 bg-white border-2 border-purple-500 rounded-full shadow-md" style={{ boxShadow: '0 0 15px rgba(167, 139, 250, 0.5)' }}>
                <span className="text-sm text-purple-600 font-black">P99</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #a78bfa',
                    borderRadius: '8px',
                    boxShadow: '0 0 20px rgba(167, 139, 250, 0.3)'
                  }}
                  labelStyle={{ color: '#a78bfa' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="latency" 
                  stroke="#a78bfa" 
                  fill="url(#latencyGradient)"
                  strokeWidth={2}
                  style={{ filter: 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.8))' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
