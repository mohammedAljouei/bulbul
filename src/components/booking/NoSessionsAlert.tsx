import { motion } from 'framer-motion';
import { AlertCircle, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NoSessionsAlert() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-900/20 backdrop-blur-sm"
    >
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center space-y-6">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto"
          >
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </motion.div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-purple-900">
              لا توجد جلسات متبقية
            </h3>
            <p className="text-purple-600">
              يجب تجديد اشتراكك لحجز جلسات جديدة
            </p>
          </div>

          {/* Action */}
          <Link
            to="/packages"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Package className="w-5 h-5" />
            اختر باقة جديدة
          </Link>
        </div>
      </div>
    </motion.div>
  );
}