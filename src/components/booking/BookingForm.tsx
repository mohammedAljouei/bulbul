import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Video } from 'lucide-react';
import { useSpots } from '../../hooks/useSpots';
import { SessionType } from '../../types/booking';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import { useCreateBooking } from '../../hooks/useCreateBooking';
import { Link } from 'react-router-dom';
import { DatePicker } from '../common/DatePicker';
import { TimePicker } from '../common/TimePicker';

interface BookingFormProps {
  subscriptionId: string;
  onSuccess: () => void;
}

export function BookingForm({ subscriptionId, onSuccess }: BookingFormProps) {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { spots, loading: spotsLoading } = useSpots();
  const { createBooking, loading } = useCreateBooking();
  const [sessionType, setSessionType] = useState<SessionType>('offline');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [spotId, setSpotId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !subscription || subscription.remaining_sessions <= 0) return;

    const bookingSpotId = sessionType === 'offline' && spotId ? spotId : null;

    const { success } = await createBooking({
      userId: user.id,
      subscriptionId,
      date,
      time,
      sessionType,
      spotId: bookingSpotId
    });

    if (success) {
      onSuccess();
    }
  };

  if (!subscription) return null;

  if (subscription.remaining_sessions <= 0) {
    return (
      <div className="text-center space-y-4 p-4">
        <p className="text-red-600">لا يوجد لديك جلسات متبقية</p>
        <Link to="/packages" className="btn-primary inline-block">
          تجديد الاشتراك
        </Link>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-4"
      onSubmit={handleSubmit}
    >
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2
            ${sessionType === 'offline' 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
              : 'bg-white/50 text-purple-800 hover:bg-white/70'}`}
          onClick={() => {
            setSessionType('offline');
            setSpotId('');
          }}
        >
          <MapPin className="w-4 h-4" />
          حضوري
        </button>
        <button
          type="button"
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2
            ${sessionType === 'online'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'bg-white/50 text-purple-800 hover:bg-white/70'}`}
          onClick={() => {
            setSessionType('online');
            setSpotId('');
          }}
        >
          <Video className="w-4 h-4" />
          عن بعد
        </button>
      </div>

      <div className="space-y-6">
        <DatePicker value={date} onChange={setDate} />
        <TimePicker value={time} onChange={setTime} />

        {sessionType === 'offline' && (
          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">
              <MapPin className="w-4 h-4 inline-block ml-2" />
              الموقع
            </label>
            {spotsLoading ? (
              <div className="text-center py-2">جاري تحميل المواقع...</div>
            ) : (
              <select
                required
                className="form-input"
                value={spotId}
                onChange={(e) => setSpotId(e.target.value)}
              >
                <option value="">اختر الموقع</option>
                {spots.map((spot) => (
                  <option key={spot.id} value={spot.id}>
                    {spot.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="btn-primary w-full py-3"
        disabled={loading || (sessionType === 'offline' && !spotId)}
      >
        {loading ? 'جاري الحجز...' : 'تأكيد الحجز'}
      </button>
    </motion.form>
  );
}