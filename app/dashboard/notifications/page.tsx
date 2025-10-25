'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate, getRelativeTime } from '../../utils/helpers';
import {
  Bell,
  BellOff,
  CheckCircle,
  AlertCircle,
  Info,
  MessageCircle,
  DollarSign,
  Wrench,
  FileText,
  Calendar,
  Trash2,
  Check,
  Settings
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'payment' | 'maintenance' | 'message' | 'document' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      category: 'payment',
      title: 'Payment Received',
      message: 'Your rent payment of $2,500 has been successfully processed.',
      timestamp: '2024-10-28T10:30:00Z',
      read: false,
      actionUrl: '/dashboard/payments',
      actionLabel: 'View Payment'
    },
    {
      id: '2',
      type: 'info',
      category: 'maintenance',
      title: 'Service Request Update',
      message: 'Your kitchen faucet repair request has been assigned to ABC Plumbing Services.',
      timestamp: '2024-10-27T14:20:00Z',
      read: false,
      actionUrl: '/dashboard/service-requests/SR-001',
      actionLabel: 'View Request'
    },
    {
      id: '3',
      type: 'warning',
      category: 'payment',
      title: 'Upcoming Payment Due',
      message: 'Your rent payment of $2,500 is due in 3 days on November 1, 2024.',
      timestamp: '2024-10-25T09:00:00Z',
      read: true,
      actionUrl: '/dashboard/payments',
      actionLabel: 'Pay Now'
    },
    {
      id: '4',
      type: 'info',
      category: 'message',
      title: 'New Message',
      message: 'Sarah Johnson sent you a message regarding your lease renewal.',
      timestamp: '2024-10-24T16:45:00Z',
      read: true,
      actionUrl: '/dashboard/messages',
      actionLabel: 'Read Message'
    },
    {
      id: '5',
      type: 'success',
      category: 'maintenance',
      title: 'Service Request Completed',
      message: 'Your kitchen faucet repair has been completed. Please rate the service.',
      timestamp: '2024-10-22T11:30:00Z',
      read: true,
      actionUrl: '/dashboard/service-requests/SR-001',
      actionLabel: 'Rate Service'
    },
    {
      id: '6',
      type: 'info',
      category: 'document',
      title: 'New Document Available',
      message: 'Your October rent receipt has been uploaded to your documents.',
      timestamp: '2024-10-21T08:15:00Z',
      read: true,
      actionUrl: '/dashboard/documents',
      actionLabel: 'View Document'
    }
  ]);

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (category: string) => {
    switch (category) {
      case 'payment': return DollarSign;
      case 'maintenance': return Wrench;
      case 'message': return MessageCircle;
      case 'document': return FileText;
      case 'system': return Settings;
      default: return Info;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return AlertCircle;
      default: return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-orange-600 bg-orange-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filterByCategory = (category: string) => {
    if (category === 'all') return notifications;
    return notifications.filter(n => n.category === category);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="w-8 h-8" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} New
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Stay updated with important alerts and messages
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">
              All notifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <BellOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">
              Needs attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter(n => n.category === 'payment').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Payment related
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter(n => n.category === 'maintenance').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Service requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="payment">
            Payments
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="message">
            Messages
          </TabsTrigger>
        </TabsList>

        {/* All Notifications */}
        <TabsContent value="all" className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  You're all caught up! Check back later for updates.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => {
                const CategoryIcon = getNotificationIcon(notification.category);
                const TypeIcon = getTypeIcon(notification.type);
                return (
                  <Card key={notification.id} className={`${!notification.read ? 'border-l-4 border-l-primary' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                          <TypeIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{notification.title}</h4>
                                {!notification.read && (
                                  <Badge variant="secondary" className="text-xs">New</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <CategoryIcon className="w-3 h-3" />
                                {notification.category}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {getRelativeTime(notification.timestamp)}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Mark Read
                                </Button>
                              )}
                              {notification.actionUrl && (
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={notification.actionUrl}>
                                    {notification.actionLabel}
                                  </Link>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Unread Notifications */}
        <TabsContent value="unread" className="space-y-2">
          {filterByCategory('all').filter(n => !n.read).map((notification) => {
            const CategoryIcon = getNotificationIcon(notification.category);
            const TypeIcon = getTypeIcon(notification.type);
            return (
              <Card key={notification.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{notification.title}</h4>
                            <Badge variant="secondary" className="text-xs">New</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CategoryIcon className="w-3 h-3" />
                            {notification.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {getRelativeTime(notification.timestamp)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Mark Read
                          </Button>
                          {notification.actionUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <Link href={notification.actionUrl}>
                                {notification.actionLabel}
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Category-specific tabs */}
        {['payment', 'maintenance', 'message'].map((category) => (
          <TabsContent key={category} value={category} className="space-y-2">
            {filterByCategory(category).map((notification) => {
              const CategoryIcon = getNotificationIcon(notification.category);
              const TypeIcon = getTypeIcon(notification.type);
              return (
                <Card key={notification.id} className={`${!notification.read ? 'border-l-4 border-l-primary' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{notification.title}</h4>
                              {!notification.read && (
                                <Badge variant="secondary" className="text-xs">New</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CategoryIcon className="w-3 h-3" />
                              {notification.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {getRelativeTime(notification.timestamp)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Mark Read
                              </Button>
                            )}
                            {notification.actionUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <Link href={notification.actionUrl}>
                                  {notification.actionLabel}
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

