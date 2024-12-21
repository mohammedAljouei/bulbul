import { motion } from 'framer-motion';
import { Bird, Sparkles } from 'lucide-react';

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center z-50"
    >
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.4) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }} />
        </div>

        <div className="relative text-center space-y-6">
          {/* Animated Logo */}
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ 
              scale: [0.5, 1.2, 1],
              rotate: [-10, 10, 0]
            }}
            transition={{ 
              duration: 1,
              times: [0, 0.6, 1],
              ease: "easeOut"
            }}
            className="relative w-32 h-32 mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl rotate-6" />
            <div className="absolute inset-0 bg-white rounded-3xl flex items-center justify-center">
              <Bird className="w-16 h-16 text-purple-600" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-bold text-purple-900">
              بلبل
            </h1>
            <div className="flex items-center justify-center gap-2 text-purple-600">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span>تعلم الإنجليزية بسهولة</span>
            </div>
          </motion.div>

          {/* Loading Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center gap-2"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-3 h-3 rounded-full bg-purple-600"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}