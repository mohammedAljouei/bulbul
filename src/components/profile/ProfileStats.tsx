import { motion } from 'framer-motion';
import { Calendar, Clock, Target, Award } from 'lucide-react';

interface ProfileStatsProps {
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  streak: number;
  loading?: boolean;
}

export function ProfileStats({ totalSessions, completedSessions, upcomingSessions, streak, loading }: ProfileStatsProps) {
  const stats = [
    { icon: Calendar, label: 'إجمالي الجلسات', value: totalSessions },
    { icon: Clock, label: 'الجلسات المكتملة', value: completedSessions },
    { icon: Target, label: 'الجلسات القادمة', value: upcomingSessions },
    { icon: Award, label: 'أيام متتالية', value: streak },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg animate-pulse"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100/50" />
              <div className="h-4 w-24 bg-purple-100/50 rounded" />
            </div>
            <div className="h-8 w-16 bg-purple-100/50 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
              <stat.icon className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-sm text-purple-600">{stat.label}</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}