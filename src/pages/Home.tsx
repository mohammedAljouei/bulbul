import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bird, Sparkles, Globe2, Users, BookOpen, ArrowLeft, GraduationCap, ExternalLink } from 'lucide-react';
import { Teachers } from './Teachers';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-3xl" />
        <div className="container mx-auto px-4 py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center shadow-xl transform -rotate-12"
            >
              <Bird className="w-10 h-10 text-white transform rotate-12" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold text-purple-900">
              بلبل
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 text-2xl md:text-3xl text-purple-600 block mt-2"
              >
                <Sparkles className="w-6 h-6 text-yellow-500" />
                تعلم الإنجليزية بسهولة
              </motion.span>
            </h1>
            <p className="text-lg text-purple-700 max-w-2xl mx-auto">
              نساعدك على تعلم اللغة الإنجليزية مع أفضل المدرسين في جلسات حضورية أو عن بعد
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/booking" className="btn-primary py-3 px-8">
                احجز جلسة
              </Link>
              <a href="#features" className="btn-secondary py-3 px-8">
                تعرف على المزيد
              </a>
            </div>
             {/* Instructor Registration Link */}
             <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-4"
            >
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeSdN9eXo7-Enkl2CnkmJm95PhBsCyzGunHOFVVAOMvxdqBsg/viewform?usp=dialog"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
              >
                <GraduationCap className="w-5 h-5" />
                <ExternalLink className="w-4 h-4" />
               ? Want to register as an instructor
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Globe2 className="w-8 h-8" />,
                title: "جلسات مرنة",
                description: "اختر بين الجلسات الحضورية أو عن بعد حسب ما يناسبك"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "مدرسون محترفون",
                description: "نخبة من أفضل مدرسي اللغة الإنجليزية"
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "ممارسة احترافية",
                description: "ممارسة تعليمية شاملة تغطي جميع مهارات اللغة"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="card text-center p-6 space-y-4"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto text-purple-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-purple-900">{feature.title}</h3>
                <p className="text-purple-700">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Teachers Section */}
      <div className="py-16">
        <Teachers />
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <GraduationCap className="w-16 h-16 mx-auto text-white/80" />
            <h2 className="text-3xl font-bold">ابدأ رحلتك مع بلبل</h2>
            <p className="max-w-xl mx-auto text-white/80">
              اختر الباقة المناسبة لك وابدأ في تحسين لغتك الإنجليزية مع أفضل المدرسين
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all"
            >
              ابدأ الآن
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}