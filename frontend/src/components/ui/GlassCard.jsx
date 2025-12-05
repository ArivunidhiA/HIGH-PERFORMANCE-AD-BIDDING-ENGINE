import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg ${className}`}
      style={{ boxShadow: '0 0 25px rgba(59, 130, 246, 0.2), 0 0 50px rgba(59, 130, 246, 0.1)' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
