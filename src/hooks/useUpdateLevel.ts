import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserLevel } from '../types/database';
import { toast } from 'react-hot-toast';

export function useUpdateLevel() {
  const [loading, setLoading] = useState(false);

  const updateLevel = async (level: UserLevel) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Update the profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          level,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Verify the update by fetching the profile
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('level')
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      // Verify the level was actually updated
      if (profile.level !== level) {
        throw new Error('Level update verification failed');
      }
      
      toast.success('تم تحديث المستوى بنجاح');
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