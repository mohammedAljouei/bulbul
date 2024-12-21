import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useSpots } from '../../hooks/useSpots';

interface SpotSelectorProps {
  value: string;
  onChange: (spotId: string) => void;
}

export function SpotSelector({ value, onChange }: SpotSelectorProps) {
  const { spots, loading } = useSpots();

  if (loading) {
    return (
      <div className="text-center py-4 text-purple-600">
        جاري تحميل المواقع...
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {spots.map((spot, index) => (
        <motion.button
          key={spot.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onChange(spot.id)}
          className={`p-4 rounded-2xl transition-all ${
            value === spot.id
              ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg'
              : 'bg-white/50 hover:bg-white/70 text-purple-900'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${
              value === spot.id ? 'bg-white/20' : 'bg-purple-100'
            } flex items-center justify-center`}>
              <MapPin className={value === spot.id ? 'text-white' : 'text-purple-600'} />
            </div>
            <div className="text-right">
              <p className="font-semibold">{spot.name}</p>
              <a
                href={spot.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm ${
                  value === spot.id ? 'text-white/80' : 'text-purple-600'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                عرض الموقع
              </a>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}