import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
  color = 'cyan',
  sparkline,
}) {
  const colorClasses = {
    cyan: 'from-cyan-500 to-blue-500',
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-indigo-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} bg-opacity-20`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 ${trend > 0 ? 'text-success' : 'text-error'}`}>
            {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-text-secondary mb-2">{label}</p>
        <p className={`text-3xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
          <CountUp end={value} duration={2} decimals={2} />
        </p>
      </div>
      {sparkline && (
        <div className="mt-4 h-12">
          {sparkline}
        </div>
      )}
    </motion.div>
  );
}

