import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Zap,
  Network,
  BarChart3,
  Target,
  Settings,
  ChevronLeft,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { path: '/dashboard/live-bidding', icon: Zap, label: 'Live Bidding' },
  { path: '/dashboard/architecture', icon: Network, label: 'Architecture' },
  { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/dashboard/campaigns', icon: Target, label: 'Campaigns' },
  { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ open, setOpen }) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? 280 : 80 }}
      className="relative bg-white border-r border-gray-200 flex flex-col shadow-sm"
    >
      <div className="relative p-6 flex items-center justify-between border-b border-gray-200">
        {open && (
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-black text-blue-600" style={{ textShadow: '0 0 15px rgba(37, 99, 235, 0.5)' }}>
            Bidding Platform
          </motion.h1>
        )}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(!open)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
        >
          <ChevronLeft
            className={`w-5 h-5 text-blue-600 transition-transform ${!open ? 'rotate-180' : ''}`}
            style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))' }}
          />
        </motion.button>
      </div>
      <nav className="relative flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-blue-100 text-blue-600 border-2 border-blue-500'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800 border-2 border-transparent hover:border-gray-300'
              }`
            }
            style={({ isActive }) => isActive ? { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' } : {}}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-100 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className={`relative z-10 p-2.5 rounded-lg ${
                    isActive
                      ? 'bg-blue-200'
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}
                  style={isActive ? { boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' } : {}}
                >
                  <item.icon 
                    className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-600 group-hover:text-gray-800'}`}
                    style={isActive ? { filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))' } : {}}
                  />
                </motion.div>
                {open && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative z-10 font-bold"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && (
                  <motion.div
                    className="absolute right-2 w-1.5 h-1.5 bg-blue-600 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ boxShadow: '0 0 10px rgba(59, 130, 246, 0.8)' }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
}
