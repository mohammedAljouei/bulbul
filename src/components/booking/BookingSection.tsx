import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { BookingList } from './BookingList';

interface BookingSectionProps {
  userId: string;
}

export function BookingSection({ userId }: BookingSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-purple-600" />
        <h3 className="text-xl font-bold text-purple-900">حجوزاتي</h3>
      </div>
      <BookingList userId={userId} />
    </motion.div>
  );
}