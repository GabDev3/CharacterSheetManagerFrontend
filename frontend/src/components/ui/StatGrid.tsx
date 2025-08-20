
import React from 'react';
import { clsx } from 'clsx';

interface StatItem {
  label: string;
  value: string | number;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

interface StatGridProps {
  stats: StatItem[];
  columns?: number;
  className?: string;
}

export const StatGrid: React.FC<StatGridProps> = ({
  stats,
  columns = 3,
  className,
}) => {
  const colorClasses = {
    default: 'text-gray-900',
    primary: 'text-primary-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
  };

  return (
    <div
      className={clsx(
        'grid gap-4',
        {
          'grid-cols-2': columns === 2,
          'grid-cols-3': columns === 3,
          'grid-cols-4': columns === 4,
          'grid-cols-6': columns === 6,
        },
        className
      )}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100 transition-colors hover:bg-gray-100"
        >
          <div
            className={clsx(
              'text-2xl font-bold mb-1',
              colorClasses[stat.color || 'default']
            )}
          >
            {stat.value}
          </div>
          <div className="text-sm text-gray-600 uppercase tracking-wide font-medium">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};