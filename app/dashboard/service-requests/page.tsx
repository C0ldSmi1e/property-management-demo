'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { formatCurrency, formatDate, getRelativeTime } from '../../utils/helpers';
import { ServiceRequest } from '../../types';
import {
  Wrench,
  Search,
  MoreHorizontal,
  Eye,
  UserCheck,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus
} from 'lucide-react';

export default function ServiceRequestsPage() {
  const { userData, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  if (!userData) return null;

  const serviceRequests = (userData as any).serviceRequests || [];

  // Get properties based on user role
  const properties = user?.role === 'property_manager'
    ? (userData as any).properties
    : (userData as any).property
      ? [(userData as any).property]
      : [];

  // Filter service requests
  const filteredRequests = serviceRequests.filter((request: ServiceRequest) => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'assigned': return 'outline';
      case 'pending': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Clock;
      case 'assigned': return UserCheck;
      case 'pending': return AlertTriangle;
      default: return Wrench;
    }
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find((p: any) => p.id === propertyId);
    return property?.name || 'Unknown Property';
  };

  // Stats for different user roles
  const getStats = () => {
    const pending = serviceRequests.filter((r: ServiceRequest) => r.status === 'pending').length;
    const inProgress = serviceRequests.filter((r: ServiceRequest) => r.status === 'in_progress').length;
    const completed = serviceRequests.filter((r: ServiceRequest) => r.status === 'completed').length;
    const assigned = serviceRequests.filter((r: ServiceRequest) => r.status === 'assigned').length;

    if (user?.role === 'property_manager') {
      return [
        { label: 'Pending Review', value: pending, color: 'text-red-600' },
        { label: 'Assigned', value: assigned, color: 'text-blue-600' },
        { label: 'In Progress', value: inProgress, color: 'text-yellow-600' },
        { label: 'Completed', value: completed, color: 'text-green-600' },
      ];
    } else if (user?.role === 'tenant') {
      return [
        { label: 'Pending', value: pending, color: 'text-red-600' },
        { label: 'In Progress', value: inProgress + assigned, color: 'text-yellow-600' },
        { label: 'Completed', value: completed, color: 'text-green-600' },
      ];
    } else {
      return [
        { label: 'Assigned', value: assigned, color: 'text-blue-600' },
        { label: 'In Progress', value: inProgress, color: 'text-yellow-600' },
        { label: 'Completed', value: completed, color: 'text-green-600' },
      ];
    }
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Requests</h1>
          <p className="text-muted-foreground">
            {user?.role === 'property_manager'
              ? 'Manage and assign service requests'
              : user?.role === 'tenant'
                ? 'Track your service requests'
                : 'Manage your assigned work orders'
            }
          </p>
        </div>
        {user?.role === 'tenant' && (
          <Button asChild>
            <Link href="/dashboard/service-requests/new">
              <Plus className="mr-2 h-4 w-4" />
              Submit Request
            </Link>
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search service requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'assigned', 'in_progress', 'completed'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="capitalize"
                >
                  {status.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredRequests.length} Request{filteredRequests.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request: ServiceRequest) => {
                  const StatusIcon = getStatusIcon(request.status);
                  return (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {request.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{getPropertyName(request.propertyId)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{request.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadgeVariant(request.priority)}>
                          {request.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" />
                          <Badge variant={getStatusBadgeVariant(request.status)}>
                            {request.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {getRelativeTime(request.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/service-requests/${request.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            {user?.role === 'property_manager' && request.status === 'pending' && (
                              <DropdownMenuItem>
                                <UserCheck className="w-4 h-4 mr-2" />
                                Assign Provider
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No service requests found</h3>
              <p className="mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No service requests have been submitted yet'
                }
              </p>
              {user?.role === 'tenant' && (!searchTerm && statusFilter === 'all') && (
                <Button asChild>
                  <Link href="/dashboard/service-requests/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Submit Your First Request
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
