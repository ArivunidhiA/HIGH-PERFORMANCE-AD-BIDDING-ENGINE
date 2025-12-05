import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', padding = 'md' }) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`
        bg-surface/50 backdrop-blur-md border border-surface-light rounded-xl
        ${paddingClasses[padding]} ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

