import React from 'react';
import { getPriorityColor, getStatusColor, getPropertyStatusColor } from '../../utils/helpers';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'priority' | 'status' | 'property-status' | 'success' | 'warning' | 'error' | 'info';
  priority?: 'low' | 'medium' | 'high' | 'emergency';
  status?: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  propertyStatus?: 'occupied' | 'vacant' | 'maintenance';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  priority,
  status,
  propertyStatus,
  size = 'sm',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full border';

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'priority':
        return priority ? getPriorityColor(priority) : 'bg-gray-100 text-gray-800 border-gray-200';
      case 'status':
        return status ? getStatusColor(status) : 'bg-gray-100 text-gray-800 border-gray-200';
      case 'property-status':
        return propertyStatus ? getPropertyStatusColor(propertyStatus) : 'bg-gray-100 text-gray-800 border-gray-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${getVariantClasses()} ${className}`;

  return (
    <span className={classes}>
      {children}
    </span>
  );
};
