import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useProfileStats } from '../hooks/useProfileStats';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ProfileForm } from '../components/profile/ProfileForm';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileStats } from '../components/profile/ProfileStats';
import { SessionHistory } from '../components/profile/SessionHistory';

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile(user?.id || '');
  const { stats, loading: statsLoading } = useProfileStats(user?.id || '');
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      toast.success('تم تسجيل الخروج بنجاح');
      navigate('/');
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="safe-area-view"
    >
      <div className="max-w-2xl mx-auto p-4 space-y-6 pt-12">
        <ProfileHeader
          email={user.email || ''}
          profile={profile}
          onLogout={handleSignOut}
          loading={loading}
        />

        {!profile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          >
            <ProfileForm userId={user.id} onComplete={() => navigate('/booking')} />
          </motion.div>
        ) : (
          <>
            <ProfileStats
              totalSessions={stats.totalSessions}
              completedSessions={stats.completedSessions}
              upcomingSessions={stats.upcomingSessions}
              streak={stats.streak}
              loading={statsLoading}
            />
            <SessionHistory userId={user.id} />
          </>
        )}
      </div>
    </motion.div>
  );
}