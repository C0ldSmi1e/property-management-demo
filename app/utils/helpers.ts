import { ServiceRequestPriority, ServiceRequestStatus } from '../types';

// Date formatting utilities
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return formatDate(dateString);
};

// Currency formatting
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// File size formatting
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Status styling helpers
export const getPriorityColor = (priority: ServiceRequestPriority): string => {
  switch (priority) {
    case 'emergency':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusColor = (status: ServiceRequestStatus): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'assigned':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'in_progress':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Property status helpers
export const getPropertyStatusColor = (status: string): string => {
  switch (status) {
    case 'occupied':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'vacant':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'maintenance':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Text transformation helpers
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Validation helpers
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

// Array helpers
export const groupBy = <T, K extends keyof any>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((result, item) => {
    const key = getKey(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {} as Record<K, T[]>);
};

// Search and filter helpers
export const searchItems = <T>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] => {
  if (!searchTerm.trim()) return items;

  const lowercaseSearch = searchTerm.toLowerCase();

  return items.filter(item =>
    searchFields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowercaseSearch);
      }
      if (typeof value === 'number') {
        return value.toString().includes(lowercaseSearch);
      }
      return false;
    })
  );
};

// Random ID generator (for demo purposes)
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Theme helpers for user roles
export const getRoleTheme = (role: string) => {
  switch (role) {
    case 'property_manager':
      return {
        primary: 'blue',
        colors: {
          50: 'bg-blue-50',
          100: 'bg-blue-100',
          200: 'bg-blue-200',
          500: 'bg-blue-500',
          600: 'bg-blue-600',
          700: 'bg-blue-700',
        },
        text: {
          500: 'text-blue-500',
          600: 'text-blue-600',
          700: 'text-blue-700',
        },
        border: {
          500: 'border-blue-500',
          600: 'border-blue-600',
        }
      };
    case 'tenant':
      return {
        primary: 'green',
        colors: {
          50: 'bg-green-50',
          100: 'bg-green-100',
          500: 'bg-green-500',
          600: 'bg-green-600',
          700: 'bg-green-700',
        },
        text: {
          500: 'text-green-500',
          600: 'text-green-600',
          700: 'text-green-700',
        },
        border: {
          500: 'border-green-500',
          600: 'border-green-600',
        }
      };
    case 'service_provider':
      return {
        primary: 'orange',
        colors: {
          50: 'bg-orange-50',
          100: 'bg-orange-100',
          500: 'bg-orange-500',
          600: 'bg-orange-600',
          700: 'bg-orange-700',
        },
        text: {
          500: 'text-orange-500',
          600: 'text-orange-600',
          700: 'text-orange-700',
        },
        border: {
          500: 'border-orange-500',
          600: 'border-orange-600',
        }
      };
    default:
      return {
        primary: 'gray',
        colors: {
          50: 'bg-gray-50',
          100: 'bg-gray-100',
          500: 'bg-gray-500',
          600: 'bg-gray-600',
          700: 'bg-gray-700',
        },
        text: {
          500: 'text-gray-500',
          600: 'text-gray-600',
          700: 'text-gray-700',
        },
        border: {
          500: 'border-gray-500',
          600: 'border-gray-600',
        }
      };
  }
};
