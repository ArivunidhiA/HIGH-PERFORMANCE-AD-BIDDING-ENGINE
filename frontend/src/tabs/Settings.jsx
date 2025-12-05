import { useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { Save } from 'lucide-react';

export default function Settings() {
  const [threadPoolSize, setThreadPoolSize] = useState(8);
  const [circuitBreakerThreshold, setCircuitBreakerThreshold] = useState(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-text-secondary">Configure system parameters</p>
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold mb-6">System Configuration</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Thread Pool Size: {threadPoolSize}
            </label>
            <input
              type="range"
              min="1"
              max="32"
              value={threadPoolSize}
              onChange={(e) => setThreadPoolSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Circuit Breaker Threshold: {circuitBreakerThreshold}
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={circuitBreakerThreshold}
              onChange={(e) => setCircuitBreakerThreshold(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90">
            <Save className="w-4 h-4" />
            Apply Changes
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

