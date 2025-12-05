import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
  color = 'cyan',
  sparkline,
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setDisplayValue(value || 0);
  }, [value]);

  const colorClasses = {
    cyan: {
      icon: 'text-cyan-600',
      value: 'text-cyan-600',
      bg: 'bg-cyan-100',
      border: 'border-cyan-500',
      solidBg: 'bg-white',
      glow: '0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(6, 182, 212, 0.2)',
      textGlow: '0 0 10px rgba(6, 182, 212, 0.6), 0 0 20px rgba(6, 182, 212, 0.4)',
      iconGlow: '0 0 15px rgba(6, 182, 212, 0.8)',
    },
    purple: {
      icon: 'text-purple-600',
      value: 'text-purple-600',
      bg: 'bg-purple-100',
      border: 'border-purple-500',
      solidBg: 'bg-white',
      glow: '0 0 20px rgba(167, 139, 250, 0.4), 0 0 40px rgba(167, 139, 250, 0.2)',
      textGlow: '0 0 10px rgba(167, 139, 250, 0.6), 0 0 20px rgba(167, 139, 250, 0.4)',
      iconGlow: '0 0 15px rgba(167, 139, 250, 0.8)',
    },
    green: {
      icon: 'text-green-600',
      value: 'text-green-600',
      bg: 'bg-green-100',
      border: 'border-green-500',
      solidBg: 'bg-white',
      glow: '0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.2)',
      textGlow: '0 0 10px rgba(16, 185, 129, 0.6), 0 0 20px rgba(16, 185, 129, 0.4)',
      iconGlow: '0 0 15px rgba(16, 185, 129, 0.8)',
    },
    blue: {
      icon: 'text-blue-600',
      value: 'text-blue-600',
      bg: 'bg-blue-100',
      border: 'border-blue-500',
      solidBg: 'bg-white',
      glow: '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)',
      textGlow: '0 0 10px rgba(59, 130, 246, 0.6), 0 0 20px rgba(59, 130, 246, 0.4)',
      iconGlow: '0 0 15px rgba(59, 130, 246, 0.8)',
    },
  };

  const colors = colorClasses[color];
  const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const showDecimals = numValue < 10 && label.includes('Latency');
  const showPercent = label.includes('Availability');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`${colors.solidBg} relative overflow-hidden border-2 ${colors.border} rounded-2xl shadow-lg`}
      style={{ boxShadow: colors.glow }}
    >
      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-3 rounded-xl ${colors.bg} border-2 ${colors.border}`}
            style={{ boxShadow: colors.glow }}
          >
            <Icon 
              className={`w-6 h-6 ${colors.icon}`}
              style={{ filter: `drop-shadow(${colors.iconGlow})` }}
            />
          </div>
          {trend !== undefined && trend !== null && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border-2 ${
                trend > 0 ? 'bg-green-100 text-green-700 border-green-500' : 'bg-red-100 text-red-700 border-red-500'
              }`}
              style={{ boxShadow: trend > 0 ? '0 0 15px rgba(16, 185, 129, 0.5)' : '0 0 15px rgba(239, 68, 68, 0.5)' }}
            >
              {trend > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-xs font-black">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-700 mb-2 font-bold">{label}</p>
          <p
            className={`text-5xl font-black ${colors.value}`}
            style={{ 
              lineHeight: '1.1',
              textShadow: colors.textGlow
            }}
          >
            {isVisible ? (
              <CountUp 
                start={0}
                end={numValue} 
                duration={1.5} 
                decimals={showDecimals ? 2 : 0}
                separator=","
                preserveValue
              />
            ) : (
              numValue.toLocaleString(undefined, { 
                minimumFractionDigits: showDecimals ? 2 : 0,
                maximumFractionDigits: showDecimals ? 2 : 0
              })
            )}
            {showDecimals && <span className="text-3xl ml-1">ms</span>}
            {showPercent && <span className="text-3xl ml-1">%</span>}
          </p>
        </div>
        {sparkline && (
          <div className="mt-4 h-12">
            {sparkline}
          </div>
        )}
      </div>
    </motion.div>
  );
}
