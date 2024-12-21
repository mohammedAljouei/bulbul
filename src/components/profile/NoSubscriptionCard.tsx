import { motion } from 'framer-motion';
import { Bird, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NoSubscriptionCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card text-center p-8 space-y-6"
    >
      <Bird className="w-16 h-16 text-purple-600 mx-auto" />
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-purple-900">لا يوجد لديك اشتراك نشط</h3>
        <p className="text-purple-700">اختر باقة مناسبة وابدأ رحلة تعلم اللغة الإنجليزية</p>
      </div>
      <Link 
        to="/packages" 
        className="btn-primary inline-flex items-center gap-2"
      >
        <Package className="w-4 h-4" />
        اختر باقة
      </Link>
    </motion.div>
  );
}