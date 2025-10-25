'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getRelativeTime } from '../utils/helpers';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  MessageCircle,
  DollarSign,
  Wrench,
  FileText,
  X
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'payment' | 'maintenance' | 'message' | 'document' | 'system' | 'announcement';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationsFeedProps {
  maxItems?: number;
  showHeader?: boolean;
  userRole?: string;
}

export const NotificationsFeed: React.FC<NotificationsFeedProps> = ({
  maxItems = 5,
  showHeader = true,
  userRole = 'tenant'
}) => {
  // Role-specific notifications
  const getNotificationsByRole = () => {
    if (userRole === 'property_manager') {
      return [
        {
          id: '1',
          type: 'warning' as const,
          category: 'payment' as const,
          title: 'Pending Rent Payment',
          message: 'Lisa Rodriguez - Riverside Condos rent payment is 2 days overdue.',
          timestamp: '2024-10-28T10:30:00Z',
          read: false,
          actionUrl: '/dashboard/financials',
          actionLabel: 'View Details'
        },
        {
          id: '2',
          type: 'info' as const,
          category: 'maintenance' as const,
          title: 'New Service Request',
          message: 'Mike Chen submitted a request for kitchen faucet repair.',
          timestamp: '2024-10-27T14:20:00Z',
          read: false,
          actionUrl: '/dashboard/service-requests',
          actionLabel: 'Review'
        },
        {
          id: '3',
          type: 'success' as const,
          category: 'payment' as const,
          title: 'Payment Received',
          message: 'Mike Chen paid $2,500 for Unit 3B rent.',
          timestamp: '2024-10-26T09:00:00Z',
          read: false,
          actionUrl: '/dashboard/analytics',
          actionLabel: 'View'
        },
        {
          id: '4',
          type: 'warning' as const,
          category: 'maintenance' as const,
          title: 'Multiple Pending Requests',
          message: 'You have 3 service requests awaiting assignment.',
          timestamp: '2024-10-25T16:45:00Z',
          read: true,
          actionUrl: '/dashboard/service-requests',
          actionLabel: 'Assign'
        },
        {
          id: '5',
          type: 'info' as const,
          category: 'document' as const,
          title: 'Lease Renewal Due',
          message: 'Mike Chen lease expires in 3 months - Unit 3B.',
          timestamp: '2024-10-24T11:30:00Z',
          read: true,
          actionUrl: '/dashboard/tenants/2',
          actionLabel: 'Review Lease'
        }
      ];
    } else if (userRole === 'service_provider') {
      return [
        {
          id: '1',
          type: 'info' as const,
          category: 'maintenance' as const,
          title: 'New Work Order Assigned',
          message: 'Kitchen faucet repair at Sunset Apartments - Unit 3B.',
          timestamp: '2024-10-28T10:30:00Z',
          read: false,
          actionUrl: '/dashboard/work-orders',
          actionLabel: 'View Details'
        },
        {
          id: '2',
          type: 'success' as const,
          category: 'payment' as const,
          title: 'Payment Received',
          message: 'Invoice #INV-001 payment of $185 has been processed.',
          timestamp: '2024-10-27T14:20:00Z',
          read: false,
          actionUrl: '/dashboard/invoices',
          actionLabel: 'View'
        },
        {
          id: '3',
          type: 'warning' as const,
          category: 'maintenance' as const,
          title: 'Deadline Approaching',
          message: 'HVAC maintenance due in 2 days - Maple Street House.',
          timestamp: '2024-10-25T09:00:00Z',
          read: true,
          actionUrl: '/dashboard/schedule',
          actionLabel: 'View Schedule'
        },
        {
          id: '4',
          type: 'info' as const,
          category: 'announcement' as const,
          title: 'Schedule Update',
          message: 'New work orders available for bidding this week.',
          timestamp: '2024-10-24T16:45:00Z',
          read: true,
          actionUrl: '/dashboard/work-orders',
          actionLabel: 'View Orders'
        }
      ];
    } else {
      // Tenant notifications
      return [
        {
          id: '1',
          type: 'success' as const,
          category: 'payment' as const,
          title: 'Payment Received',
          message: 'Rent payment of $2,500 has been successfully processed.',
          timestamp: '2024-10-28T10:30:00Z',
          read: false,
          actionUrl: '/dashboard/payments',
          actionLabel: 'View'
        },
        {
          id: '2',
          type: 'info' as const,
          category: 'maintenance' as const,
          title: 'Service Request Update',
          message: 'Kitchen faucet repair has been assigned to ABC Plumbing.',
          timestamp: '2024-10-27T14:20:00Z',
          read: false,
          actionUrl: '/dashboard/service-requests',
          actionLabel: 'View'
        },
        {
          id: '3',
          type: 'warning' as const,
          category: 'payment' as const,
          title: 'Upcoming Payment Due',
          message: 'Rent payment of $2,500 is due in 3 days.',
          timestamp: '2024-10-25T09:00:00Z',
          read: true,
          actionUrl: '/dashboard/payments',
          actionLabel: 'Pay Now'
        },
        {
          id: '4',
          type: 'info' as const,
          category: 'announcement' as const,
          title: 'New Announcement',
          message: 'Scheduled maintenance for building elevator on Nov 1st.',
          timestamp: '2024-10-24T16:45:00Z',
          read: true,
          actionUrl: '/dashboard/property',
          actionLabel: 'Read More'
        },
        {
          id: '5',
          type: 'success' as const,
          category: 'maintenance' as const,
          title: 'Service Request Completed',
          message: 'Kitchen faucet repair has been completed.',
          timestamp: '2024-10-22T11:30:00Z',
          read: true,
          actionUrl: '/dashboard/service-requests',
          actionLabel: 'Rate Service'
        }
      ];
    }
  };

  const [notifications, setNotifications] = useState<Notification[]>(getNotificationsByRole());

  const displayedNotifications = notifications.slice(0, maxItems);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return AlertCircle;
      default: return Info;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment': return DollarSign;
      case 'maintenance': return Wrench;
      case 'message': return MessageCircle;
      case 'document': return FileText;
      case 'announcement': return Bell;
      default: return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-orange-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount} New
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Stay updated with important alerts
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className={showHeader ? '' : 'pt-6'}>
        {displayedNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">No notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedNotifications.map((notification) => {
              const TypeIcon = getTypeIcon(notification.type);
              const CategoryIcon = getCategoryIcon(notification.category);
              const typeColor = getTypeColor(notification.type);

              return (
                <div
                  key={notification.id}
                  className={`flex gap-3 p-3 rounded-lg border ${!notification.read ? 'bg-accent/50 border-primary/20' : 'border-border'
                    }`}
                >
                  <div className={`mt-0.5 ${typeColor}`}>
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{notification.title}</p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <CategoryIcon className="w-3 h-3" />
                            {notification.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {getRelativeTime(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => dismissNotification(notification.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    {notification.actionUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        asChild
                      >
                        <Link href={notification.actionUrl}>
                          {notification.actionLabel || 'View'}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

