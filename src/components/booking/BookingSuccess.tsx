import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, formatTime } from '../../utils/dateUtils';

interface BookingSuccessProps {
  date: string;
  time: string;
  isOnline: boolean;
  spotName?: string;
}

export function BookingSuccess({ date, time, isOnline, spotName }: BookingSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-900/20 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="mx-auto"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
          </motion.div>

          {/* Success Message */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-purple-900">
              تم حجز الجلسة بنجاح
            </h3>
            <p className="text-purple-600">
              سيتم مراجعة الحجز وتأكيده قريباً
            </p>
          </div>

          {/* Session Details */}
          <div className="bg-purple-50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div className="text-right">
                <p className="text-sm text-purple-600">موعد الجلسة</p>
                <p className="font-semibold text-purple-900">
                  {formatDate(date)} - {formatTime(time)}
                </p>
              </div>
            </div>
            <div className="text-sm text-purple-600">
              {isOnline ? (
                'سيتم إرسال رابط الجلسة عند التأكيد'
              ) : (
                <>الموقع: {spotName}</>
              )}
            </div>
          </div>

          {/* Action Button */}
          <Link
            to="/profile"
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            متابعة حجوزاتي
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}