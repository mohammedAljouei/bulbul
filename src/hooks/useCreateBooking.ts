import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { SessionType } from '../types/booking';

interface CreateBookingParams {
  userId: string;
  subscriptionId: string;
  date: string;
  time: string;
  sessionType: SessionType;
  spotId?: string | null;
}

export function useCreateBooking() {
  const [loading, setLoading] = useState(false);

  const createBooking = async ({
    userId,
    subscriptionId,
    date,
    time,
    sessionType,
    spotId
  }: CreateBookingParams) => {
    setLoading(true);

    try {
      const { error } = await supabase.rpc('create_booking', {
        p_subscription_id: subscriptionId,
        p_session_date: date,
        p_session_time: time,
        p_is_online: sessionType === 'online',
        p_spot_id: sessionType === 'offline' ? spotId : null
      });

      if (error) throw error;
      
      toast.success('تم حجز الجلسة بنجاح');
      return { success: true };
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('حدث خطأ أثناء حجز الجلسة');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading };
}