import type { ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  description?: string;
  tooltip?: string;
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'pink';
}

export function SectionHeader({
  icon,
  title,
  description,
  tooltip,
  color = 'blue',
}: SectionHeaderProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
  };

  return (
    <div className="flex items-start gap-4 mb-6">
      {/* Icon */}
      <div className={cn(
        'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
        'bg-gradient-to-br shadow-lg',
        colorClasses[color]
      )}>
        <div className="text-white text-xl">
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          {tooltip && (
            <div className="group relative">
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute left-0 top-6 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                {tooltip}
                <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45" />
              </div>
            </div>
          )}
        </div>
        {description && (
          <p className="text-sm text-gray-600 mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
