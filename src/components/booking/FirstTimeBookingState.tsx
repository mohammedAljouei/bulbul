import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bird, Sparkles, ArrowRight, GraduationCap, Globe2, Users } from 'lucide-react';

export function FirstTimeBookingState() {
  const features = [
    { icon: GraduationCap, title: 'مدرسون محترفون', description: 'نخبة من أفضل مدرسي اللغة الإنجليزية' },
    { icon: Globe2, title: 'جلسات مرنة', description: 'حضوري أو عن بعد حسب رغبتك' },
    { icon: Users, title: 'جلسات خاصة', description: 'تعلم مخصص لاحتياجاتك' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden pt-12"
      >
        {/* Background with pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl opacity-10" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.3) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }} />

        {/* Content */}
        <div className="relative p-8 text-center space-y-8">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="relative mx-auto w-32 h-32"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl rotate-6" />
            <div className="absolute inset-0 bg-white rounded-3xl flex items-center justify-center">
              <Bird className="w-16 h-16 text-purple-600" />
            </div>
          </motion.div>

          {/* Text Content */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <h2 className="text-3xl font-bold text-purple-900">
                ابدأ رحلتك مع بلبل
              </h2>
              <div className="flex items-center justify-center gap-2 text-purple-600">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <p>اختر باقتك المناسبة وابدأ تعلم اللغة الإنجليزية</p>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                        {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link 
              to="/packages" 
              className="btn-primary inline-flex items-center gap-2 px-8 py-4"
            >
              اختر باقتك الآن
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 text-center"
                >
                  <feature.icon className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-purple-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-purple-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>


        </div>
      </motion.div>
    </div>
  );
}