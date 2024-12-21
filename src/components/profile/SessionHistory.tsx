import { motion } from 'framer-motion';
import { History, Calendar } from 'lucide-react';
import { BookingList } from '../booking/BookingList';

interface SessionHistoryProps {
  userId: string;
}

export function SessionHistory({ userId }: SessionHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <History className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-purple-900">سجل الجلسات</h3>
        </div>
        <button className="btn-secondary py-2 px-4 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          تقويم الجلسات
        </button>
      </div>
      
      <div className="space-y-4">
        <BookingList userId={userId} />
      </div>
    </motion.div>
  );
}