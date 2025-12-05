import { useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { Save } from 'lucide-react';

export default function Settings() {
  const [threadPoolSize, setThreadPoolSize] = useState(8);
  const [circuitBreakerThreshold, setCircuitBreakerThreshold] = useState(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-5xl font-black mb-4 text-blue-600" style={{ textShadow: '0 0 20px rgba(37, 99, 235, 0.6), 0 0 40px rgba(37, 99, 235, 0.3)' }}>
          Settings
        </h1>
        <p className="text-gray-700 text-lg font-bold">Configure system parameters</p>
      </div>

      <GlassCard>
        <h3 className="text-lg font-black text-gray-800 mb-6">System Configuration</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2">
              Thread Pool Size: {threadPoolSize}
            </label>
            <input
              type="range"
              min="1"
              max="32"
              value={threadPoolSize}
              onChange={(e) => setThreadPoolSize(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2">
              Circuit Breaker Threshold: {circuitBreakerThreshold}
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={circuitBreakerThreshold}
              onChange={(e) => setCircuitBreakerThreshold(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-black hover:bg-blue-700 transition-colors shadow-lg"
            style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}
          >
            <Save className="w-4 h-4" />
            Apply Changes
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
