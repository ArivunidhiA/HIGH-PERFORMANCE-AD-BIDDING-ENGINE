import { motion } from 'framer-motion';
import { Zap, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TopBar() {
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white border-b border-gray-200 px-8 py-5 shadow-sm"
    >
      <div className="relative flex items-center justify-between">
        <motion.div
          className="flex items-center gap-4 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/')}
        >
          <div className="relative p-2 bg-blue-100 rounded-xl border border-blue-500" style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}>
            <Zap className="w-6 h-6 text-blue-600" style={{ filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-blue-600" style={{ textShadow: '0 0 15px rgba(37, 99, 235, 0.5)' }}>
              High-Performance Ad Bidding Engine
            </h1>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Activity className="w-3 h-3 text-green-500" style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))' }} />
              <span>Production-Ready SaaS Platform</span>
            </p>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-green-100 border border-green-500 rounded-full" style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
            <span className="text-sm font-black text-green-700 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" style={{ boxShadow: '0 0 10px rgba(16, 185, 129, 0.8)' }} />
              System Operational
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
