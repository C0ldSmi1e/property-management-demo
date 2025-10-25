'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { PropertyGallery } from '../../components/PropertyGallery';
import {
  Home,
  MapPin,
  MessageCircle,
  Wrench,
  Bed,
  Bath,
  Square,
  Calendar,
  DollarSign,
  FileText,
  Phone,
  Mail,
  Building
} from 'lucide-react';

export default function TenantPropertyPage() {
  const { userData, user } = useAuth();

  if (!userData || !user) return null;

  const { property, serviceRequests } = userData;

  if (!property) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No property assigned</h3>
            <p className="text-muted-foreground mb-4">
              You don't currently have a property assigned to your account.
            </p>
            <Button variant="outline">
              Contact Property Manager
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const recentRequests = serviceRequests
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const nextRentDue = new Date();
  nextRentDue.setMonth(nextRentDue.getMonth() + 1);
  nextRentDue.setDate(1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{property.name}</h1>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <p className="text-muted-foreground">{property.address}</p>
          </div>
          <Badge variant="default" className="w-fit">
            Your Residence
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageCircle className="mr-2 h-4 w-4" />
            Contact Manager
          </Button>
          <Button asChild>
            <Link href="/dashboard/service-requests">
              <Wrench className="mr-2 h-4 w-4" />
              Service Request
            </Link>
          </Button>
        </div>
      </div>

      {/* Property Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Rent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(property.rentAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Next due: {formatDate(nextRentDue.toISOString())}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Property Size</CardTitle>
            <Square className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{property.size}</div>
            <p className="text-xs text-muted-foreground">square feet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lease Status</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-blue-600">Active</div>
            <p className="text-xs text-muted-foreground">
              Expires: {formatDate((user as any).leaseEndDate)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Requests</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviceRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              {serviceRequests.filter((r: any) => r.status === 'pending').length} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Property Details</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="lease">Lease Information</TabsTrigger>
          <TabsTrigger value="maintenance">Recent Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Basic Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Property Type</span>
                      <span className="font-medium capitalize">{property.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Size</span>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        <span className="font-medium">{property.size} sq ft</span>
                      </div>
                    </div>
                    {property.bedrooms && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Bedrooms</span>
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          <span className="font-medium">{property.bedrooms}</span>
                        </div>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Bathrooms</span>
                        <div className="flex items-center">
                          <Bath className="w-4 h-4 mr-1" />
                          <span className="font-medium">{property.bathrooms}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Address & Contact</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Full Address</span>
                      <p className="font-medium">{property.address}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Property Manager</span>
                      <div className="mt-1">
                        <p className="font-medium">Sarah Johnson</p>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="w-4 h-4 mr-1" />
                            (555) 123-4567
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="w-4 h-4 mr-1" />
                            sarah@propertymanagement.com
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Property Description</h4>
                <p className="text-sm text-muted-foreground">{property.description}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos" className="space-y-4">
          <PropertyGallery propertyId={property.id} />
        </TabsContent>

        <TabsContent value="amenities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {property.amenities.map((amenity: string) => (
                  <div key={amenity} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Home className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lease" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lease Agreement Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Lease Terms</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Start Date</span>
                      <span className="font-medium">{formatDate((user as any).leaseStartDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">End Date</span>
                      <span className="font-medium">{formatDate((user as any).leaseEndDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Rent</span>
                      <span className="font-medium text-green-600">{formatCurrency((user as any).rentAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Security Deposit</span>
                      <span className="font-medium">{formatCurrency((user as any).rentAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Emergency Contact</h4>
                  {(user as any).emergencyContact ? (
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">{(user as any).emergencyContact.name}</p>
                        <p className="text-sm text-muted-foreground">{(user as any).emergencyContact.relationship}</p>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-muted-foreground" />
                        <span className="text-sm">{(user as any).emergencyContact.phone}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No emergency contact on file</p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Lease Documents</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Lease Agreement</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/documents">
                        View
                      </Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Move-in Inspection Report</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/documents">
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
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
              {recentRequests.length > 0 ? (
                <div className="space-y-4">
                  {recentRequests.map((request: any) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                        <p className="text-xs text-muted-foreground">{formatDate(request.createdAt)}</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/service-requests/${request.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Wrench className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No recent service requests</p>
                  <p className="text-sm">Submit a request if you need maintenance</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto p-4" asChild>
              <Link href="/dashboard/service-requests">
                <div className="text-center">
                  <Wrench className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">Submit Service Request</p>
                  <p className="text-xs text-muted-foreground">Report maintenance issues</p>
                </div>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto p-4" asChild>
              <Link href="/dashboard/documents">
                <div className="text-center">
                  <FileText className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">View Documents</p>
                  <p className="text-xs text-muted-foreground">Access lease and records</p>
                </div>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto p-4" asChild>
              <Link href="/dashboard/messages">
                <div className="text-center">
                  <MessageCircle className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">Contact Manager</p>
                  <p className="text-xs text-muted-foreground">Send a message</p>
                </div>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <DollarSign className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Pay Rent</p>
                <p className="text-xs text-muted-foreground">Make online payment</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
