import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface ProfileStats {
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  streak: number;
}

export function useProfileStats(userId: string) {
  const [stats, setStats] = useState<ProfileStats>({
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    streak: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get all bookings for the user
        const { data: bookings, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', userId)
          .order('session_date', { ascending: false });

        if (error) throw error;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Calculate stats
        const stats = {
          totalSessions: bookings?.length || 0,
          completedSessions: bookings?.filter(b => b.status === 'completed').length || 0,
          upcomingSessions: bookings?.filter(b => {
            const sessionDate = new Date(b.session_date);
            return sessionDate >= today && b.status !== 'cancelled';
          }).length || 0,
          streak: calculateStreak(bookings || [])
        };

        setStats(stats);
      } catch (err) {
        console.error('Error fetching profile stats:', err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchStats();
    }
  }, [userId]);

  return { stats, loading };
}

function calculateStreak(bookings: any[]): number {
  if (!bookings.length) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter completed sessions and sort by date
  const completedSessions = bookings
    .filter(b => b.status === 'completed')
    .map(b => new Date(b.session_date))
    .sort((a, b) => b.getTime() - a.getTime());

  if (!completedSessions.length) return 0;

  let streak = 0;
  let currentDate = today;
  let lastSessionDate = completedSessions[0];

  // If no session today, check if there was one yesterday
  if (lastSessionDate < today) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastSessionDate < yesterday) return 0;
    currentDate = yesterday;
  }

  // Calculate streak
  for (const sessionDate of completedSessions) {
    if (sessionDate <= currentDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}