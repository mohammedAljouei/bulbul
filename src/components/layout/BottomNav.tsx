import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Package, User, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/packages', icon: Package, label: 'الباقات' },
    { path: '/profile', icon: User, label: 'حسابي' },
  ];

  if (!user) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-purple-100 pb-safe"
    >
      <nav className="flex justify-around items-center p-2 relative">
        {/* Left side nav items */}
        <div className="flex-1 flex justify-around">
          {navItems.slice(0, 1).map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className="relative flex flex-col items-center p-2"
              >
                <motion.div
                  initial={false}
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  className={`p-2 rounded-xl ${
                    isActive ? 'bg-purple-100' : ''
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? 'text-purple-600' : 'text-purple-400'
                    }`}
                  />
                </motion.div>
                <span className={`text-xs mt-1 ${
                  isActive ? 'text-purple-600 font-semibold' : 'text-purple-400'
                }`}>
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-2 w-1 h-1 bg-purple-600 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Floating Action Button */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <Link
            to="/booking"
            className="relative block"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg ${
                location.pathname === '/booking' ? 'ring-2 ring-purple-300' : ''
              }`}
            >
              <Calendar className="w-6 h-6 text-white" />
              <span className="sr-only">حجز جلسة</span>
            </motion.div>
          </Link>
        </div>

        {/* Right side nav items */}
        <div className="flex-1 flex justify-around">
          {navItems.slice(1).map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className="relative flex flex-col items-center p-2"
              >
                <motion.div
                  initial={false}
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  className={`p-2 rounded-xl ${
                    isActive ? 'bg-purple-100' : ''
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? 'text-purple-600' : 'text-purple-400'
                    }`}
                  />
                </motion.div>
                <span className={`text-xs mt-1 ${
                  isActive ? 'text-purple-600 font-semibold' : 'text-purple-400'
                }`}>
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-2 w-1 h-1 bg-purple-600 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </motion.div>
  );
}