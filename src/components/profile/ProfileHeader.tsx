import { motion } from 'framer-motion';
import { LogOut, User as UserIcon, Settings } from 'lucide-react';
import type { UserProfile } from '../../types/database';

interface ProfileHeaderProps {
  email: string;
  profile: UserProfile | null;
  onLogout: () => void;
  loading: boolean;
}

export function ProfileHeader({ email, profile, onLogout, loading }: ProfileHeaderProps) {
  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }} />
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-8"
      >
        <div className="flex flex-col items-center text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="relative mb-4"
          >
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
              <UserIcon className="w-12 h-12" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-400 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-1"
          >
            <h2 className="text-2xl font-bold">
              {profile?.first_name || 'مرحباً'}
            </h2>
            <p className="text-white/80 text-sm">{email}</p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onLogout}
            disabled={loading}
            className="mt-6 bg-white/10 backdrop-blur-md px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-white/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}