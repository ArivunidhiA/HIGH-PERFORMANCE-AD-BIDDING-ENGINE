import { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import GlassCard from '../components/ui/GlassCard';
import MetricCard from '../components/ui/MetricCard';
import { Activity, Clock, Zap, Shield } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Overview() {
  const socket = useSocket();
  const [metrics, setMetrics] = useState({
    requestsPerSec: 0,
    p99Latency: 0,
    throughput: 0,
    availability: 99.99,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('subscribe:metrics');
    socket.on('metrics', (data) => {
      setMetrics({
        requestsPerSec: data.requestsPerSec || 0,
        p99Latency: data.p99Latency || 0,
        throughput: data.throughput || 0,
        availability: data.availability || 99.99,
      });

      setChartData((prev) => {
        const newData = [...prev, { time: new Date().toLocaleTimeString(), value: data.requestsPerSec }];
        return newData.slice(-60); // Keep last 60 points
      });
    });

    return () => {
      socket.off('metrics');
    };
  }, [socket]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Overview Dashboard
        </h1>
        <p className="text-text-secondary">Real-time system metrics and performance</p>
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
          value={5.2}
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
        <GlassCard>
          <h3 className="text-lg font-semibold mb-4">Requests per Second</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#25253a" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #25253a' }} />
              <Line type="monotone" dataKey="value" stroke="#00f0ff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold mb-4">Latency Percentiles</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#25253a" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #25253a' }} />
              <Area type="monotone" dataKey="value" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
}

