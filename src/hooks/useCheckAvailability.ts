import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { SessionType } from '../types/booking';

interface CheckAvailabilityParams {
  date: string;
  time: string;
  sessionType: SessionType;
  spotId?: string;
}

export function useCheckAvailability() {
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const checkAvailability = async ({
    date,
    time,
    sessionType,
    spotId
  }: CheckAvailabilityParams) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('check_booking_availability', {
        p_session_date: date,
        p_session_time: time,
        p_spot_id: sessionType === 'offline' ? spotId : null
      });

      if (error) throw error;
      setIsAvailable(data);
      return data;
    } catch (error) {
      console.error('Availability check error:', error);
      setIsAvailable(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { checkAvailability, isAvailable, loading };
}