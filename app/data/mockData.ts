import {
  User, PropertyManager, Tenant, ServiceProvider, Property,
  ServiceRequest, Document, FinancialRecord, Message, Notification,
  AnalyticsData, PropertyFinancials
} from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@propertymanagement.com',
    role: 'property_manager',
    avatar: '/avatars/sarah.jpg',
    phone: '(555) 123-4567',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    role: 'tenant',
    avatar: '/avatars/mike.jpg',
    phone: '(555) 234-5678',
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: '3',
    name: 'ABC Plumbing Services',
    email: 'contact@abcplumbing.com',
    role: 'service_provider',
    avatar: '/avatars/abc-plumbing.jpg',
    phone: '(555) 345-6789',
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '4',
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@email.com',
    role: 'tenant',
    avatar: '/avatars/lisa.jpg',
    phone: '(555) 456-7890',
    createdAt: '2024-03-01T10:00:00Z',
  },
  {
    id: '5',
    name: 'Elite Electrical Services',
    email: 'info@eliteelectrical.com',
    role: 'service_provider',
    avatar: '/avatars/elite-electrical.jpg',
    phone: '(555) 567-8901',
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '6',
    name: 'ProFix HVAC',
    email: 'service@profixhvac.com',
    role: 'service_provider',
    avatar: '/avatars/profix-hvac.jpg',
    phone: '(555) 678-9012',
    createdAt: '2024-01-25T10:00:00Z',
  }
];

export const mockPropertyManager: PropertyManager = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah@propertymanagement.com',
  role: 'property_manager',
  avatar: '/avatars/sarah.jpg',
  phone: '(555) 123-4567',
  createdAt: '2024-01-15T10:00:00Z',
  companyName: 'Johnson Property Management',
  managedProperties: ['1', '2', '3', '4', '5'],
  isBusinessManager: true,
};

export const mockTenant: Tenant = {
  id: '2',
  name: 'Mike Chen',
  email: 'mike.chen@email.com',
  role: 'tenant',
  avatar: '/avatars/mike.jpg',
  phone: '(555) 234-5678',
  createdAt: '2024-02-01T10:00:00Z',
  propertyId: '1',
  leaseStartDate: '2024-02-01',
  leaseEndDate: '2025-01-31',
  rentAmount: 2500,
  emergencyContact: {
    name: 'Lisa Chen',
    phone: '(555) 987-6543',
    relationship: 'Sister'
  }
};

export const mockServiceProvider: ServiceProvider = {
  id: '3',
  name: 'ABC Plumbing Services',
  email: 'contact@abcplumbing.com',
  role: 'service_provider',
  avatar: '/avatars/abc-plumbing.jpg',
  phone: '(555) 345-6789',
  createdAt: '2024-01-10T10:00:00Z',
  companyName: 'ABC Plumbing Services',
  services: ['Plumbing', 'Emergency Repairs', 'Pipe Installation', 'Drain Cleaning'],
  rating: 4.8,
  completedJobs: 247,
  availability: 'available'
};

export const mockServiceProviders: ServiceProvider[] = [
  mockServiceProvider,
  {
    id: '5',
    name: 'Elite Electrical Services',
    email: 'info@eliteelectrical.com',
    role: 'service_provider',
    avatar: '/avatars/elite-electrical.jpg',
    phone: '(555) 567-8901',
    createdAt: '2024-01-20T10:00:00Z',
    companyName: 'Elite Electrical Services',
    services: ['Electrical Repairs', 'Wiring', 'Lighting Installation', 'Panel Upgrades'],
    rating: 4.9,
    completedJobs: 189,
    availability: 'available'
  },
  {
    id: '6',
    name: 'ProFix HVAC',
    email: 'service@profixhvac.com',
    role: 'service_provider',
    avatar: '/avatars/profix-hvac.jpg',
    phone: '(555) 678-9012',
    createdAt: '2024-01-25T10:00:00Z',
    companyName: 'ProFix HVAC',
    services: ['HVAC Maintenance', 'Air Conditioning', 'Heating Repairs', 'Duct Cleaning'],
    rating: 4.7,
    completedJobs: 156,
    availability: 'busy'
  }
];

