// User Types
export type UserRole = 'property_manager' | 'tenant' | 'service_provider';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
}

export interface PropertyManager extends User {
  role: 'property_manager';
  companyName?: string;
  managedProperties: string[];
  isBusinessManager: boolean;
}

export interface Tenant extends User {
  role: 'tenant';
  propertyId: string;
  leaseStartDate: string;
  leaseEndDate: string;
  rentAmount: number;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface ServiceProvider extends User {
  role: 'service_provider';
  companyName: string;
  services: string[];
  rating: number;
  completedJobs: number;
  availability: 'available' | 'busy' | 'unavailable';
}

// Property Types
export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'apartment' | 'house' | 'commercial' | 'condo';
  units?: number;
  size: number; // sq ft
  bedrooms?: number;
  bathrooms?: number;
  rentAmount: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  managerId: string;
  tenantId?: string;
  amenities: string[];
  images: string[];
  description: string;
  createdAt: string;
}

// Service Request Types
export type ServiceRequestStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type ServiceRequestPriority = 'low' | 'medium' | 'high' | 'emergency';

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: ServiceRequestPriority;
  status: ServiceRequestStatus;
  propertyId: string;
  tenantId: string;
  assignedProviderId?: string;
  images?: string[];
  estimatedCost?: number;
  actualCost?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  notes?: string[];
}

// Document Types
export interface Document {
  id: string;
  name: string;
  type: 'lease' | 'invoice' | 'receipt' | 'inspection' | 'insurance' | 'permit' | 'other';
  url: string;
  size: number;
  uploadedBy: string;
  propertyId?: string;
  tenantId?: string;
  serviceRequestId?: string;
  createdAt: string;
  tags: string[];
}

// Financial Types
export interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  propertyId: string;
  date: string;
  createdAt: string;
}

export interface PropertyFinancials {
  propertyId: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  netIncome: number;
  occupancyRate: number;
  yearToDateIncome: number;
  yearToDateExpenses: number;
}

// Analytics Types
export interface AnalyticsData {
  totalProperties: number;
  totalTenants: number;
  totalServiceRequests: number;
  monthlyRevenue: number;
  occupancyRate: number;
  averageRent: number;
  maintenanceCosts: number;
  propertyPerformance: PropertyFinancials[];
  serviceRequestTrends: {
    month: string;
    count: number;
    avgResolutionTime: number;
  }[];
}

// Communication Types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  attachments?: string[];
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'service_request' | 'payment' | 'maintenance' | 'lease' | 'general';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

// Form Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ServiceRequestForm {
  title: string;
  description: string;
  category: string;
  priority: ServiceRequestPriority;
  images?: File[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Dashboard Data Types
export interface DashboardStats {
  totalProperties?: number;
  totalTenants?: number;
  totalServiceRequests?: number;
  monthlyRevenue?: number;
  pendingRequests?: number;
  completedRequests?: number;
  occupancyRate?: number;
  maintenanceCosts?: number;
}

export interface DashboardData {
  user: User;
  stats: DashboardStats;
  recentActivity: (ServiceRequest | Message | Notification)[];
  upcomingTasks?: any[];
}
