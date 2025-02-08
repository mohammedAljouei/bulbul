import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useSubscription } from '../hooks/useSubscription';
import { useUpdateLevel } from '../hooks/useUpdateLevel';
import { useCreateBooking } from '../hooks/useCreateBooking';
import { useSpots } from '../hooks/useSpots';
import { UserLevel } from '../types/database';
import { LevelSelector } from '../components/booking/LevelSelector';
import { BookingSuccess } from '../components/booking/BookingSuccess';
import { FirstTimeBookingState } from '../components/booking/FirstTimeBookingState';
import { NoSessionsAlert } from '../components/booking/NoSessionsAlert';
import { Teachers } from './Teachers';
import { SlotSelector } from '../components/booking/SlotSelector';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Booking() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile(user?.id || '');
  const { subscription } = useSubscription();
  const { createBooking, loading } = useCreateBooking();
  const { updateLevel } = useUpdateLevel();
  const { spots } = useSpots();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNoSessions, setShowNoSessions] = useState(false);
  const [showSlotSelector, setShowSlotSelector] = useState(false);
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  // Check for remaining sessions when subscription changes
  useEffect(() => {
    if (subscription && subscription.remaining_sessions <= 0) {
      setShowNoSessions(true);
      // Redirect to packages after delay
      const timer = setTimeout(() => {
        navigate('/packages');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [subscription, navigate]);

  // Show level selector if profile exists but no level is set
  useEffect(() => {
    if (profile && !profile.level && !showLevelSelector) {
      setShowLevelSelector(true);
    }
  }, [profile]);

  const handleLevelSelect = async (level: UserLevel) => {
    // Close modal immediately
    setShowLevelSelector(false);
    
    // Update level in background
    try {
      const success = await updateLevel(level);
      if (success) {
        toast.success('تم تحديث المستوى بنجاح');
      } else {
        toast.error('حدث خطأ أثناء تحديث المستوى');
      }
    } catch (error) {
      console.error('Level update error:', error);
      toast.error('حدث خطأ أثناء تحديث المستوى');
    }
  };

  const handleCreateBooking = async (details: any) => {
    if (!user || !subscription) return;

    if (subscription.remaining_sessions <= 0) {
      setShowNoSessions(true);
      return;
    }

    const { success } = await createBooking({
      userId: user.id,
      subscriptionId: subscription.id,
      date: details.date,
      time: details.time,
      sessionType: details.sessionType,
      spotId: details.spotId
    });

    if (success) {
      setShowSuccess(true);
      setShowSlotSelector(false);
      // Clear booking details after delay and redirect
      setTimeout(() => {
        setBookingDetails(null);
        setSelectedTeacher(null);
        navigate('/profile');
      }, 2000);
    }
  };

  // Handle different user states
  if (!user) {
    return (
      <div className="safe-area-view">
        <Teachers onBookingAttempt={() => navigate('/auth')} />
      </div>
    );
  }

  if (profileLoading) {
    return null;
  }

  if (!profile) {
    navigate('/profile');
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="safe-area-view"
    >
      <Teachers 
        onBookingAttempt={(teacher) => {
          if (!subscription || subscription.remaining_sessions <= 0) {
            setShowNoSessions(true);
          } else {
            setSelectedTeacher(teacher);
            setShowSlotSelector(true);
          }
        }}
      />

      {showLevelSelector && (
        <LevelSelector
          value={profile?.level}
          onChange={handleLevelSelect}
          onComplete={() => setShowLevelSelector(false)}
        />
      )}

      {showSlotSelector && selectedTeacher && (
        <SlotSelector
          teacherName={selectedTeacher.name}
          onSelect={(details) => {
            setBookingDetails(details);
            handleCreateBooking(details);
          }}
          onClose={() => setShowSlotSelector(false)}
        />
      )}

      {showSuccess && bookingDetails && (
        <BookingSuccess
          date={bookingDetails.date}
          time={bookingDetails.time}
          isOnline={bookingDetails.sessionType === 'online'}
          spotName={spots.find(s => s.id === bookingDetails.spotId)?.name}
        />
      )}

      {showNoSessions && (
        <NoSessionsAlert onClose={() => setShowNoSessions(false)} />
      )}
    </motion.div>
  );
}