// Mock Properties
export const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Sunset Apartments - Unit 3B',
    address: '123 Sunset Boulevard, Los Angeles, CA 90028',
    type: 'apartment',
    size: 1200,
    bedrooms: 2,
    bathrooms: 2,
    rentAmount: 2500,
    status: 'occupied',
    managerId: '1',
    tenantId: '2',
    amenities: ['Pool', 'Gym', 'Parking', 'Laundry', 'Air Conditioning'],
    images: ['/properties/sunset-apt-1.jpg', '/properties/sunset-apt-2.jpg'],
    description: 'Modern 2-bedroom apartment with city views and premium amenities.',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Downtown Office Complex - Suite 401',
    address: '456 Business Drive, Los Angeles, CA 90013',
    type: 'commercial',
    size: 2500,
    rentAmount: 4500,
    status: 'vacant',
    managerId: '1',
    amenities: ['Elevator', 'Parking', 'Security', 'Conference Rooms'],
    images: ['/properties/office-1.jpg', '/properties/office-2.jpg'],
    description: 'Professional office space in the heart of downtown.',
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '3',
    name: 'Maple Street House',
    address: '789 Maple Street, Beverly Hills, CA 90210',
    type: 'house',
    size: 2800,
    bedrooms: 4,
    bathrooms: 3,
    rentAmount: 5500,
    status: 'occupied',
    managerId: '1',
    amenities: ['Garden', 'Garage', 'Fireplace', 'Hardwood Floors'],
    images: ['/properties/house-1.jpg', '/properties/house-2.jpg'],
    description: 'Beautiful family home with spacious rooms and private garden.',
    createdAt: '2024-01-25T10:00:00Z',
  },
  {
    id: '4',
    name: 'Ocean View Condos - Unit 12A',
    address: '321 Ocean Drive, Santa Monica, CA 90401',
    type: 'condo',
    size: 1800,
    bedrooms: 3,
    bathrooms: 2,
    rentAmount: 3800,
    status: 'maintenance',
    managerId: '1',
    amenities: ['Ocean View', 'Balcony', 'Pool', 'Concierge', 'Gym'],
    images: ['/properties/condo-1.jpg', '/properties/condo-2.jpg'],
    description: 'Luxury condo with stunning ocean views and resort-style amenities.',
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: '5',
    name: 'Garden Apartments - Unit 2C',
    address: '654 Garden Lane, Pasadena, CA 91101',
    type: 'apartment',
    size: 950,
    bedrooms: 1,
    bathrooms: 1,
    rentAmount: 1800,
    status: 'vacant',
    managerId: '1',
    amenities: ['Garden', 'Parking', 'Laundry', 'Pet-Friendly'],
    images: ['/properties/garden-apt-1.jpg', '/properties/garden-apt-2.jpg'],
    description: 'Cozy apartment surrounded by beautiful gardens.',
    createdAt: '2024-02-05T10:00:00Z',
  }
];

// Mock Service Requests
export const mockServiceRequests: ServiceRequest[] = [
  {
    id: '1',
    title: 'Kitchen Faucet Leak',
    description: 'The kitchen faucet has been dripping constantly for the past week. It seems to be getting worse.',
    category: 'Plumbing',
    priority: 'high',
    status: 'assigned',
    propertyId: '1',
    tenantId: '2',
    assignedProviderId: '3',
    images: ['/service-requests/faucet-leak.jpg'],
    estimatedCost: 150,
    createdAt: '2024-10-20T14:30:00Z',
    updatedAt: '2024-10-21T09:15:00Z',
    notes: ['Tenant reports leak started after recent cold weather', 'Provider scheduled for inspection tomorrow']
  },
  {
    id: '2',
    title: 'Air Conditioning Not Working',
    description: 'The AC unit in the living room stopped working yesterday. No cold air coming out.',
    category: 'HVAC',
    priority: 'emergency',
    status: 'pending',
    propertyId: '1',
    tenantId: '2',
    images: ['/service-requests/ac-unit.jpg'],
    createdAt: '2024-10-22T16:45:00Z',
    updatedAt: '2024-10-22T16:45:00Z',
    notes: ['Urgent due to current heat wave']
  },
  {
    id: '3',
    title: 'Bathroom Tile Repair',
    description: 'Several tiles in the master bathroom are loose and need to be re-secured.',
    category: 'General Maintenance',
    priority: 'medium',
    status: 'completed',
    propertyId: '3',
    tenantId: '4',
    assignedProviderId: '5',
    estimatedCost: 200,
    actualCost: 185,
    createdAt: '2024-10-15T11:20:00Z',
    updatedAt: '2024-10-18T15:30:00Z',
    completedAt: '2024-10-18T15:30:00Z',
    notes: ['Work completed successfully', 'Tenant satisfied with repair quality']
  },
  {
    id: '4',
    title: 'Electrical Outlet Not Working',
    description: 'The outlet in the bedroom stopped working. Tried resetting the breaker but no luck.',
    category: 'Electrical',
    priority: 'medium',
    status: 'in_progress',
    propertyId: '1',
    tenantId: '2',
    assignedProviderId: '6',
    estimatedCost: 120,
    createdAt: '2024-10-19T09:15:00Z',
    updatedAt: '2024-10-21T14:20:00Z',
    notes: ['Electrician identified faulty wiring', 'Parts ordered, work to continue tomorrow']
  }
];

