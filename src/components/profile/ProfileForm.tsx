import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface ProfileFormProps {
  onComplete: () => void;
  userId: string;
}

export function ProfileForm({ onComplete, userId }: ProfileFormProps) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: userId,
            first_name: firstName,
          },
        ]);

      if (error) throw error;

      
      
      toast.success('تم حفظ المعلومات بنجاح');
      onComplete();
      navigate('/booking'); // Redirect to booking page after successful profile creation
    } catch (error) {
      console.error('Profile error:', error);
      toast.error('حدث خطأ أثناء حفظ المعلومات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block text-sm font-medium text-purple-900 mb-1">
          الاسم الأول
        </label>
        <input
          type="text"
          required
          className="form-input"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="للحجز، أدخل اسمك الأول"
          minLength={2}
          maxLength={50}
        />
      </div>

      <button
        type="submit"
        className="btn-primary w-full py-3"
        disabled={loading}
      >
        {loading ? 'جاري الحفظ...' : 'متابعة'}
      </button>
    </motion.form>
  );
}