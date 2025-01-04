import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Trophy } from 'lucide-react';
import type { UserLevel } from '../../types/database';

interface LevelSelectorProps {
  value?: UserLevel;
  onChange: (level: UserLevel) => void;
  onComplete: () => void;
}

export function LevelSelector({ value, onChange, onComplete }: LevelSelectorProps) {
  const levels = [
    {
      id: 'beginner' as UserLevel,
      icon: BookOpen,
      title: 'مبتدئ',
      description: 'أتعلم الإنجليزية من البداية'
    },
    {
      id: 'intermediate' as UserLevel,
      icon: GraduationCap,
      title: 'متوسط',
      description: 'لدي أساسيات اللغة وأريد تطويرها'
    },
    {
      id: 'advanced' as UserLevel,
      icon: Trophy,
      title: 'متقدم',
      description: 'أريد تحسين مهاراتي المتقدمة'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-900/20 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
      >
        <div className="text-center space-y-4 mb-8">
          <h3 className="text-2xl font-bold text-purple-900">
            ما هو مستواك في اللغة الإنجليزية؟
          </h3>
          <p className="text-purple-600">
            اختر مستواك لنقدم لك تجربة تعليمية مناسبة
          </p>
        </div>

        <div className="space-y-4">
          {levels.map((level) => (
            <motion.button
              key={level.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onChange(level.id);
                onComplete();
              }}
              className={`w-full p-6 rounded-2xl text-right transition-all flex items-center gap-4
                ${value === level.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                  : 'bg-white/50 hover:bg-white/70 text-purple-900 border border-purple-100'
                }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                ${value === level.id ? 'bg-white/20' : 'bg-purple-100'}`}
              >
                <level.icon className={`w-6 h-6 ${
                  value === level.id ? 'text-white' : 'text-purple-600'
                }`} />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">{level.title}</h4>
                <p className={`text-sm ${
                  value === level.id ? 'text-white/80' : 'text-purple-600'
                }`}>
                  {level.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}