// Mock Documents
export const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Lease Agreement - Mike Chen',
    type: 'lease',
    url: '/documents/lease-mike-chen.pdf',
    size: 245760,
    uploadedBy: '1',
    propertyId: '1',
    tenantId: '2',
    createdAt: '2024-02-01T10:00:00Z',
    tags: ['lease', 'contract', 'active']
  },
  {
    id: '2',
    name: 'Property Insurance - Sunset Apartments',
    type: 'insurance',
    url: '/documents/insurance-sunset-apartments.pdf',
    size: 156780,
    uploadedBy: '1',
    propertyId: '1',
    createdAt: '2024-01-15T10:00:00Z',
    tags: ['insurance', 'policy', 'active']
  },
  {
    id: '3',
    name: 'Inspection Report - Unit 3B',
    type: 'inspection',
    url: '/documents/inspection-unit-3b.pdf',
    size: 89340,
    uploadedBy: '1',
    propertyId: '1',
    createdAt: '2024-09-15T10:00:00Z',
    tags: ['inspection', 'maintenance', 'report']
  },
  {
    id: '4',
    name: 'Plumbing Repair Invoice',
    type: 'invoice',
    url: '/documents/plumbing-invoice-001.pdf',
    size: 67890,
    uploadedBy: '3',
    serviceRequestId: '1',
    createdAt: '2024-10-21T16:30:00Z',
    tags: ['invoice', 'plumbing', 'repair']
  }
];

// Mock Financial Records
export const mockFinancialRecords: FinancialRecord[] = [
  {
    id: '1',
    type: 'income',
    category: 'Rent',
    amount: 2500,
    description: 'Monthly rent - Unit 3B',
    propertyId: '1',
    date: '2024-10-01',
    createdAt: '2024-10-01T10:00:00Z'
  },
  {
    id: '2',
    type: 'expense',
    category: 'Maintenance',
    amount: 150,
    description: 'Plumbing repair - Kitchen faucet',
    propertyId: '1',
    date: '2024-10-21',
    createdAt: '2024-10-21T16:30:00Z'
  },
  {
    id: '3',
    type: 'income',
    category: 'Rent',
    amount: 5500,
    description: 'Monthly rent - Maple Street House',
    propertyId: '3',
    date: '2024-10-01',
    createdAt: '2024-10-01T10:00:00Z'
  },
  {
    id: '4',
    type: 'expense',
    category: 'Utilities',
    amount: 180,
    description: 'Electricity bill - Common areas',
    propertyId: '1',
    date: '2024-10-15',
    createdAt: '2024-10-15T10:00:00Z'
  }
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    receiverId: '1',
    subject: 'Noise Complaint',
    content: 'Hi Sarah, I wanted to report excessive noise from the upstairs unit during late hours. Could you please address this with the tenant?',
    isRead: false,
    createdAt: '2024-10-22T20:15:00Z'
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '2',
    subject: 'Re: Noise Complaint',
    content: 'Hi Mike, Thank you for bringing this to my attention. I will speak with the upstairs tenant and ensure this issue is resolved promptly.',
    isRead: true,
    createdAt: '2024-10-23T09:30:00Z'
  },
  {
    id: '3',
    senderId: '3',
    receiverId: '1',
    subject: 'Service Request Update',
    content: 'The kitchen faucet repair has been completed. Please find the invoice attached. The tenant was very satisfied with our work.',
    isRead: false,
    createdAt: '2024-10-21T16:45:00Z',
    attachments: ['/documents/plumbing-invoice-001.pdf']
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'service_request',
    title: 'New Service Request',
    message: 'Mike Chen submitted a new service request for AC repair',
    isRead: false,
    actionUrl: '/dashboard/service-requests/2',
    createdAt: '2024-10-22T16:45:00Z'
  },
  {
    id: '2',
    userId: '2',
    type: 'maintenance',
    title: 'Service Request Assigned',
    message: 'Your kitchen faucet repair has been assigned to ABC Plumbing Services',
    isRead: true,
    actionUrl: '/dashboard/service-requests/1',
    createdAt: '2024-10-21T09:15:00Z'
  },
  {
    id: '3',
    userId: '3',
    type: 'service_request',
    title: 'New Work Order',
    message: 'You have been assigned a new plumbing repair job at Sunset Apartments',
    isRead: false,
    actionUrl: '/dashboard/work-orders/1',
    createdAt: '2024-10-21T09:15:00Z'
  }
];

