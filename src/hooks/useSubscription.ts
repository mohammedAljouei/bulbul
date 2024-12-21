import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { UserSubscription } from '../types/database';
import { useAuth } from '../contexts/AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const fetchSubscription = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*, package:packages(*)')
        .eq('user_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setSubscription(data);
    } catch (err) {
      console.error('Subscription error:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل الاشتراك');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Handle real-time updates
  useEffect(() => {
    if (!user) return;

    fetchSubscription();

    // Set up real-time subscription
    const newChannel = supabase
      .channel(`subscriptions:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_subscriptions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' && subscription?.id === payload.new.id) {
            const newData = payload.new;
            setSubscription(prev => 
              prev ? { ...prev, ...newData } : null
            );

            // Show notifications for remaining sessions
            if (newData.remaining_sessions <= 2) {
              toast.error(`تنبيه: متبقي لديك ${newData.remaining_sessions} جلسات فقط`);
            }
          }
        }
      )
      .subscribe();

    setChannel(newChannel);

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [user, subscription?.id]);

  return { subscription, loading, error, refetch: fetchSubscription };
}