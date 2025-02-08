import { useState } from 'react';
import { motion } from 'framer-motion';
import { PackageList } from '../components/packages/PackageList';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import type { Package } from '../types/database';
import { useNavigate } from 'react-router-dom';
import { Bird, Sparkles, Check } from 'lucide-react';

const features = [
  // 'جلسات خاصة مع أفضل المدرسين',
  'مرونة في اختيار المواعيد',
  'حضوري أو عن بعد حسب رغبتك',
  // 'منهج تعليمي متكامل',
  'متابعة مستمرة لتقدمك',
  'شهادة إتمام المستوى'
];

export default function Packages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<Package>();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!selectedPackage || !user) return;

    setLoading(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const { error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          package_id: selectedPackage.id,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          remaining_sessions: selectedPackage.sessions_per_month
        });

      if (error) throw error;
      toast.success('تم الاشتراك بنجاح');
      navigate('/booking');
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('حدث خطأ أثناء الاشتراك');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="safe-area-view"
    >
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center shadow-xl transform -rotate-12"
          >
            <Bird className="w-10 h-10 text-white transform rotate-12" />
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-purple-900">
            اختر باقتك المناسبة
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 text-xl md:text-2xl text-purple-600 block mt-2"
            >
              <Sparkles className="w-5 h-5 text-yellow-500" />
              وابدأ رحلة تعلم اللغة الإنجليزية
            </motion.span>
          </h1>
        </motion.div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 px-4 mb-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 bg-white/50 p-3 rounded-lg"
            >
              <Check className="w-5 h-5 text-green-500 shrink-0" />
              <span className="text-sm text-purple-800">{feature}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Packages Grid */}
        <PackageList
          selectedPackage={selectedPackage}
          onSelectPackage={setSelectedPackage}
        />

        {/* Subscribe Button */}
        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-24 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-purple-100"
          >
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              <div className="text-right">
                <p className="text-sm text-purple-600">الباقة المختارة</p>
                <p className="font-bold text-purple-900">{selectedPackage.name}</p>
              </div>
              <button
                className="btn-primary px-8"
                onClick={handleSubscribe}
                disabled={loading}
              >
                {loading ? 'جاري الاشتراك...' : 'اشترك الآن'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}