// Mock Property Financials
export const mockPropertyFinancials: PropertyFinancials[] = [
  {
    propertyId: '1',
    monthlyIncome: 2500,
    monthlyExpenses: 430,
    netIncome: 2070,
    occupancyRate: 100,
    yearToDateIncome: 25000,
    yearToDateExpenses: 4300
  },
  {
    propertyId: '2',
    monthlyIncome: 0,
    monthlyExpenses: 200,
    netIncome: -200,
    occupancyRate: 0,
    yearToDateIncome: 36000,
    yearToDateExpenses: 2400
  },
  {
    propertyId: '3',
    monthlyIncome: 5500,
    monthlyExpenses: 650,
    netIncome: 4850,
    occupancyRate: 100,
    yearToDateIncome: 55000,
    yearToDateExpenses: 6500
  }
];

// Mock Analytics Data
export const mockAnalyticsData: AnalyticsData = {
  totalProperties: 5,
  totalTenants: 3,
  totalServiceRequests: 4,
  monthlyRevenue: 8000,
  occupancyRate: 60,
  averageRent: 3200,
  maintenanceCosts: 780,
  propertyPerformance: mockPropertyFinancials,
  serviceRequestTrends: [
    { month: 'Jul', count: 8, avgResolutionTime: 2.5 },
    { month: 'Aug', count: 12, avgResolutionTime: 3.1 },
    { month: 'Sep', count: 6, avgResolutionTime: 1.8 },
    { month: 'Oct', count: 4, avgResolutionTime: 2.2 }
  ]
};

// Helper functions to get data by user role
export const getDataForUser = (userId: string, role: string) => {
  switch (role) {
    case 'property_manager':
      return {
        user: mockPropertyManager,
        properties: mockProperties,
        serviceRequests: mockServiceRequests,
        tenants: mockUsers.filter(u => u.role === 'tenant'),
        serviceProviders: mockServiceProviders,
        analytics: mockAnalyticsData
      };
    case 'tenant':
      // Always use mockTenant which has all tenant properties including rentAmount
      const tenant = userId === '2' ? mockTenant : mockTenant;
      const tenantProperty = mockProperties.find(p => p.tenantId === tenant.id);
      const tenantRequests = mockServiceRequests.filter(r => r.tenantId === tenant.id);
      return {
        user: tenant,
        property: tenantProperty,
        serviceRequests: tenantRequests,
        documents: mockDocuments.filter(d => d.tenantId === tenant.id)
      };
    case 'service_provider':
      const provider = mockServiceProviders.find(sp => sp.id === userId) || mockServiceProvider;
      const assignedRequests = mockServiceRequests.filter(r => r.assignedProviderId === provider.id);
      return {
        user: provider,
        workOrders: assignedRequests,
        completedJobs: assignedRequests.filter(r => r.status === 'completed'),
        properties: mockProperties
      };
    default:
      return null;
  }
};
