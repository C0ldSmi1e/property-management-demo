'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { formatDate, getRelativeTime } from '../utils/helpers';
import {
  Megaphone,
  Plus,
  Pin,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  Users,
  Building,
  Search
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'maintenance' | 'emergency' | 'event' | 'policy';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: 'all' | 'tenants' | 'property_managers' | 'service_providers';
  propertyIds?: string[];
  isPinned: boolean;
  authorId: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
  expiresAt?: string;
  isRead?: boolean;
}

interface AnnouncementsBoardProps {
  userRole: string;
  propertyId?: string;
  canCreate?: boolean;
}

export const AnnouncementsBoard: React.FC<AnnouncementsBoardProps> = ({
  userRole,
  propertyId,
  canCreate = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    type: 'general',
    priority: 'medium',
    targetAudience: 'all',
    isPinned: false,
    expiresAt: ''
  });

  // Mock announcements
  const mockAnnouncements: Announcement[] = [
    {
      id: '1',
      title: 'Scheduled Maintenance - Pool Area',
      content: 'The swimming pool and deck area will be undergoing routine maintenance on November 1st, 2024, from 8:00 AM to 4:00 PM. The pool will be temporarily closed during this time. We apologize for any inconvenience.',
      type: 'maintenance',
      priority: 'medium',
      targetAudience: 'tenants',
      propertyIds: ['1'],
      isPinned: true,
      authorId: '1',
      authorName: 'Sarah Johnson',
      authorRole: 'Property Manager',
      createdAt: '2024-10-20T09:00:00Z',
      expiresAt: '2024-11-02T09:00:00Z'
    },
    {
      id: '2',
      title: 'New Recycling Guidelines',
      content: 'Starting November 1st, we are implementing new recycling guidelines to help reduce waste. Please separate recyclables into the designated bins located in the trash room. Thank you for your cooperation!',
      type: 'policy',
      priority: 'low',
      targetAudience: 'tenants',
      isPinned: false,
      authorId: '1',
      authorName: 'Sarah Johnson',
      authorRole: 'Property Manager',
      createdAt: '2024-10-18T14:30:00Z',
      expiresAt: '2024-12-01T14:30:00Z'
    },
    {
      id: '3',
      title: 'Holiday Office Hours',
      content: 'Please note that the property management office will have modified hours during the upcoming holiday season. We will be closed on November 28-29 for Thanksgiving. Emergency maintenance requests can still be submitted online.',
      type: 'general',
      priority: 'medium',
      targetAudience: 'all',
      isPinned: true,
      authorId: '1',
      authorName: 'Sarah Johnson',
      authorRole: 'Property Manager',
      createdAt: '2024-10-22T10:15:00Z',
      expiresAt: '2024-11-30T10:15:00Z'
    },
    {
      id: '4',
      title: 'Community Event - Resident Mixer',
      content: 'Join us for a resident mixer in the community room on November 15th at 6:00 PM. Light refreshments will be provided. This is a great opportunity to meet your neighbors and provide feedback about the community.',
      type: 'event',
      priority: 'low',
      targetAudience: 'tenants',
      isPinned: false,
      authorId: '1',
      authorName: 'Sarah Johnson',
      authorRole: 'Property Manager',
      createdAt: '2024-10-19T16:45:00Z',
      expiresAt: '2024-11-16T16:45:00Z'
    },
    {
      id: '5',
      title: 'Water Shut-off Notice',
      content: 'URGENT: Water service will be temporarily interrupted tomorrow (October 26th) from 10:00 AM to 2:00 PM for emergency pipe repairs. Please plan accordingly and store water if needed.',
      type: 'emergency',
      priority: 'urgent',
      targetAudience: 'tenants',
      propertyIds: ['1'],
      isPinned: true,
      authorId: '1',
      authorName: 'Sarah Johnson',
      authorRole: 'Property Manager',
      createdAt: '2024-10-25T07:00:00Z'
    }
  ];

  // Filter announcements
  const filteredAnnouncements = mockAnnouncements.filter((announcement) => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || announcement.type === typeFilter;
    const matchesAudience = announcement.targetAudience === 'all' ||
      announcement.targetAudience === userRole ||
      userRole === 'property_manager';
    const matchesProperty = !propertyId ||
      !announcement.propertyIds ||
      announcement.propertyIds.includes(propertyId);

    return matchesSearch && matchesType && matchesAudience && matchesProperty;
  });

  // Sort by pinned first, then by date
  const sortedAnnouncements = filteredAnnouncements.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return AlertTriangle;
      case 'maintenance': return Building;
      case 'event': return Calendar;
      case 'policy': return Info;
      default: return Megaphone;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'event': return 'bg-blue-100 text-blue-800';
      case 'policy': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating announcement:', announcementForm);
    setIsCreateDialogOpen(false);
    setAnnouncementForm({
      title: '',
      content: '',
      type: 'general',
      priority: 'medium',
      targetAudience: 'all',
      isPinned: false,
      expiresAt: ''
    });
  };

  const announcementTypes = [
    { value: 'general', label: 'General' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'event', label: 'Event' },
    { value: 'policy', label: 'Policy' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            Announcements
          </h3>
          <p className="text-sm text-muted-foreground">
            {sortedAnnouncements.length} announcement{sortedAnnouncements.length !== 1 ? 's' : ''}
          </p>
        </div>
        {canCreate && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Announcement</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                    placeholder="Enter announcement title"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={announcementForm.type}
                      onValueChange={(value) => setAnnouncementForm({ ...announcementForm, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {announcementTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={announcementForm.priority}
                      onValueChange={(value) => setAnnouncementForm({ ...announcementForm, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                    placeholder="Enter announcement content..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Select
                    value={announcementForm.targetAudience}
                    onValueChange={(value) => setAnnouncementForm({ ...announcementForm, targetAudience: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="tenants">Tenants Only</SelectItem>
                      <SelectItem value="service_providers">Service Providers Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="pinned"
                    checked={announcementForm.isPinned}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, isPinned: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="pinned" className="text-sm">Pin to top</Label>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Announcement
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'general', 'maintenance', 'emergency', 'event', 'policy'].map((type) => (
            <Button
              key={type}
              variant={typeFilter === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter(type)}
              className="capitalize"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      {sortedAnnouncements.length > 0 ? (
        <div className="space-y-4">
          {sortedAnnouncements.map((announcement) => {
            const TypeIcon = getTypeIcon(announcement.type);
            const isExpired = announcement.expiresAt && new Date(announcement.expiresAt) < new Date();

            return (
              <Card key={announcement.id} className={`${isExpired ? 'opacity-60' : ''} ${announcement.isPinned ? 'border-primary' : ''}`}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {announcement.isPinned && (
                          <Pin className="w-4 h-4 text-primary mt-1" />
                        )}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="w-4 h-4" />
                            <h4 className="font-medium">{announcement.title}</h4>
                            {isExpired && (
                              <Badge variant="outline" className="text-xs">
                                Expired
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getTypeColor(announcement.type)}>
                              {announcement.type}
                            </Badge>
                            <Badge className={getPriorityColor(announcement.priority)}>
                              {announcement.priority}
                            </Badge>
                            <Badge variant="outline">
                              <Users className="w-3 h-3 mr-1" />
                              {announcement.targetAudience === 'all' ? 'Everyone' : announcement.targetAudience.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {getRelativeTime(announcement.createdAt)}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Avatar className="h-4 w-4">
                            <AvatarFallback className="text-xs">{announcement.authorName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            {announcement.authorName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pl-7">
                      <p className="text-sm">{announcement.content}</p>

                      {announcement.expiresAt && !isExpired && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          Expires: {formatDate(announcement.expiresAt)}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {userRole === 'property_manager' && (
                      <div className="flex gap-2 pt-2 border-t">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Delete
                        </Button>
                        {!announcement.isPinned && (
                          <Button variant="outline" size="sm">
                            <Pin className="w-4 h-4 mr-1" />
                            Pin
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Megaphone className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No announcements found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || typeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No announcements have been posted yet'
              }
            </p>
            {canCreate && (!searchTerm && typeFilter === 'all') && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Announcement
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      {sortedAnnouncements.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {sortedAnnouncements.filter(a => a.isPinned).length}
                </div>
                <p className="text-xs text-muted-foreground">Pinned</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {sortedAnnouncements.filter(a => a.priority === 'urgent').length}
                </div>
                <p className="text-xs text-muted-foreground">Urgent</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {sortedAnnouncements.filter(a => a.type === 'maintenance').length}
                </div>
                <p className="text-xs text-muted-foreground">Maintenance</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {sortedAnnouncements.filter(a => !a.expiresAt || new Date(a.expiresAt) > new Date()).length}
                </div>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
