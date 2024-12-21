import { motion } from 'framer-motion';
import { Calendar, Bird } from 'lucide-react';
import type { UserSubscription } from '../../types/database';

interface BookingHeaderProps {
  subscription: UserSubscription;
}

export function BookingHeader({ subscription }: BookingHeaderProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center"
            >
              <Calendar className="w-8 h-8" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold">حجز جلسة جديدة</h2>
              <p className="text-white/80">اختر الوقت والمكان المناسب لك</p>
            </div>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center bg-white/20 backdrop-blur-md rounded-2xl p-4"
          >
            <p className="text-sm opacity-80">الجلسات المتبقية</p>
            <p className="text-3xl font-bold">{subscription.remaining_sessions}</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}