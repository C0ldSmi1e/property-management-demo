'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { formatCurrency, getRelativeTime } from '../../utils/helpers';
import { ServiceRequest } from '../../types';
import { NotificationsFeed } from '../NotificationsFeed';
import {
  Wrench,
  CheckCircle,
  DollarSign,
  Star,
  Clock,
  Eye,
  Check,
  X
} from 'lucide-react';

interface ServiceProviderDashboardProps {
  userData: {
    user: any;
    workOrders: ServiceRequest[];
    completedJobs: ServiceRequest[];
  };
}

const ServiceProviderDashboard: React.FC<ServiceProviderDashboardProps> = ({ userData }) => {
  const { user, workOrders, completedJobs } = userData;
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  // Calculate dashboard stats
  const pendingOrders = workOrders.filter(r => r.status === 'assigned').length;
  const inProgressOrders = workOrders.filter(r => r.status === 'in_progress').length;
  const totalEarnings = completedJobs.reduce((sum, job) => sum + (job.actualCost || job.estimatedCost || 0), 0);
  const averageRating = user.rating;

  const handleStatusUpdate = (requestId: string, newStatus: string) => {
    // In a real app, this would update the status via API
    console.log(`Updating request ${requestId} to status: ${newStatus}`);
    setSelectedRequest(null);
  };

  const getStatusActions = (request: ServiceRequest) => {
    switch (request.status) {
      case 'assigned':
        return [
          { label: 'Accept Job', status: 'in_progress', variant: 'default' as const, icon: Check },
          { label: 'Decline', status: 'pending', variant: 'outline' as const, icon: X }
        ];
      case 'in_progress':
        return [
          { label: 'Mark Complete', status: 'completed', variant: 'default' as const, icon: CheckCircle }
        ];
      default:
        return [];
    }
  };

  const stats = [
    {
      title: 'Active Jobs',
      value: pendingOrders + inProgressOrders,
      description: `${pendingOrders} pending • ${inProgressOrders} in progress`,
      icon: Wrench,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Completed Jobs',
      value: user.completedJobs,
      description: `${completedJobs.length} this month`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Earnings',
      value: formatCurrency(totalEarnings),
      description: 'From completed jobs',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Rating',
      value: averageRating,
      description: 'Average customer rating',
      icon: Star,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">
            Manage your work orders and schedule.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            {user.availability}
          </Badge>
          <Button variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            Update Availability
          </Button>
        </div>
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

      {/* Work Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Wrench className="w-5 h-5 mr-2" />
              Work Orders
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/work-orders">
                View All
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workOrders.length > 0 ? (
              workOrders.map((request) => (
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
                      {request.estimatedCost && (
                        <Badge variant="secondary" className="text-xs">
                          {formatCurrency(request.estimatedCost)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{request.category}</p>
                    <p className="text-xs text-muted-foreground">{getRelativeTime(request.createdAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {getStatusActions(request).map((action, index) => {
                      const ActionIcon = action.icon;
                      return (
                        <Button
                          key={index}
                          variant={action.variant}
                          size="sm"
                          onClick={() => handleStatusUpdate(request.id, action.status)}
                        >
                          <ActionIcon className="w-4 h-4 mr-1" />
                          {action.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Wrench className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No active work orders</p>
                <p className="text-sm">New assignments will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Services Offered */}
      <Card>
        <CardHeader>
          <CardTitle>Your Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {user.services.map((service: string) => (
              <Badge key={service} variant="secondary">
                {service}
              </Badge>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-4">
            Manage Services
          </Button>
        </CardContent>
      </Card>

      {/* Work Order Details Modal */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Work Order Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-lg">{selectedRequest.title}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{selectedRequest.priority}</Badge>
                  <Badge variant="outline">{selectedRequest.status.replace('_', ' ')}</Badge>
                  <Badge variant="secondary">{selectedRequest.category}</Badge>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-sm mb-2">Description</h5>
                <p className="text-sm text-muted-foreground">{selectedRequest.description}</p>
              </div>

              {selectedRequest.estimatedCost && (
                <div>
                  <h5 className="font-medium text-sm mb-2">Estimated Cost</h5>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(selectedRequest.estimatedCost)}
                  </p>
                </div>
              )}

              {selectedRequest.notes && selectedRequest.notes.length > 0 && (
                <div>
                  <h5 className="font-medium text-sm mb-2">Notes</h5>
                  <div className="space-y-2">
                    {selectedRequest.notes.map((note, index) => (
                      <p key={index} className="text-sm p-2 bg-muted rounded text-muted-foreground">
                        {note}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              {getStatusActions(selectedRequest).map((action, index) => {
                const ActionIcon = action.icon;
                return (
                  <Button
                    key={index}
                    variant={action.variant}
                    onClick={() => handleStatusUpdate(selectedRequest.id, action.status)}
                  >
                    <ActionIcon className="w-4 h-4 mr-2" />
                    {action.label}
                  </Button>
                );
              })}
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Notifications */}
      <NotificationsFeed maxItems={5} showHeader={true} userRole="service_provider" />
    </div>
  );
};

export default ServiceProviderDashboard;