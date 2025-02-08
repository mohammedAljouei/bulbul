import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Video, Calendar, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { DatePicker } from '../common/DatePicker';
import { TimePicker } from '../common/TimePicker';
import { SessionTypeSelector } from './SessionTypeSelector';
import { SpotSelector } from './SpotSelector';
import { SessionType } from '../../types/booking';
import { useCheckAvailability } from '../../hooks/useCheckAvailability';

interface SlotSelectorProps {
  onSelect: (details: {
    date: string;
    time: string;
    sessionType: SessionType;
    spotId?: string;
  }) => void;
  teacherName: string;
}

export function SlotSelector({ onSelect, teacherName }: SlotSelectorProps) {
  const [sessionType, setSessionType] = useState<SessionType>('offline');
  const [step, setStep] = useState<'type' | 'location' | 'datetime'>('type');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [spotId, setSpotId] = useState('');
  const { checkAvailability, loading: checkingAvailability } = useCheckAvailability();

  const isFormValid = date && time && (sessionType === 'online' || (sessionType === 'offline' && spotId));

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const isAvailable = await checkAvailability({
      date,
      time,
      sessionType,
      spotId: sessionType === 'offline' ? spotId : undefined
    });

    if (!isAvailable) {
      alert('عذراً، هذا الموعد غير متاح. يرجى اختيار موعد آخر.');
      return;
    }

    onSelect({
      date,
      time,
      sessionType,
      spotId: sessionType === 'offline' ? spotId : undefined
    });
  };

  const handleSessionTypeSelect = (type: SessionType) => {
    setSessionType(type);
    if (type === 'online') {
      setStep('datetime');
    } else {
      setStep('location');
    }
  };

  const handleSpotSelect = (id: string) => {
    setSpotId(id);
    setStep('datetime');
  };

  const handleBack = () => {
    if (step === 'datetime' && sessionType === 'offline') {
      setStep('location');
    } else {
      setStep('type');
      setSpotId('');
      setDate('');
      setTime('');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="bg-white rounded-3xl w-full max-w-lg shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-purple-100">
            <h3 className="text-xl font-bold text-purple-900">
              حجز جلسة مع {teacherName}
            </h3>
            <p className="text-sm text-purple-600 mt-1">
              {step === 'type' && 'اختر نوع الجلسة'}
              {step === 'location' && 'اختر موقع الجلسة'}
              {step === 'datetime' && 'اختر موعد الجلسة'}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {step === 'type' && (
                <motion.div
                  key="type"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <SessionTypeSelector value={sessionType} onChange={handleSessionTypeSelect} />
                </motion.div>
              )}

              {step === 'location' && (
                <motion.div
                  key="location"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <SpotSelector value={spotId} onChange={handleSpotSelect} />
                </motion.div>
              )}

              {step === 'datetime' && (
                <motion.div
                  key="datetime"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <DatePicker value={date} onChange={setDate} />
                  <TimePicker value={time} onChange={setTime} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-purple-100">
            <div className="flex items-center justify-between">
              <button 
                onClick={handleBack}
                className="text-sm text-purple-600 hover:text-purple-800"
              >
                رجوع
              </button>

              {step === 'datetime' && (
                <button
                  onClick={handleSubmit}
                  className="btn-primary px-8 py-3 flex items-center justify-center gap-2"
                  disabled={!isFormValid || checkingAvailability}
                >
                  {checkingAvailability ? 'جاري التحقق...' : 'تأكيد الحجز'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}