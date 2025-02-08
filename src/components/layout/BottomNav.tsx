import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Package, User, Calendar } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/packages', icon: Package, label: 'الباقات' },
    { path: '/booking', icon: Calendar, label: 'حجز جلسة' },
    { path: '/profile', icon: User, label: 'حسابي' },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="bottom-nav"
    >
      <nav className="flex justify-around items-center p-4">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className="relative flex flex-col items-center"
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
      </nav>
    </motion.div>
  );
}