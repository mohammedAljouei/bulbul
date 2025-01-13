import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useSubscription } from '../hooks/useSubscription';
import { useUpdateLevel } from '../hooks/useUpdateLevel';
import { BookingHeader } from '../components/booking/BookingHeader';
import { SessionTypeSelector } from '../components/booking/SessionTypeSelector';
import { SpotSelector } from '../components/booking/SpotSelector';
import { DatePicker } from '../components/common/DatePicker';
import { TimePicker } from '../components/common/TimePicker';
import { BookingSuccess } from '../components/booking/BookingSuccess';
import { NoSessionsState } from '../components/booking/NoSessionsState';
import { FirstTimeBookingState } from '../components/booking/FirstTimeBookingState';
import { LevelSelector } from '../components/booking/LevelSelector';
import { useCreateBooking } from '../hooks/useCreateBooking';
import { SessionType } from '../types/booking';
import { UserLevel } from '../types/database';
import { useSpots } from '../hooks/useSpots';

export default function Booking() {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id || '');
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { createBooking, loading } = useCreateBooking();
  const { updateLevel, loading: updatingLevel } = useUpdateLevel();
  const { spots } = useSpots();
  const [sessionType, setSessionType] = useState<SessionType>('offline');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [spotId, setSpotId] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLevelSelector, setShowLevelSelector] = useState(!profile?.level);


  const isFormValid =  date && time && (sessionType === 'online' || (sessionType === 'offline' && spotId));


  const handleLevelSelect = async (level: UserLevel) => {
    const success = await updateLevel(level);
    if (success) {
      setShowLevelSelector(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    
    if (!user || !subscription || subscription.remaining_sessions <= 0 || !isFormValid) return;
   

    const bookingSpotId = sessionType === 'offline' && spotId ? spotId : null;

    const { success } = await createBooking({
      userId: user.id,
      subscriptionId: subscription.id,
      date,
      time,
      sessionType,
      spotId: bookingSpotId
    });

    if (success) {
      setShowSuccess(true);
    }
  };

  if (!user || subscriptionLoading) return null;

  if (!subscription) {
    return (
      <div className="safe-area-view p-4">
        <FirstTimeBookingState />
      </div>
    );
  }

  if (subscription.remaining_sessions <= 0) {
    return (
      <div className="safe-area-view p-4">
        <NoSessionsState />
      </div>
    );
  }

  const selectedSpot = spots.find(spot => spot.id === spotId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="safe-area-view"
    >
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <BookingHeader subscription={subscription} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"

        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg space-y-6">
            <SessionTypeSelector value={sessionType} onChange={setSessionType} />
            
            {sessionType === 'offline' && (
              <SpotSelector value={spotId} onChange={setSpotId} />
            )}
            
            <DatePicker value={date} onChange={setDate} />
            <TimePicker value={time} onChange={setTime} />
            
            <button
              // type="submit"
              onClick={(e)=>{

               
                
                handleSubmit(e);
              }}
              className="btn-primary w-full py-4"
              disabled={loading || !isFormValid || updatingLevel}
            >
              {loading ? 'جاري الحجز...' : 'تأكيد الحجز'}
            </button>
          </div>
        </motion.div>

        {showSuccess && (
          <BookingSuccess
            date={date}
            time={time}
            isOnline={sessionType === 'online'}
            spotName={selectedSpot?.name}
          />
        )}

        {showLevelSelector && (
          <LevelSelector
            value={profile?.level}
            onChange={handleLevelSelect}
            onComplete={() => setShowLevelSelector(false)}
          />
        )}
      </div>
    </motion.div>
  );
}