'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatDate, getRelativeTime } from '../../../utils/helpers';
import {
  Users,
  MapPin,
  Edit,
  Building,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  Wrench,
  UserCheck
} from 'lucide-react';

interface TenantDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TenantDetailPage({ params }: TenantDetailPageProps) {
  const { userData } = useAuth();
  const resolvedParams = React.use(params);

  if (!userData) return null;

  const { tenants, properties, serviceRequests } = userData;
  const tenant = tenants.find((t: any) => t.id === resolvedParams.id);
  const property = tenant ? properties.find((p: any) => p.tenantId === tenant.id) : null;
  const tenantRequests = serviceRequests.filter((r: any) => r.tenantId === resolvedParams.id);

  if (!tenant) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Tenant not found</h3>
            <p className="text-muted-foreground mb-4">
              The tenant you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/dashboard/tenants">
                Back to Tenants
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getLeaseStatus = (leaseEndDate: string) => {
    const endDate = new Date(leaseEndDate);
    const now = new Date();
    const monthsLeft = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));

    if (monthsLeft < 0) return { status: 'expired', variant: 'destructive' as const };
    if (monthsLeft <= 2) return { status: 'expiring soon', variant: 'secondary' as const };
    return { status: 'active', variant: 'default' as const };
  };

  const leaseStatus = getLeaseStatus(tenant.leaseEndDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard/tenants" className="hover:text-foreground">
              Tenants
            </Link>
            <span>/</span>
            <span>{tenant.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={tenant.avatar} />
              <AvatarFallback className="text-lg">{tenant.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{tenant.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <p className="text-muted-foreground">{tenant.email}</p>
              </div>
              {tenant.phone && (
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <p className="text-muted-foreground">{tenant.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Tenant
          </Button>
          <Button variant="outline">
            <MessageCircle className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lease Status</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={leaseStatus.variant} className="mb-2">
              {leaseStatus.status}
            </Badge>
            <p className="text-xs text-muted-foreground">
              Expires: {formatDate(tenant.leaseEndDate)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Rent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(tenant.rentAmount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Requests</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenantRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              {tenantRequests.filter((r: any) => r.status === 'pending').length} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tenant Since</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{formatDate(tenant.leaseStartDate)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.floor((new Date().getTime() - new Date(tenant.leaseStartDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="property">Property</TabsTrigger>
          <TabsTrigger value="lease">Lease Details</TabsTrigger>
          <TabsTrigger value="requests">Service Requests</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                    <p>{tenant.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{tenant.email}</p>
                  </div>
                  {tenant.phone && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p>{tenant.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tenant ID</p>
                    <p className="font-mono text-sm">{tenant.id}</p>
                  </div>
                </div>

                {tenant.emergencyContact && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3">Emergency Contact</p>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium">{tenant.emergencyContact.name}</p>
                          <p className="text-sm text-muted-foreground">{tenant.emergencyContact.relationship}</p>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span className="text-sm">{tenant.emergencyContact.phone}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lease Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Monthly Rent</span>
                    <span className="font-medium">{formatCurrency(tenant.rentAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Lease Start</span>
                    <span className="font-medium">{formatDate(tenant.leaseStartDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Lease End</span>
                    <span className="font-medium">{formatDate(tenant.leaseEndDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={leaseStatus.variant}>
                      {leaseStatus.status}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Annual Revenue</span>
                    <span className="font-medium">{formatCurrency(tenant.rentAmount * 12)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Paid</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(
                        Math.floor((new Date().getTime() - new Date(tenant.leaseStartDate).getTime()) / (1000 * 60 * 60 * 24 * 30)) * tenant.rentAmount
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="property" className="space-y-4">
          {property ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Assigned Property</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/properties/${property.id}`}>
                      View Property Details
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">{property.name}</h3>
                  <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.address}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <p className="capitalize">{property.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Size</p>
                    <p>{property.size} sq ft</p>
                  </div>
                  {property.bedrooms && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Bedrooms</p>
                      <p>{property.bedrooms}</p>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Bathrooms</p>
                      <p>{property.bathrooms}</p>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-1">
                    {property.amenities.map((amenity: string) => (
                      <Badge key={amenity} variant="outline">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                  <p className="text-sm">{property.description}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No property assigned</h3>
                <p className="text-muted-foreground mb-4">
                  This tenant is not currently assigned to any property
                </p>
                <Button variant="outline">
                  Assign Property
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="lease" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lease Agreement Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Lease Terms</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Start Date</span>
                      <span className="font-medium">{formatDate(tenant.leaseStartDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">End Date</span>
                      <span className="font-medium">{formatDate(tenant.leaseEndDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span className="font-medium">
                        {Math.floor((new Date(tenant.leaseEndDate).getTime() - new Date(tenant.leaseStartDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant={leaseStatus.variant}>
                        {leaseStatus.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Financial Terms</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Rent</span>
                      <span className="font-medium">{formatCurrency(tenant.rentAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Security Deposit</span>
                      <span className="font-medium">{formatCurrency(tenant.rentAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Paid</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(
                          Math.floor((new Date().getTime() - new Date(tenant.leaseStartDate).getTime()) / (1000 * 60 * 60 * 24 * 30)) * tenant.rentAmount
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Lease Documents</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Lease Agreement - {tenant.name}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Move-in Inspection Report</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Service Requests</CardTitle>
                <Button variant="outline" size="sm">
                  View All Requests
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tenantRequests.length > 0 ? (
                <div className="space-y-4">
                  {tenantRequests.map((request: any) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{request.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {request.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {request.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{request.category}</p>
                        <p className="text-xs text-muted-foreground">{getRelativeTime(request.createdAt)}</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/service-requests/${request.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Wrench className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No service requests from this tenant</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No communication history yet</p>
                <p className="text-sm">Messages and notifications will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
