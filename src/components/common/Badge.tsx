import React from 'react';
import { cn } from '../../utils/cn';
import type { AlertSeverity, StressType } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    danger: 'bg-danger-100 text-danger-700',
    info: 'bg-primary-100 text-primary-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};

interface SeverityBadgeProps {
  severity: AlertSeverity;
  size?: 'sm' | 'md';
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'md', className }) => {
  const variantMap: Record<AlertSeverity, 'success' | 'info' | 'warning' | 'danger'> = {
    low: 'success',
    medium: 'info',
    high: 'warning',
    critical: 'danger',
  };

  return (
    <Badge variant={variantMap[severity]} size={size} className={className}>
      {severity.toUpperCase()}
    </Badge>
  );
};

interface StressBadgeProps {
  type: StressType;
  size?: 'sm' | 'md';
  className?: string;
}

export const StressBadge: React.FC<StressBadgeProps> = ({ type, size = 'md', className }) => {
  const config: Record<StressType, { variant: 'success' | 'warning' | 'danger' | 'info'; label: string }> = {
    healthy: { variant: 'success', label: 'Healthy' },
    drought: { variant: 'warning', label: 'Drought' },
    pest: { variant: 'danger', label: 'Pest' },
    nutrient: { variant: 'info', label: 'Nutrient Deficiency' },
  };

  const { variant, label } = config[type];

  return (
    <Badge variant={variant} size={size} className={className}>
      {label}
    </Badge>
  );
};
