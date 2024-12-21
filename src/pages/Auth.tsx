import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Bird, Mail, Lock, ArrowRight, Sparkles, Globe2, Users, GraduationCap } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success('تم تسجيل الدخول بنجاح');
      } else {
        await signUp(email, password);
        toast.success('تم إنشاء الحساب بنجاح');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(isLogin ? 'فشل تسجيل الدخول' : 'فشل إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: GraduationCap,
      title: 'مدرسون محترفون',
      description: 'تعلم مع نخبة من أفضل المدرسين'
    },
    {
      icon: Globe2,
      title: 'جلسات مرنة',
      description: 'حضوري أو عن بعد حسب رغبتك'
    },
    {
      icon: Users,
      title: 'جلسات خاصة',
      description: 'تعلم مخصص لاحتياجاتك'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex">
      {/* Left Side - Features */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex flex-col justify-center w-1/2 p-12 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.4) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg mx-auto space-y-12">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="relative w-32 h-32"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl rotate-6" />
            <div className="absolute inset-0 bg-white rounded-3xl flex items-center justify-center">
              <Bird className="w-16 h-16 text-purple-600" />
            </div>
          </motion.div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-purple-900">
              بلبل
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 text-2xl text-purple-600 block mt-2"
              >
                <Sparkles className="w-6 h-6 text-yellow-500" />
                تعلم الإنجليزية بسهولة
              </motion.span>
            </h1>
            <p className="text-purple-700 text-lg">
              نساعدك على تعلم اللغة الإنجليزية مع أفضل المدرسين
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center shrink-0">
                  <feature.icon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-purple-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Side - Auth Form */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-purple-900 mb-2">
                  {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                </h2>
                <p className="text-purple-600">
                  {isLogin 
                    ? 'سجل دخولك وابدأ رحلة تعلم اللغة الإنجليزية'
                    : 'انضم إلينا وابدأ رحلة تعلم اللغة الإنجليزية'
                  }
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-purple-900">
                    <Mail className="w-4 h-4 inline-block ml-2" />
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    required
                    className="form-input text-left"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-purple-900">
                    <Lock className="w-4 h-4 inline-block ml-2" />
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    dir="ltr"
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    'جاري التحميل...'
                  ) : (
                    <>
                      {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <button
                className="w-full mt-6 text-sm text-purple-600 hover:text-purple-800 transition-colors"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin 
                  ? 'ليس لديك حساب؟ سجل الآن'
                  : 'لديك حساب؟ سجل دخولك'
                }
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}