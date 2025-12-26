import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className = '',
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState<string | number>(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Animated number counter for numeric values
  useEffect(() => {
    if (typeof value === 'number') {
      const duration = 1000; // 1 second
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current += increment;
        if (step >= steps) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <div
      ref={cardRef}
      className={`bg-white dark:bg-neutral-200 rounded-xl shadow-md p-6 border border-gray-100 dark:border-neutral-300
        hover:shadow-lg dark:hover:shadow-glow-primary hover:-translate-y-1 
        transition-all duration-300 ease-smooth
        animate-fade-in
        ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-600">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-900 font-mono">
            {displayValue}
          </p>
          {description && (
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-600">
              {description}
            </p>
          )}
          {trend && (
            <div className="mt-2 flex items-center">
              <span
                className={`text-sm font-semibold ${
                  trend.isPositive ? 'text-success-600' : 'text-danger-600'
                }`}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
              <span className="ml-2 text-sm text-neutral-500">vs last period</span>
            </div>
          )}
        </div>
        <div className="ml-4">
          <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-full p-3 shadow-glow-primary">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
