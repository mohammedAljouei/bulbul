import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  minDate?: string;
}

export function DatePicker({ value, onChange, minDate = new Date().toISOString().split('T')[0] }: DatePickerProps) {
  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Format the day name
    const dayName = date.toLocaleDateString('ar-SA', { weekday: 'long' });
    
    // Format the date
    const formattedDate = date.toLocaleDateString('ar-SA', {
      day: 'numeric',
      month: 'long'
    });

    // Check if it's today or tomorrow
    if (date.toDateString() === today.toDateString()) {
      return (
        <div className="space-y-1">
          <div className="font-semibold">اليوم</div>
          <div className="text-sm opacity-80">{formattedDate}</div>
        </div>
      );
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return (
        <div className="space-y-1">
          <div className="font-semibold">غداً</div>
          <div className="text-sm opacity-80">{formattedDate}</div>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <div className="font-semibold">{dayName}</div>
        <div className="text-sm opacity-80">{formattedDate}</div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-purple-900">
          <Calendar className="w-4 h-4" />
          اختر التاريخ
        </label>
        {value && (
          <div className="text-sm text-purple-600">
            {new Date(value).toLocaleDateString('ar-SA', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        )}
      </div>

      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
          <button
            type="button"
            className="p-2 rounded-full bg-white/50 text-purple-600 hover:bg-white/70 transition-colors"
            onClick={() => {
              const container = document.getElementById('dates-container');
              if (container) {
                container.scrollBy({ left: -200, behavior: 'smooth' });
              }
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div 
          id="dates-container"
          className="flex gap-3 overflow-x-auto hide-scrollbar py-2 px-10 -mx-10 scroll-smooth"
        >
          {dates.map((date) => (
            <motion.button
              key={date}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(date)}
              className={`min-w-[140px] p-4 rounded-2xl text-center transition-all ${
                value === date
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white/50 hover:bg-white/70 text-purple-900'
              }`}
            >
              {formatDate(date)}
            </motion.button>
          ))}
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
          <button
            type="button"
            className="p-2 rounded-full bg-white/50 text-purple-600 hover:bg-white/70 transition-colors"
            onClick={() => {
              const container = document.getElementById('dates-container');
              if (container) {
                container.scrollBy({ left: 200, behavior: 'smooth' });
              }
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}