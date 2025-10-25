'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { formatCurrency, formatDate } from '../../utils/helpers';
import {
  Users,
  Search,
  MoreHorizontal,
  Eye,
  MessageCircle,
  Building,
  Phone,
  Mail,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function TenantsPage() {
  const { userData } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  if (!userData) return null;

  const { tenants, properties } = userData;

  // Filter tenants based on search
  const filteredTenants = tenants.filter((tenant: any) => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getTenantProperty = (tenantId: string) => {
    return properties.find((p: any) => p.tenantId === tenantId);
  };

  const getLeaseStatus = (leaseEndDate: string) => {
    const endDate = new Date(leaseEndDate);
    const now = new Date();
    const monthsLeft = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));

    if (monthsLeft < 0) return { status: 'expired', variant: 'destructive' as const };
    if (monthsLeft <= 2) return { status: 'expiring soon', variant: 'secondary' as const };
    return { status: 'active', variant: 'default' as const };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
          <p className="text-muted-foreground">
            Manage your tenant relationships and lease agreements
          </p>
        </div>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          Add Tenant
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{tenants.length}</div>
            <p className="text-xs text-muted-foreground">
              Active leases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(tenants.reduce((sum: number, t: any) => sum + (t.rentAmount || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              From active leases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {tenants.filter((t: any) => getLeaseStatus(t.leaseEndDate).status === 'expiring soon').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Leases ending within 2 months
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rent</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(tenants.reduce((sum: number, t: any) => sum + (t.rentAmount || 0), 0) / tenants.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per unit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tenants by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tenants Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTenants.map((tenant: any) => {
          const property = getTenantProperty(tenant.id);
          const leaseStatus = getLeaseStatus(tenant.leaseEndDate);

          return (
            <Card key={tenant.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={tenant.avatar} />
                      <AvatarFallback>{tenant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{tenant.name}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="w-4 h-4 mr-1" />
                        {tenant.email}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/tenants/${tenant.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={leaseStatus.variant}>
                    {leaseStatus.status}
                  </Badge>
                  <div className="text-lg font-semibold text-green-600">
                    {formatCurrency(tenant.rentAmount)}/mo
                  </div>
                </div>

                {property && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Property</p>
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">{property.name}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Lease Start</p>
                    <p className="font-medium">{formatDate(tenant.leaseStartDate)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Lease End</p>
                    <p className="font-medium">{formatDate(tenant.leaseEndDate)}</p>
                  </div>
                </div>

                {tenant.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-1 text-muted-foreground" />
                    {tenant.phone}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/dashboard/tenants/${tenant.id}`}>
                      <Eye className="w-4 h-4 mr-1" />
                      View Profile
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTenants.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No tenants found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first tenant'
              }
            </p>
            {!searchTerm && (
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Add Your First Tenant
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
