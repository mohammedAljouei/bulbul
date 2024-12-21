import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Spot } from '../types/database';

export function useSpots() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpots() {
      try {
        const { data, error } = await supabase
          .from('spots')
          .select('*')
          .eq('active', true)
          .order('name');

        if (error) throw error;
        setSpots(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل المواقع');
      } finally {
        setLoading(false);
      }
    }

    fetchSpots();
  }, []);

  return { spots, loading, error };
}