'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate, getRelativeTime } from '../../../utils/helpers';
import { ServiceRequest } from '../../../types';
import { ServiceRating } from '../../../components/ServiceRating';
import {
  Wrench,
  MapPin,
  Edit,
  MessageCircle,
  Calendar,
  DollarSign,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Upload,
  FileText,
  ArrowLeft
} from 'lucide-react';

interface ServiceRequestDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ServiceRequestDetailPage({ params }: ServiceRequestDetailPageProps) {
  const { userData, user } = useAuth();
  const resolvedParams = React.use(params);
  const [newNote, setNewNote] = useState('');
  const [assignedProvider, setAssignedProvider] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');

  if (!userData) return null;

  const { serviceRequests, properties, tenants, serviceProviders } = userData;
  const request = serviceRequests.find((r: ServiceRequest) => r.id === resolvedParams.id);
  const property = request ? properties.find((p: any) => p.id === request.propertyId) : null;
  const tenant = request ? tenants.find((t: any) => t.id === request.tenantId) : null;
  const assignedServiceProvider = request?.assignedProviderId
    ? serviceProviders?.find((sp: any) => sp.id === request.assignedProviderId)
    : null;

  if (!request) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <Wrench className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Service request not found</h3>
            <p className="text-muted-foreground mb-4">
              The service request you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/dashboard/service-requests">
                Back to Service Requests
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      console.log('Adding note:', newNote);
      setNewNote('');
    }
  };

  const handleAssignProvider = () => {
    if (assignedProvider) {
      console.log('Assigning provider:', assignedProvider);
      setAssignedProvider('');
    }
  };

  const handleStatusUpdate = (newStatus: string) => {
    console.log(`Updating request ${request.id} to status: ${newStatus}`);
  };

  const StatusIcon = getStatusIcon(request.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard/service-requests" className="hover:text-foreground flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Service Requests
            </Link>
            <span>/</span>
            <span>#{resolvedParams.id}</span>
          </div>
          <div className="flex items-center gap-3">
            <StatusIcon className="w-6 h-6" />
            <h1 className="text-3xl font-bold tracking-tight">{request.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getPriorityBadgeVariant(request.priority)}>
              {request.priority}
            </Badge>
            <Badge variant={getStatusBadgeVariant(request.status)}>
              {request.status.replace('_', ' ')}
            </Badge>
            <Badge variant="outline">{request.category}</Badge>
          </div>
        </div>

        <div className="flex gap-2">
          {user?.role === 'property_manager' && request.status === 'pending' && (
            <Button>
              <UserCheck className="mr-2 h-4 w-4" />
              Assign Provider
            </Button>
          )}
          {user?.role === 'service_provider' && request.status === 'assigned' && (
            <Button onClick={() => handleStatusUpdate('in_progress')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Accept Job
            </Button>
          )}
          <Button variant="outline">
            <MessageCircle className="mr-2 h-4 w-4" />
            Message
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{formatDate(request.createdAt)}</div>
            <p className="text-xs text-muted-foreground">{getRelativeTime(request.createdAt)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-600">
              {request.estimatedCost ? formatCurrency(request.estimatedCost) : 'TBD'}
            </div>
            {request.actualCost && (
              <p className="text-xs text-muted-foreground">
                Actual: {formatCurrency(request.actualCost)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Property</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{property?.name}</div>
            <p className="text-xs text-muted-foreground">{property?.address}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{formatDate(request.updatedAt)}</div>
            <p className="text-xs text-muted-foreground">{getRelativeTime(request.updatedAt)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Request Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{request.description}</p>
            </div>

            {request.images && request.images.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Attached Images</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {request.images.map((image: string, index: number) => (
                    <div key={index} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <div>
              <h4 className="font-medium mb-3">Activity Timeline</h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium">Request Created</p>
                    <p className="text-xs text-muted-foreground">{formatDate(request.createdAt)}</p>
                  </div>
                </div>

                {request.assignedProviderId && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                    <div>
                      <p className="text-sm font-medium">Assigned to Service Provider</p>
                      <p className="text-xs text-muted-foreground">{formatDate(request.updatedAt)}</p>
                    </div>
                  </div>
                )}

                {request.status === 'completed' && request.completedAt && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                    <div>
                      <p className="text-sm font-medium">Work Completed</p>
                      <p className="text-xs text-muted-foreground">{formatDate(request.completedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {request.notes && request.notes.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-3">Notes & Updates</h4>
                  <div className="space-y-3">
                    {request.notes.map((note: string, index: number) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{note}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(request.updatedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Add Note Form (for property managers) */}
            {user?.role === 'property_manager' && (
              <>
                <Separator />
                <form onSubmit={handleAddNote} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="note">Add Note</Label>
                    <Textarea
                      id="note"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note or update about this request..."
                      rows={3}
                    />
                  </div>
                  <Button type="submit" disabled={!newNote.trim()}>
                    Add Note
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tenant Information */}
          {tenant && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tenant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={tenant.avatar} />
                    <AvatarFallback>{tenant.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{tenant.name}</p>
                    <p className="text-sm text-muted-foreground">{tenant.email}</p>
                    {tenant.phone && (
                      <p className="text-sm text-muted-foreground">{tenant.phone}</p>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                  <Link href={`/dashboard/tenants/${tenant.id}`}>
                    <User className="w-4 h-4 mr-1" />
                    View Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Assigned Service Provider */}
          {assignedServiceProvider ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Assigned Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={assignedServiceProvider.avatar} />
                    <AvatarFallback>{assignedServiceProvider.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{assignedServiceProvider.name}</p>
                    <p className="text-sm text-muted-foreground">{assignedServiceProvider.email}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {assignedServiceProvider.rating}★
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        ({assignedServiceProvider.completedJobs} jobs)
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Contact Provider
                </Button>
              </CardContent>
            </Card>
          ) : user?.role === 'property_manager' && request.status === 'pending' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Assign Service Provider</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Select Provider</Label>
                  <Select value={assignedProvider} onValueChange={setAssignedProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a service provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceProviders?.map((provider: any) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name} ({provider.rating}★)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Estimated Cost</Label>
                  <Input
                    id="cost"
                    type="number"
                    placeholder="Enter estimated cost"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleAssignProvider}
                  disabled={!assignedProvider}
                  className="w-full"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Assign Provider
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Property Information */}
          {property && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Property</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{property.name}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.address}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <p className="font-medium capitalize">{property.type}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Size:</span>
                      <p className="font-medium">{property.size} sq ft</p>
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                  <Link href={`/dashboard/properties/${property.id}`}>
                    <MapPin className="w-4 h-4 mr-1" />
                    View Property
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {user?.role === 'property_manager' && (
                <>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Request
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message Tenant
                  </Button>
                </>
              )}

              {user?.role === 'tenant' && (
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Add Photos
                </Button>
              )}

              {user?.role === 'service_provider' && request.status === 'in_progress' && (
                <>
                  <Button size="sm" className="w-full" onClick={() => handleStatusUpdate('completed')}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photos
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Service Rating */}
          {request.status === 'completed' && user?.role === 'tenant' && (
            <Card>
              <CardHeader>
                <CardTitle>Rate This Service</CardTitle>
              </CardHeader>
              <CardContent>
                <ServiceRating
                  serviceRequestId={request.id}
                  providerId={request.assignedProviderId}
                  showRatingForm={true}
                />
              </CardContent>
            </Card>
          )}

          {/* View Ratings (for property managers and service providers) */}
          {(user?.role === 'property_manager' || user?.role === 'service_provider') && (
            <Card>
              <CardHeader>
                <CardTitle>Service Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <ServiceRating
                  serviceRequestId={request.id}
                  providerId={request.assignedProviderId}
                  showRatingForm={false}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
