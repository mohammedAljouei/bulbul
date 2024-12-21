import { usePackages } from '../../hooks/usePackages';
import { PackageCard } from './PackageCard';
import { Package } from '../../types/database';
import { motion } from 'framer-motion';
import { Bird } from 'lucide-react';

interface PackageListProps {
  selectedPackage?: Package;
  onSelectPackage: (pkg: Package) => void;
}

export function PackageList({ selectedPackage, onSelectPackage }: PackageListProps) {
  const { packages, loading, error } = usePackages();

  if (loading) {
    return (
      <div className="text-center py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Bird className="w-8 h-8 text-purple-600" />
        </motion.div>
        <p className="mt-4 text-purple-800">جاري تحميل الباقات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!packages.length) {
    return (
      <div className="text-center py-8 space-y-4">
        <Bird className="w-12 h-12 text-purple-600 mx-auto" />
        <h3 className="text-xl font-bold text-purple-900">لا توجد باقات متاحة حالياً</h3>
        <p className="text-purple-700">يرجى المحاولة مرة أخرى لاحقاً</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {packages.map((pkg, index) => (
        <motion.div
          key={pkg.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PackageCard
            pkg={pkg}
            selected={selectedPackage?.id === pkg.id}
            onSelect={() => onSelectPackage(pkg)}
          />
        </motion.div>
      ))}
    </div>
  );
}