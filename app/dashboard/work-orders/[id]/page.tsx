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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatDate, getRelativeTime } from '../../../utils/helpers';
import { ServiceRequest } from '../../../types';
import { ServiceRating } from '../../../components/ServiceRating';
import {
  Wrench,
  MapPin,
  MessageCircle,
  Calendar,
  DollarSign,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  Upload,
  FileText,
  ArrowLeft,
  Check,
  X,
  Camera
} from 'lucide-react';

interface WorkOrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function WorkOrderDetailPage({ params }: WorkOrderDetailPageProps) {
  const { userData, user } = useAuth();
  const resolvedParams = React.use(params);
  const [progressUpdate, setProgressUpdate] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');
  const [finalCost, setFinalCost] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  if (!userData) return null;

  const { workOrders, properties } = userData;
  const workOrder = workOrders.find((w: ServiceRequest) => w.id === resolvedParams.id);
  const property = workOrder ? properties.find((p: any) => p.id === workOrder.propertyId) : null;

  if (!workOrder) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <Wrench className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Work order not found</h3>
            <p className="text-muted-foreground mb-4">
              The work order you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/dashboard/work-orders">
                Back to Work Orders
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
      case 'assigned': return Wrench;
      case 'pending': return AlertTriangle;
      default: return Wrench;
    }
  };

  const handleStatusUpdate = (newStatus: string) => {
    console.log(`Updating work order ${workOrder.id} to status: ${newStatus}`);
  };

  const handleAddProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (progressUpdate.trim()) {
      console.log('Adding progress update:', progressUpdate);
      setProgressUpdate('');
    }
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Completing work order:', {
      id: workOrder.id,
      notes: completionNotes,
      finalCost: parseFloat(finalCost) || workOrder.estimatedCost,
      photos: uploadedPhotos
    });
    handleStatusUpdate('completed');
  };

  const handlePhotoUpload = () => {
    const newPhoto = `/work-orders/${workOrder.id}/photo-${Date.now()}.jpg`;
    setUploadedPhotos([...uploadedPhotos, newPhoto]);
  };

  const StatusIcon = getStatusIcon(workOrder.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard/work-orders" className="hover:text-foreground flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Work Orders
            </Link>
            <span>/</span>
            <span>#{resolvedParams.id}</span>
          </div>
          <div className="flex items-center gap-3">
            <StatusIcon className="w-6 h-6" />
            <h1 className="text-3xl font-bold tracking-tight">{workOrder.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getPriorityBadgeVariant(workOrder.priority)}>
              {workOrder.priority}
            </Badge>
            <Badge variant={getStatusBadgeVariant(workOrder.status)}>
              {workOrder.status.replace('_', ' ')}
            </Badge>
            <Badge variant="outline">{workOrder.category}</Badge>
          </div>
        </div>

        <div className="flex gap-2">
          {workOrder.status === 'assigned' && (
            <>
              <Button variant="outline" onClick={() => handleStatusUpdate('pending')}>
                <X className="mr-2 h-4 w-4" />
                Decline
              </Button>
              <Button onClick={() => handleStatusUpdate('in_progress')}>
                <Check className="mr-2 h-4 w-4" />
                Accept Job
              </Button>
            </>
          )}
          <Button variant="outline">
            <MessageCircle className="mr-2 h-4 w-4" />
            Message Client
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
            <div className="text-lg font-bold">{formatDate(workOrder.createdAt)}</div>
            <p className="text-xs text-muted-foreground">{getRelativeTime(workOrder.createdAt)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-600">
              {workOrder.estimatedCost ? formatCurrency(workOrder.estimatedCost) : 'TBD'}
            </div>
            {workOrder.actualCost && (
              <p className="text-xs text-muted-foreground">
                Actual: {formatCurrency(workOrder.actualCost)}
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
            <div className="text-sm font-bold">{formatDate(workOrder.updatedAt)}</div>
            <p className="text-xs text-muted-foreground">{getRelativeTime(workOrder.updatedAt)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Work Details</TabsTrigger>
          <TabsTrigger value="progress">Progress Updates</TabsTrigger>
          <TabsTrigger value="completion">Completion</TabsTrigger>
          <TabsTrigger value="rating">Rating</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Work Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{workOrder.description}</p>
                </div>

                {workOrder.images && workOrder.images.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Attached Images</h4>
                    <div className="grid gap-2 md:grid-cols-2">
                      {workOrder.images.map((image: string, index: number) => (
                        <div key={index} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <Camera className="w-8 h-8 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Work Requirements</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium">{workOrder.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority:</span>
                      <Badge variant={getPriorityBadgeVariant(workOrder.priority)}>
                        {workOrder.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Duration:</span>
                      <span className="font-medium">2-3 hours</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property & Client Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Property Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">{property?.name}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property?.address}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <p className="font-medium capitalize">{property?.type}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Size:</span>
                        <p className="font-medium">{property?.size} sq ft</p>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                    <Link href={`/dashboard/properties/${property?.id}`}>
                      View Property Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Client Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>PM</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Sarah Johnson</p>
                        <p className="text-sm text-muted-foreground">Property Manager</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <span className="text-muted-foreground w-16">Phone:</span>
                        <span>(555) 123-4567</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground w-16">Email:</span>
                        <span>sarah@propertymanagement.com</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full mt-3">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Contact Client
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progress Updates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Timeline */}
              <div className="space-y-4">
                <h4 className="font-medium">Work Timeline</h4>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                    <div>
                      <p className="text-sm font-medium">Work Order Created</p>
                      <p className="text-xs text-muted-foreground">{formatDate(workOrder.createdAt)}</p>
                    </div>
                  </div>

                  {workOrder.status !== 'pending' && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                      <div>
                        <p className="text-sm font-medium">Assigned to You</p>
                        <p className="text-xs text-muted-foreground">{formatDate(workOrder.updatedAt)}</p>
                      </div>
                    </div>
                  )}

                  {workOrder.status === 'in_progress' && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2" />
                      <div>
                        <p className="text-sm font-medium">Work Started</p>
                        <p className="text-xs text-muted-foreground">In progress</p>
                      </div>
                    </div>
                  )}

                  {workOrder.status === 'completed' && workOrder.completedAt && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                      <div>
                        <p className="text-sm font-medium">Work Completed</p>
                        <p className="text-xs text-muted-foreground">{formatDate(workOrder.completedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Existing Notes */}
              {workOrder.notes && workOrder.notes.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-3">Previous Updates</h4>
                    <div className="space-y-3">
                      {workOrder.notes.map((note: string, index: number) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <p className="text-sm">{note}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(workOrder.updatedAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Add Progress Update */}
              {workOrder.status === 'in_progress' && (
                <>
                  <Separator />
                  <form onSubmit={handleAddProgress} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="progress">Add Progress Update</Label>
                      <Textarea
                        id="progress"
                        value={progressUpdate}
                        onChange={(e) => setProgressUpdate(e.target.value)}
                        placeholder="Describe the current progress, any issues encountered, or next steps..."
                        rows={3}
                      />
                    </div>
                    <Button type="submit" disabled={!progressUpdate.trim()}>
                      <FileText className="mr-2 h-4 w-4" />
                      Add Update
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completion" className="space-y-4">
          {workOrder.status === 'completed' ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Work Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Completed On</span>
                      <p className="font-medium">{formatDate(workOrder.completedAt!)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Final Cost</span>
                      <p className="font-medium text-green-600">
                        {formatCurrency(workOrder.actualCost || workOrder.estimatedCost || 0)}
                      </p>
                    </div>
                  </div>

                  {workOrder.notes && (
                    <div>
                      <span className="text-sm text-muted-foreground">Completion Notes</span>
                      <p className="text-sm mt-1">{workOrder.notes[workOrder.notes.length - 1]}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : workOrder.status === 'in_progress' ? (
            <Card>
              <CardHeader>
                <CardTitle>Mark Work as Complete</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleComplete} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="completionNotes">Completion Notes *</Label>
                    <Textarea
                      id="completionNotes"
                      value={completionNotes}
                      onChange={(e) => setCompletionNotes(e.target.value)}
                      placeholder="Describe the work completed, any parts replaced, recommendations for future maintenance..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="finalCost">Final Cost</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="finalCost"
                        type="number"
                        step="0.01"
                        value={finalCost}
                        onChange={(e) => setFinalCost(e.target.value)}
                        placeholder={workOrder.estimatedCost?.toString() || '0'}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Estimated: {workOrder.estimatedCost ? formatCurrency(workOrder.estimatedCost) : 'Not specified'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Completion Photos</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">Upload before/after photos</p>
                      <Button type="button" variant="outline" size="sm" onClick={handlePhotoUpload}>
                        <Upload className="w-4 h-4 mr-2" />
                        Add Photos
                      </Button>
                    </div>

                    {uploadedPhotos.length > 0 && (
                      <div className="grid gap-2 md:grid-cols-3 mt-3">
                        {uploadedPhotos.map((photo, index) => (
                          <div key={index} className="aspect-square bg-muted rounded flex items-center justify-center">
                            <Camera className="w-6 h-6 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={!completionNotes.trim()}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Complete
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Work Not Started</h3>
                <p className="text-muted-foreground">
                  {workOrder.status === 'assigned'
                    ? 'Accept this work order to start tracking progress'
                    : 'This work order is pending assignment'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rating" className="space-y-4">
          <ServiceRating
            serviceRequestId={workOrder.id}
            providerId={user?.id}
            showRatingForm={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
