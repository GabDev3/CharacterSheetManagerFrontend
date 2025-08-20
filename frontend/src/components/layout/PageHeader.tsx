
// src/components/layout/PageHeader.tsx
import React from 'react';
import { Button } from '@/components/ui/Button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  action,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            {Icon && <Icon className="w-8 h-8 mr-3 text-primary-500" />}
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-lg text-gray-600">{subtitle}</p>
          )}
        </div>
        {action && (
          <Button onClick={action.onClick} className="flex items-center">
            {action.icon && <action.icon className="w-5 h-5 mr-2" />}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};