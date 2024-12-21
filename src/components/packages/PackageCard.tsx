import { Package } from '../../types/database';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface PackageCardProps {
  pkg: Package;
  selected?: boolean;
  onSelect?: () => void;
}

export function PackageCard({ pkg, selected, onSelect }: PackageCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`card relative overflow-hidden cursor-pointer transition-all duration-300 ${
        selected ? 'ring-2 ring-purple-500 bg-white/90' : 'hover:bg-white/80'
      }`}
      onClick={onSelect}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 left-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      )}
      
      <h3 className="text-xl font-bold text-purple-900 mb-4">{pkg.name}</h3>
      
      <div className="space-y-4">
        <p className="text-3xl font-bold text-purple-900">
          {pkg.price} <span className="text-lg">ريال</span>
        </p>
        
        <div className="space-y-2 text-purple-700">
          <p className="text-lg">
            {pkg.sessions_per_month} جلسة شهرياً
          </p>
          <p className="text-sm opacity-75">
            {Math.round(pkg.price / pkg.sessions_per_month)} ريال للجلسة
          </p>
        </div>
      </div>
    </motion.div>
  );
}