import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Video, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { useBookings } from '../../hooks/useBookings';
import { formatDate, formatTime } from '../../utils/dateUtils';
import type { BookingStatus } from '../../types/booking';

interface BookingListProps {
  userId: string;
}

export function BookingList({ userId }: BookingListProps) {
  const { bookings, loading } = useBookings(userId);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white/50 rounded-xl p-4 space-y-4">
              <div className="h-6 bg-purple-100/50 rounded w-1/3" />
              <div className="h-4 bg-purple-100/50 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="text-center py-8 text-purple-600">
        لا توجد حجوزات حالياً
      </div>
    );
  }

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-purple-500" />;
    }
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case 'completed':
        return 'مكتملة';
      case 'pending':
        return 'قيد الانتظار';
      case 'cancelled':
        return 'ملغية';
      default:
        return 'مؤكدة';
    }
  };

  const getStatusClass = (status: BookingStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking, index) => (
        <motion.div
          key={booking.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl p-4 space-y-4"
        >
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getStatusClass(booking.status)}`}>
              {getStatusIcon(booking.status)}
              {getStatusText(booking.status)}
            </span>
            {booking.is_online ? (
              <Video className="w-5 h-5 text-purple-600" />
            ) : (
              <MapPin className="w-5 h-5 text-purple-600" />
            )}
          </div>

          {/* Date & Time */}
          <div className="space-y-2 text-purple-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>{formatDate(booking.session_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>{formatTime(booking.session_time)}</span>
            </div>
          </div>

          {/* Location or Meeting Link */}
          {booking.is_online ? (
            booking.google_meet_link && (
              <a
                href={booking.google_meet_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-center block"
              >
                رابط الجلسة
              </a>
            )
          ) : (
            booking.spot && (
              <div className="text-sm text-purple-600">
                {booking.spot.name}
              </div>
            )
          )}
        </motion.div>
      ))}
    </div>
  );
}