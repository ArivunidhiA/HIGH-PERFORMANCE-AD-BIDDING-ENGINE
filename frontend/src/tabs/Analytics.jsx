import { useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  requests: Math.floor(Math.random() * 1000) + 500,
  latency: Math.random() * 10,
}));

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Analytics
          </h1>
          <p className="text-text-secondary">Historical performance and trends</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-surface-light border border-surface-light rounded-lg text-text-primary"
        >
          <option value="1h">Last 1 hour</option>
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold mb-4">Performance Over Time</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#25253a" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #25253a' }} />
            <Line type="monotone" dataKey="requests" stroke="#00f0ff" strokeWidth={2} />
            <Line type="monotone" dataKey="latency" stroke="#a78bfa" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      <GlassCard>
        <h3 className="text-lg font-semibold mb-4">Request Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData.slice(0, 7)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#25253a" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #25253a' }} />
            <Bar dataKey="requests" fill="#00f0ff" />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );
}

