import GlassCard from '../components/ui/GlassCard';
import { Server, Database, Zap, Network } from 'lucide-react';

export default function Architecture() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-5xl font-black mb-4 text-blue-600" style={{ textShadow: '0 0 20px rgba(37, 99, 235, 0.6), 0 0 40px rgba(37, 99, 235, 0.3)' }}>
          System Architecture
        </h1>
        <p className="text-gray-700 text-lg font-bold">Interactive system diagram and component status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Network className="w-8 h-8 text-blue-600" style={{ filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))' }} />
            <div>
              <h3 className="font-black text-gray-800">Load Balancer</h3>
              <p className="text-sm text-gray-600 font-bold">NGINX</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-bold">Status</span>
              <span className="text-green-600 font-black">Operational</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-bold">Connections</span>
              <span className="text-gray-800 font-black">1,234</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Server className="w-8 h-8 text-purple-600" style={{ filter: 'drop-shadow(0 0 10px rgba(167, 139, 250, 0.8))' }} />
            <div>
              <h3 className="font-black text-gray-800">API Gateway</h3>
              <p className="text-sm text-gray-600 font-bold">Node.js</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-bold">Status</span>
              <span className="text-green-600 font-black">Operational</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-bold">Instances</span>
              <span className="text-gray-800 font-black">2</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-green-600" style={{ filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8))' }} />
            <div>
              <h3 className="font-black text-gray-800">Bidding Engine</h3>
              <p className="text-sm text-gray-600 font-bold">C++</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-bold">Status</span>
              <span className="text-green-600 font-black">Operational</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-bold">Instances</span>
              <span className="text-gray-800 font-black">3</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-8 h-8 text-orange-600" style={{ filter: 'drop-shadow(0 0 10px rgba(251, 146, 60, 0.8))' }} />
            <div>
              <h3 className="font-black text-gray-800">Data Layer</h3>
              <p className="text-sm text-gray-600 font-bold">PostgreSQL + Redis</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-bold">Status</span>
              <span className="text-green-600 font-black">Operational</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-bold">Cache Hit Rate</span>
              <span className="text-gray-800 font-black">85%</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
