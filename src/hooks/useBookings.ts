import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Booking } from '../types/database';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useBookingsStore } from '../stores/bookingsStore';
import { handleBookingUpdate } from '../utils/bookingUtils';

export function useBookings(userId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  
  const { bookings, setBookings, addBooking, updateBooking, removeBooking } = useBookingsStore();

  const fetchBookings = useCallback(async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          spot:spots (
            id,
            name,
            google_maps_url
          )
        `)
        .eq('user_id', userId)
        .order('session_date', { ascending: false })
        .order('session_time', { ascending: true });

      if (error) throw error;

      // Group bookings by status
      const groupedBookings = (data || []).reduce((acc: any, booking) => {
        const status = booking.status;
        if (!acc[status]) {
          acc[status] = [];
        }
        acc[status].push(booking);
        return acc;
      }, {});

      // Sort each group by date
      Object.keys(groupedBookings).forEach(status => {
        groupedBookings[status].sort((a: Booking, b: Booking) => {
          const dateA = new Date(a.session_date + 'T' + a.session_time);
          const dateB = new Date(b.session_date + 'T' + b.session_time);
          return dateB.getTime() - dateA.getTime();
        });
      });

      // Combine groups in the desired order
      const orderedBookings = [
        ...(groupedBookings['pending'] || []),
        ...(groupedBookings['confirmed'] || []),
        ...(groupedBookings['completed'] || []),
        ...(groupedBookings['cancelled'] || [])
      ];

      setBookings(orderedBookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Error fetching bookings');
    } finally {
      setLoading(false);
    }
  }, [userId, setBookings]);

  // Handle real-time updates
  useEffect(() => {
    if (!userId) return;

    fetchBookings();

    // Set up real-time subscription
    const newChannel = supabase
      .channel(`bookings:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${userId}`
        },
        (payload) => handleBookingUpdate(payload, { addBooking, updateBooking, removeBooking })
      )
      .subscribe();

    setChannel(newChannel);

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [userId, fetchBookings, addBooking, updateBooking, removeBooking]);

  return { bookings, loading, error, refetch: fetchBookings };
}