import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Bird, Sparkles, ArrowRight } from 'lucide-react';

export function NoSessionsState() {
  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        {/* Background with pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl opacity-10" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.3) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }} />

        {/* Content */}
        <div className="relative p-8 text-center space-y-8">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="relative mx-auto w-32 h-32"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl rotate-6" />
            <div className="absolute inset-0 bg-white rounded-3xl flex items-center justify-center">
              <Bird className="w-16 h-16 text-purple-600" />
            </div>
          </motion.div>

          {/* Text Content */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <h2 className="text-3xl font-bold text-purple-900">
                لا توجد جلسات متبقية
              </h2>
              <div className="flex items-center justify-center gap-2 text-purple-600">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <p>جدد اشتراكك واستمر في رحلة تعلم اللغة الإنجليزية</p>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-4 max-w-sm mx-auto"
            >
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4">
                <Package className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-purple-600">باقات متنوعة</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4">
                <Bird className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-purple-600">مدرسون محترفون</p>
              </div>
            </motion.div>
          </div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link 
              to="/packages" 
              className="btn-primary inline-flex items-center gap-2 px-8 py-4"
            >
              اختر باقة جديدة
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}