import GlassCard from '../components/ui/GlassCard';
import { Server, Database, Zap, Network } from 'lucide-react';

export default function Architecture() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          System Architecture
        </h1>
        <p className="text-text-secondary">Interactive system diagram and component status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Network className="w-8 h-8 text-primary" />
            <div>
              <h3 className="font-semibold">Load Balancer</h3>
              <p className="text-sm text-text-secondary">NGINX</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Status</span>
              <span className="text-success">Operational</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Connections</span>
              <span className="text-text-primary">1,234</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Server className="w-8 h-8 text-secondary" />
            <div>
              <h3 className="font-semibold">API Gateway</h3>
              <p className="text-sm text-text-secondary">Node.js</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Status</span>
              <span className="text-success">Operational</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Instances</span>
              <span className="text-text-primary">2</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-success" />
            <div>
              <h3 className="font-semibold">Bidding Engine</h3>
              <p className="text-sm text-text-secondary">C++</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Status</span>
              <span className="text-success">Operational</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Instances</span>
              <span className="text-text-primary">3</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-8 h-8 text-warning" />
            <div>
              <h3 className="font-semibold">Data Layer</h3>
              <p className="text-sm text-text-secondary">PostgreSQL + Redis</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Status</span>
              <span className="text-success">Operational</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Cache Hit Rate</span>
              <span className="text-text-primary">85%</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

