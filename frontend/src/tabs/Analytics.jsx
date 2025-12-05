import { useState, useEffect } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const TIME_FRAMES = [
  { label: '1 Hour', value: '1h', dataPoints: 12 },
  { label: '24 Hours', value: '24h', dataPoints: 24 },
  { label: '7 Days', value: '7d', dataPoints: 7 },
  { label: '30 Days', value: '30d', dataPoints: 30 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [chartData, setChartData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [throughputData, setThroughputData] = useState([]);

  useEffect(() => {
    const selectedFrame = TIME_FRAMES.find(tf => tf.value === timeRange) || TIME_FRAMES[2];
    const points = selectedFrame.dataPoints;
    
    // Generate performance data
    const perfData = Array.from({ length: points }, (_, i) => {
      const base = timeRange === '1h' ? 750 : timeRange === '24h' ? 800 : timeRange === '7d' ? 850 : 900;
      return {
        date: timeRange === '1h' ? `${i * 5}min` : 
              timeRange === '24h' ? `Hour ${i + 1}` : 
              timeRange === '7d' ? `Day ${i + 1}` : `Day ${i + 1}`,
        requests: Math.floor(Math.random() * 150) + base,
        latency: Math.random() * 3 + 7,
        success: Math.floor(Math.random() * 50) + 950,
        failed: Math.floor(Math.random() * 20) + 5,
      };
    });
    
    setPerformanceData(perfData);
    setThroughputData(perfData);
    
    // Generate chart data
    const chart = Array.from({ length: points }, (_, i) => ({
      date: timeRange === '1h' ? `${i * 5}min` : 
            timeRange === '24h' ? `H${i + 1}` : 
            timeRange === '7d' ? `D${i + 1}` : `D${i + 1}`,
      requests: Math.floor(Math.random() * 150) + base,
      latency: Math.random() * 3 + 7,
    }));
    
    setChartData(chart);
  }, [timeRange]);

  return (
    <div className="space-y-8 relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-5xl font-black mb-4 text-blue-600" style={{ textShadow: '0 0 20px rgba(37, 99, 235, 0.6), 0 0 40px rgba(37, 99, 235, 0.3)' }}>
            Analytics
          </h1>
          <p className="text-gray-700 text-lg font-bold">Historical performance and trends</p>
        </div>
        <div className="flex items-center gap-2 bg-white border-2 border-blue-500 rounded-xl px-4 py-2 shadow-md" style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)' }}>
          <Clock className="w-4 h-4 text-blue-600" style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))' }} />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-transparent border-none text-gray-800 font-black focus:outline-none cursor-pointer"
          >
            {TIME_FRAMES.map((tf) => (
              <option key={tf.value} value={tf.value} className="bg-white text-gray-800">
                {tf.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard className="relative overflow-hidden">
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-blue-600" style={{ textShadow: '0 0 15px rgba(59, 130, 246, 0.6)' }}>
                Performance Over Time
              </h3>
              <span className="text-sm text-gray-600 font-bold">Time Frame: {TIME_FRAMES.find(tf => tf.value === timeRange)?.label}</span>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #3b82f6',
                    borderRadius: '8px',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
                  }}
                />
                <Line type="monotone" dataKey="requests" stroke="#06b6d4" strokeWidth={2} name="Requests/sec" style={{ filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))' }} />
                <Line type="monotone" dataKey="latency" stroke="#a78bfa" strokeWidth={2} name="Latency (ms)" style={{ filter: 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.8))' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="relative overflow-hidden">
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-green-600" style={{ textShadow: '0 0 15px rgba(16, 185, 129, 0.6)' }}>
                Throughput Analysis
              </h3>
              <span className="text-sm text-gray-600 font-bold">Time Frame: {TIME_FRAMES.find(tf => tf.value === timeRange)?.label}</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={throughputData}>
                <defs>
                  <linearGradient id="throughputGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #10b981',
                    borderRadius: '8px',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
                  }}
                />
                <Area type="monotone" dataKey="success" stackId="1" stroke="#10b981" fill="url(#throughputGradient)" style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))' }} />
                <Area type="monotone" dataKey="failed" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="relative overflow-hidden">
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-cyan-600" style={{ textShadow: '0 0 15px rgba(6, 182, 212, 0.6)' }}>
                Request Distribution
              </h3>
              <span className="text-sm text-gray-600 font-bold">Time Frame: {TIME_FRAMES.find(tf => tf.value === timeRange)?.label}</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.slice(0, 7)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #06b6d4',
                    borderRadius: '8px',
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
                  }}
                />
                <Bar dataKey="requests" fill="#06b6d4" radius={[8, 8, 0, 0]} style={{ filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.6))' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
