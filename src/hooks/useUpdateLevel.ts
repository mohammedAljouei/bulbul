import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserLevel } from '../types/database';
import { toast } from 'react-hot-toast';

export function useUpdateLevel() {
  const [loading, setLoading] = useState(false);

  const updateLevel = async (level: UserLevel) => {
    setLoading(true);
    try {
      const { error } = await supabase.rpc('update_user_level', {
        p_level: level
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating level:', error);
      toast.error('حدث خطأ أثناء تحديث المستوى');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateLevel, loading };
}