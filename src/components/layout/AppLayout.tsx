import { motion, AnimatePresence } from 'framer-motion';
import { BottomNav } from './BottomNav';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  const showNav = user && location.pathname !== '/auth';

  return (
    <div className="main-container">
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      {showNav && <BottomNav />}
    </div>
  );
}