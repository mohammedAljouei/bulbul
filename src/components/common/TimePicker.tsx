import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  // Available time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    return new Date(0, 0, 0, parseInt(hours), parseInt(minutes))
      .toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-purple-900">
        <Clock className="w-4 h-4 inline-block ml-2" />
        الوقت
      </label>
      <div className="grid grid-cols-2 gap-2">
        {timeSlots.map((time) => (
          <motion.button
            key={time}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(time)}
            className={`p-3 rounded-lg text-center transition-all ${
              value === time
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                : 'bg-white/50 text-purple-800 hover:bg-white/70'
            }`}
          >
            {formatTime(time)}
          </motion.button>
        ))}
      </div>
    </div>
  );
}