'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { formatCurrency, formatDate, getRelativeTime } from '../../utils/helpers';
import { ServiceRequest } from '../../types';
import { NotificationsFeed } from '../NotificationsFeed';
import {
  Home,
  DollarSign,
  Wrench,
  FileText,
  Calendar,
  Plus,
  Eye,
  MapPin,
  Bed,
  Bath,
  Square,
  Wifi
} from 'lucide-react';

interface TenantDashboardProps {
  userData: {
    user: any;
    property: any;
    serviceRequests: ServiceRequest[];
    documents: any[];
  };
}

const TenantDashboard: React.FC<TenantDashboardProps> = ({ userData }) => {
  const { user, property, serviceRequests, documents } = userData;
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [serviceRequestForm, setServiceRequestForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as const
  });

  // Debug: Log user data
  console.log('TenantDashboard - user:', user);
  console.log('TenantDashboard - user.rentAmount:', (user as any).rentAmount);
  console.log('TenantDashboard - property:', property);
  console.log('TenantDashboard - property.rentAmount:', property?.rentAmount);

  // Calculate dashboard stats
  const pendingRequests = serviceRequests.filter(r => r.status === 'pending').length;
  const completedRequests = serviceRequests.filter(r => r.status === 'completed').length;
  const nextRentDue = new Date();
  nextRentDue.setMonth(nextRentDue.getMonth() + 1);
  nextRentDue.setDate(1);

  const handleServiceRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    console.log('Service request submitted:', serviceRequestForm);
    setIsRequestDialogOpen(false);
    setServiceRequestForm({
      title: '',
      description: '',
      category: '',
      priority: 'medium'
    });
  };

  // Get rent amount from user or property
  const rentAmount = (user as any).rentAmount || property?.rentAmount || 0;
  const leaseEndDate = (user as any).leaseEndDate || '';

  const stats = [
    {
      title: 'Monthly Rent',
      value: formatCurrency(rentAmount),
      description: `Next due: ${formatDate(nextRentDue.toISOString())}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Service Requests',
      value: serviceRequests.length,
      description: `${pendingRequests} pending`,
      icon: Wrench,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Lease Status',
      value: 'Active',
      description: `Expires: ${formatDate(leaseEndDate)}`,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Documents',
      value: documents.length,
      description: 'Available for download',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome home, {user.name}</h1>
          <p className="text-muted-foreground">
            Manage your residence and service requests.
          </p>
        </div>
        <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Submit Service Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Submit Service Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleServiceRequestSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={serviceRequestForm.title}
                  onChange={(e) => setServiceRequestForm({ ...serviceRequestForm, title: e.target.value })}
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={serviceRequestForm.category}
                  onValueChange={(value) => setServiceRequestForm({ ...serviceRequestForm, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="HVAC">HVAC</SelectItem>
                    <SelectItem value="Appliances">Appliances</SelectItem>
                    <SelectItem value="General Maintenance">General Maintenance</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={serviceRequestForm.priority}
                  onValueChange={(value) => setServiceRequestForm({ ...serviceRequestForm, priority: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={serviceRequestForm.description}
                  onChange={(e) => setServiceRequestForm({ ...serviceRequestForm, description: e.target.value })}
                  placeholder="Please provide detailed information about the issue"
                  rows={4}
                  required
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Property Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="w-5 h-5 mr-2" />
              Your Property
            </CardTitle>
          </CardHeader>
          <CardContent>
            {property ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">{property.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.address}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium capitalize">{property.type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <div className="flex items-center">
                      <Square className="w-3 h-3 mr-1" />
                      <span className="font-medium">{property.size} sq ft</span>
                    </div>
                  </div>
                  {property.bedrooms && (
                    <div>
                      <span className="text-muted-foreground">Bedrooms:</span>
                      <div className="flex items-center">
                        <Bed className="w-3 h-3 mr-1" />
                        <span className="font-medium">{property.bedrooms}</span>
                      </div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div>
                      <span className="text-muted-foreground">Bathrooms:</span>
                      <div className="flex items-center">
                        <Bath className="w-3 h-3 mr-1" />
                        <span className="font-medium">{property.bathrooms}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-muted-foreground text-sm">Amenities:</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {property.amenities.map((amenity: string) => (
                      <Badge key={amenity} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/dashboard/property">
                    View Full Details
                  </Link>
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">No property information available</p>
            )}
          </CardContent>
        </Card>

        {/* Service Requests */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Wrench className="w-5 h-5 mr-2" />
                Your Service Requests
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/service-requests">
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceRequests.length > 0 ? (
                serviceRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{request.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {request.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {request.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{request.category}</p>
                      <p className="text-xs text-muted-foreground">{getRelativeTime(request.createdAt)}</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/service-requests/${request.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Wrench className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No service requests yet</p>
                  <p className="text-sm">Click "Submit Service Request" to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <NotificationsFeed maxItems={5} showHeader={true} userRole="tenant" />
    </div>
  );
};

export default TenantDashboard;