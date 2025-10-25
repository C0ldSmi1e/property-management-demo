'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate, getRelativeTime } from '../../utils/helpers';
import { Property, ServiceRequest } from '../../types';
import { NotificationsFeed } from '../NotificationsFeed';
import {
  Building,
  DollarSign,
  Wrench,
  AlertTriangle,
  Plus,
  Eye,
  TrendingUp,
  Users
} from 'lucide-react';

interface PropertyManagerDashboardProps {
  userData: {
    user: any;
    properties: Property[];
    serviceRequests: ServiceRequest[];
    tenants: any[];
    serviceProviders: any[];
    analytics: any;
  };
}

const PropertyManagerDashboard: React.FC<PropertyManagerDashboardProps> = ({ userData }) => {
  const { user, properties, serviceRequests, analytics } = userData;

  // Calculate dashboard stats
  const occupiedProperties = properties.filter(p => p.status === 'occupied').length;
  const vacantProperties = properties.filter(p => p.status === 'vacant').length;
  const maintenanceProperties = properties.filter(p => p.status === 'maintenance').length;
  const pendingRequests = serviceRequests.filter(r => r.status === 'pending').length;
  const totalMonthlyRent = properties
    .filter(p => p.status === 'occupied')
    .reduce((sum, p) => sum + p.rentAmount, 0);

  // Recent service requests
  const recentRequests = serviceRequests
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      title: 'Total Properties',
      value: properties.length,
      icon: Building,
      description: `${occupiedProperties} occupied • ${vacantProperties} vacant`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(totalMonthlyRent),
      icon: DollarSign,
      description: `${Math.round((occupiedProperties / properties.length) * 100)}% occupancy rate`,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Service Requests',
      value: serviceRequests.length,
      icon: Wrench,
      description: `${pendingRequests} pending review`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Maintenance Issues',
      value: maintenanceProperties,
      icon: AlertTriangle,
      description: 'Properties needing attention',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'assigned': return 'outline';
      case 'pending': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your properties today.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/properties/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-md ${stat.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Service Requests */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Service Requests</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/service-requests">
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRequests.length > 0 ? (
                recentRequests.map((request) => {
                  const property = properties.find(p => p.id === request.propertyId);
                  return (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{request.title}</h4>
                          <Badge variant={getPriorityVariant(request.priority)}>
                            {request.priority}
                          </Badge>
                          <Badge variant={getStatusVariant(request.status)}>
                            {request.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{property?.name}</p>
                        <p className="text-xs text-muted-foreground">{getRelativeTime(request.createdAt)}</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/service-requests/${request.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Wrench className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No recent service requests</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Property Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Properties</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/properties">
                  <TrendingUp className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {properties.slice(0, 5).map((property) => {
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case 'occupied': return 'default';
                    case 'vacant': return 'secondary';
                    case 'maintenance': return 'destructive';
                    default: return 'outline';
                  }
                };

                return (
                  <div key={property.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-sm leading-none">{property.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(property.status)}>
                          {property.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(property.rentAmount)}/mo
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <Separator />
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/properties">
                  View All Properties
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <NotificationsFeed maxItems={5} showHeader={true} userRole="property_manager" />
    </div>
  );
};

export default PropertyManagerDashboard;