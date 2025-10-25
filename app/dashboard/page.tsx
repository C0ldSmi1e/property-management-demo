'use client';

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import PropertyManagerDashboard from '../components/dashboard/PropertyManagerDashboard';
import TenantDashboard from '../components/dashboard/TenantDashboard';
import ServiceProviderDashboard from '../components/dashboard/ServiceProviderDashboard';

export default function DashboardPage() {
  const { user, userData } = useAuth();

  if (!user || !userData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Render role-specific dashboard
  switch (user.role) {
    case 'property_manager':
      return <PropertyManagerDashboard userData={userData} />;
    case 'tenant':
      return <TenantDashboard userData={userData} />;
    case 'service_provider':
      return <ServiceProviderDashboard userData={userData} />;
    default:
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to PropertyHub
          </h2>
          <p className="text-gray-600">
            Your dashboard is being prepared...
          </p>
        </div>
      );
  }
}
