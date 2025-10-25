'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatDate } from '../../utils/helpers';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Filter,
  Search
} from 'lucide-react';

export default function FinancialsPage() {
  const { userData } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  if (!userData) return null;

  const { properties } = userData;

  // Mock financial data
  const mockRentPayments = [
    {
      id: 'RENT-001',
      tenantName: 'Mike Chen',
      tenantId: '2',
      propertyName: 'Sunset Apartments - Unit 3B',
      propertyId: '1',
      amount: 2500,
      dueDate: '2024-11-01',
      paidDate: '2024-10-28',
      status: 'paid',
      method: 'Bank Transfer'
    },
    {
      id: 'RENT-002',
      tenantName: 'Lisa Rodriguez',
      tenantId: '4',
      propertyName: 'Riverside Condos - Unit 12A',
      propertyId: '2',
      amount: 1800,
      dueDate: '2024-11-01',
      paidDate: null,
      status: 'pending',
      method: null
    },
    {
      id: 'RENT-003',
      tenantName: 'Mike Chen',
      tenantId: '2',
      propertyName: 'Sunset Apartments - Unit 3B',
      propertyId: '1',
      amount: 2500,
      dueDate: '2024-10-01',
      paidDate: '2024-10-01',
      status: 'paid',
      method: 'Credit Card'
    },
    {
      id: 'RENT-004',
      tenantName: 'Lisa Rodriguez',
      tenantId: '4',
      propertyName: 'Riverside Condos - Unit 12A',
      propertyId: '2',
      amount: 1800,
      dueDate: '2024-10-01',
      paidDate: '2024-10-02',
      status: 'paid',
      method: 'Bank Transfer'
    }
  ];

  const mockExpenses = [
    {
      id: 'EXP-001',
      category: 'Maintenance',
      description: 'Kitchen faucet repair',
      propertyName: 'Sunset Apartments - Unit 3B',
      amount: 150,
      date: '2024-10-21',
      vendor: 'ABC Plumbing Services'
    },
    {
      id: 'EXP-002',
      category: 'Utilities',
      description: 'Electricity bill - Common areas',
      propertyName: 'Sunset Apartments',
      amount: 180,
      date: '2024-10-15',
      vendor: 'City Electric Company'
    },
    {
      id: 'EXP-003',
      category: 'Insurance',
      description: 'Property insurance premium',
      propertyName: 'All Properties',
      amount: 450,
      date: '2024-10-01',
      vendor: 'SafeGuard Insurance'
    }
  ];

  // Calculate stats
  const totalRentCollected = mockRentPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = mockRentPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netIncome = totalRentCollected - totalExpenses;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'overdue': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const filteredPayments = mockRentPayments.filter(payment => {
    const matchesSearch = payment.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financials</h1>
          <p className="text-muted-foreground">
            Track rent payments, expenses, and financial performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button asChild>
            <Link href="/dashboard/analytics">
              View Analytics
            </Link>
          </Button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rent Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRentCollected)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalPending)}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Tabs */}
      <Tabs defaultValue="rent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rent">Rent Payments</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="summary">Monthly Summary</TabsTrigger>
        </TabsList>

        {/* Rent Payments Tab */}
        <TabsContent value="rent" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Rent Payments</CardTitle>
                  <CardDescription>
                    Track and manage rent payments from tenants
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <select
                    className="p-2 border rounded-md"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPayments.map((payment) => {
                  const StatusIcon = getStatusIcon(payment.status);
                  return (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${payment.status === 'paid' ? 'bg-green-100' :
                          payment.status === 'pending' ? 'bg-orange-100' : 'bg-red-100'
                          }`}>
                          <StatusIcon className={`w-5 h-5 ${payment.status === 'paid' ? 'text-green-600' :
                            payment.status === 'pending' ? 'text-orange-600' : 'text-red-600'
                            }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/dashboard/tenants/${payment.tenantId}`}
                              className="font-medium hover:underline"
                            >
                              {payment.tenantName}
                            </Link>
                            <Badge variant={getStatusVariant(payment.status)}>
                              {payment.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {payment.propertyName}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Due: {formatDate(payment.dueDate)}
                            {payment.paidDate && ` • Paid: ${formatDate(payment.paidDate)}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold">{formatCurrency(payment.amount)}</p>
                          <p className="text-xs text-muted-foreground">{payment.id}</p>
                        </div>
                        {payment.status === 'pending' && (
                          <Button variant="outline" size="sm">
                            Send Reminder
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Expenses</CardTitle>
                  <CardDescription>
                    Track property-related expenses and costs
                  </CardDescription>
                </div>
                <Button>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-red-100 rounded-full">
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{expense.description}</p>
                          <Badge variant="outline">{expense.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {expense.propertyName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {expense.vendor} • {formatDate(expense.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">-{formatCurrency(expense.amount)}</p>
                      <p className="text-xs text-muted-foreground">{expense.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Financial Summary</CardTitle>
              <CardDescription>
                Overview of income and expenses for October 2024
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Income</span>
                    <span className="text-sm font-medium text-green-600">{formatCurrency(totalRentCollected)}</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Expenses</span>
                    <span className="text-sm font-medium text-red-600">-{formatCurrency(totalExpenses)}</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600"
                      style={{ width: `${(totalExpenses / totalRentCollected) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Breakdown by Property</h4>
                {properties.slice(0, 3).map((property: any) => (
                  <div key={property.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{property.name}</p>
                      <p className="text-sm text-muted-foreground">{property.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{formatCurrency(property.rentAmount)}</p>
                      <p className="text-xs text-muted-foreground">Monthly rent</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Net Income</p>
                    <p className="text-2xl font-bold">{formatCurrency(netIncome)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Profit Margin</p>
                    <p className="text-2xl font-bold">
                      {Math.round(((netIncome / totalRentCollected) * 100))}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

