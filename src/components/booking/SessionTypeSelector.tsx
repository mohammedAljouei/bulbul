import { motion } from 'framer-motion';
import { MapPin, Video } from 'lucide-react';
import { SessionType } from '../../types/booking';

interface SessionTypeSelectorProps {
  value: SessionType;
  onChange: (type: SessionType) => void;
}

export function SessionTypeSelector({ value, onChange }: SessionTypeSelectorProps) {
  const types = [
    { id: 'offline' as SessionType, icon: MapPin, label: 'حضوري' },
    { id: 'online' as SessionType, icon: Video, label: 'عن بعد' }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {types.map((type) => {
        const isSelected = value === type.id;
        const Icon = type.icon;
        
        return (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(type.id)}
            className={`relative p-6 rounded-2xl transition-all ${
              isSelected 
                ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20' 
                : 'bg-white/50 hover:bg-white/70 text-purple-900'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="activeType"
                className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl"
                initial={false}
                transition={{ type: "spring", bounce: 0.2 }}
              />
            )}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${
                isSelected ? 'bg-white/20' : 'bg-purple-100'
              } flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-purple-600'}`} />
              </div>
              <span className="font-semibold">{type.label}</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}