import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useSubscription } from '../hooks/useSubscription';
import { useTeachers } from '../hooks/useTeachers';
import { Bird, Star, GraduationCap, Languages, Video, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TeachersProps {
  onBookingComplete?: (details: any) => void;
  onBookingAttempt?: (teacher: any) => void;
}

export function Teachers({ onBookingComplete, onBookingAttempt }: TeachersProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile(user?.id || '');
  const { subscription } = useSubscription();
  const { teachers, loading, error } = useTeachers();
  const [showNoPackageWarning, setShowNoPackageWarning] = useState(false);

  const handleBooking = (teacher: any) => {
    // If user is logged in but has no active subscription, show warning and redirect to packages
    if (user && (!subscription || subscription.remaining_sessions <= 0)) {
      toast.error('يجب اختيار باقة للحجز');
      setShowNoPackageWarning(true);
      setTimeout(() => navigate('/packages'), 1500);
      return;
    }

    if (!user) {
      navigate('/auth');
    } else if (!profile) {
      navigate('/profile');
    } else if (!profile.level) {
      navigate('/booking');
    } else if (onBookingAttempt) {
      onBookingAttempt(teacher);
    }
  };

  const handleDemoVideo = (demoUrl: string) => {
    window.open(demoUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">حدث خطأ أثناء تحميل قائمة المدرسين</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="text-center py-8 space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto"
        >
          <Bird className="w-8 h-8 text-purple-600" />
        </motion.div>
        <h1 className="text-3xl font-bold text-purple-900">
          اختر مدرسك المفضل
        </h1>
        <p className="text-purple-600">
          نخبة من أفضل مدرسي اللغة الإنجليزية
        </p>
      </div>

      {/* No Package Warning */}
      {showNoPackageWarning && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="text-yellow-700">لا يوجد لديك باقة نشطة</p>
            <p className="text-sm text-yellow-600">جاري تحويلك لصفحة الباقات...</p>
          </div>
        </motion.div>
      )}

      {/* Teachers List */}
      <div className="grid gap-6 mb-24">
        {teachers.map((teacher, index) => (
          <motion.div
            key={teacher.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="teacher-card bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-start gap-4 mb-4">
              <img
                src={teacher.image_url}
                alt={teacher.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-purple-900">{teacher.name}</h3>
                <p className="text-purple-600 text-sm">{teacher.title}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-purple-900">{teacher.rating}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-purple-800">{teacher.experience_years} سنوات</span>
              </div>
              <div className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-purple-800">
                  {teacher.languages.join('، ')}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {teacher.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-sm"
                >
                  {specialty}
                </span>
              ))}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleDemoVideo(teacher.demo_video_url)}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4" />
                مشاهدة فيديو تعريفي
              </button>

              <button
                onClick={() => handleBooking(teacher)}
                className="btn-primary w-full"
              >
                احجز جلسة
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}