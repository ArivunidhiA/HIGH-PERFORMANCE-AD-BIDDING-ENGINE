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
      animate={{ width: open ? 256 : 80 }}
      className="bg-surface border-r border-surface-light flex flex-col"
    >
      <div className="p-4 flex items-center justify-between">
        {open && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Bidding Platform
          </h1>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 hover:bg-surface-light rounded-lg transition-colors"
        >
          <ChevronLeft
            className={`w-5 h-5 transition-transform ${!open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
      <nav className="flex-1 px-4 py-2 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-text-secondary hover:bg-surface-light hover:text-text-primary'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {open && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
}

