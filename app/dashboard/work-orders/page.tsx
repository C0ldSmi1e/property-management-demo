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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { formatCurrency, getRelativeTime } from '../../utils/helpers';
import { ServiceRequest } from '../../types';
import {
  Wrench,
  Search,
  MoreHorizontal,
  Eye,
  Check,
  X,
  Clock,
  CheckCircle,
  AlertTriangle,
  Upload,
  MessageCircle
} from 'lucide-react';

export default function WorkOrdersPage() {
  const { userData } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [updateForm, setUpdateForm] = useState({
    status: '',
    notes: '',
    cost: ''
  });

  if (!userData) return null;

  const { workOrders, properties } = userData;

  // Filter work orders
  const filteredOrders = workOrders.filter((order: ServiceRequest) => {
    const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'assigned': return 'outline';
      default: return 'destructive';
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
      default: return AlertTriangle;
    }
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find((p: any) => p.id === propertyId);
    return property?.name || 'Unknown Property';
  };

  const handleStatusUpdate = (request: ServiceRequest, newStatus: string) => {
    console.log(`Updating request ${request.id} to status: ${newStatus}`);
    setSelectedRequest(null);
    setUpdateForm({ status: '', notes: '', cost: '' });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRequest) {
      handleStatusUpdate(selectedRequest, updateForm.status);
    }
  };

  // Stats
  const assignedCount = workOrders.filter((w: ServiceRequest) => w.status === 'assigned').length;
  const inProgressCount = workOrders.filter((w: ServiceRequest) => w.status === 'in_progress').length;
  const completedCount = workOrders.filter((w: ServiceRequest) => w.status === 'completed').length;
  const emergencyCount = workOrders.filter((w: ServiceRequest) => w.priority === 'emergency').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work Orders</h1>
          <p className="text-muted-foreground">
            Manage your assigned maintenance tasks and service requests
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{assignedCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting acceptance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{emergencyCount}</div>
            <p className="text-xs text-muted-foreground">High priority</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search work orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'assigned', 'in_progress', 'completed'].map((status) => (
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

      {/* Work Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredOrders.length} Work Order{filteredOrders.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Work Order</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Estimated Cost</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order: ServiceRequest) => {
                  const StatusIcon = getStatusIcon(order.status);

                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" />
                          <div>
                            <p className="font-medium">{order.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {order.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{getPropertyName(order.propertyId)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadgeVariant(order.priority)}>
                          {order.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.estimatedCost ? formatCurrency(order.estimatedCost) : 'TBD'}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {getRelativeTime(order.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRequest(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {order.status === 'assigned' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(order, 'in_progress')}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          {order.status === 'in_progress' && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(order);
                                setUpdateForm({ ...updateForm, status: 'completed' });
                              }}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No work orders found</h3>
              <p className="mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No work orders have been assigned to you yet'
                }
              </p>
            </div>
          )}
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
                <h5 className="font-medium text-sm mb-2">Property</h5>
                <p className="text-sm">{getPropertyName(selectedRequest.propertyId)}</p>
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

              {updateForm.status === 'completed' && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <h5 className="font-medium">Complete Work Order</h5>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Completion Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Describe the work completed..."
                      value={updateForm.notes}
                      onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cost">Final Cost</Label>
                    <Input
                      id="cost"
                      type="number"
                      placeholder="Enter final cost"
                      value={updateForm.cost}
                      onChange={(e) => setUpdateForm({ ...updateForm, cost: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Completion Photos</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Upload before/after photos</p>
                      <Button variant="outline" size="sm" type="button" className="mt-2">
                        Choose Photos
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              {selectedRequest.status === 'assigned' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleStatusUpdate(selectedRequest, 'pending')}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Decline
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(selectedRequest, 'in_progress')}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Accept Job
                  </Button>
                </>
              )}

              {selectedRequest.status === 'in_progress' && (
                <Button
                  onClick={() => setUpdateForm({ ...updateForm, status: 'completed' })}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              )}

              {updateForm.status === 'completed' && (
                <form onSubmit={handleUpdateSubmit} className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setUpdateForm({ status: '', notes: '', cost: '' })}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Submit Completion
                  </Button>
                </form>
              )}

              {updateForm.status !== 'completed' && (
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
