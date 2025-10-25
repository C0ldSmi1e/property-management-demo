'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatDate } from '../../utils/helpers';
import {
  DollarSign,
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Receipt,
  TrendingUp,
  Building
} from 'lucide-react';

export default function PaymentsPage() {
  const { user, userData } = useAuth();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');

  if (!userData || !user) return null;

  // Mock payment history based on user role
  const mockPaymentHistory = user.role === 'tenant' ? [
    {
      id: 'PAY-001',
      date: '2024-10-01',
      amount: 2500,
      type: 'Rent Payment',
      status: 'completed',
      method: 'Bank Transfer',
      propertyName: 'Sunset Apartments - Unit 3B',
      receiptUrl: '#'
    },
    {
      id: 'PAY-002',
      date: '2024-09-01',
      amount: 2500,
      type: 'Rent Payment',
      status: 'completed',
      method: 'Credit Card',
      propertyName: 'Sunset Apartments - Unit 3B',
      receiptUrl: '#'
    },
    {
      id: 'PAY-003',
      date: '2024-08-01',
      amount: 2500,
      type: 'Rent Payment',
      status: 'completed',
      method: 'Bank Transfer',
      propertyName: 'Sunset Apartments - Unit 3B',
      receiptUrl: '#'
    },
    {
      id: 'PAY-004',
      date: '2024-07-01',
      amount: 2500,
      type: 'Rent Payment',
      status: 'completed',
      method: 'Bank Transfer',
      propertyName: 'Sunset Apartments - Unit 3B',
      receiptUrl: '#'
    }
  ] : [];

  const nextPaymentDue = user.role === 'tenant' ? {
    date: '2024-11-01',
    amount: 2500,
    propertyName: 'Sunset Apartments - Unit 3B',
    daysUntilDue: 7
  } : null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'pending': return Clock;
      case 'failed': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Processing payment:', { amount: paymentAmount, method: paymentMethod });
    alert('Payment submitted successfully! (Demo)');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Manage your rent payments and view payment history
        </p>
      </div>

      {/* Next Payment Due Card */}
      {nextPaymentDue && (
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  Next Payment Due
                </CardTitle>
                <CardDescription>
                  Due in {nextPaymentDue.daysUntilDue} days
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {formatCurrency(nextPaymentDue.amount)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Property</p>
                <p className="font-medium">{nextPaymentDue.propertyName}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">{formatDate(nextPaymentDue.date)}</p>
              </div>
            </div>
            <Button className="w-full" size="lg">
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Payment Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(10000)}</div>
            <p className="text-xs text-muted-foreground">
              Last 12 months
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Payments</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">
              Perfect payment record
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Payment</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(2500)}</div>
            <p className="text-xs text-muted-foreground">
              Monthly average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Tabs */}
      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="make-payment">Make Payment</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>

        {/* Payment History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                View all your past rent payments and download receipts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPaymentHistory.map((payment) => {
                  const StatusIcon = getStatusIcon(payment.status);
                  return (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${payment.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                          <StatusIcon className={`w-5 h-5 ${payment.status === 'completed' ? 'text-green-600' : 'text-gray-600'
                            }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{payment.type}</p>
                            <Badge variant={getStatusVariant(payment.status)}>
                              {payment.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(payment.date)} • {payment.method}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {payment.propertyName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold">{formatCurrency(payment.amount)}</p>
                          <p className="text-xs text-muted-foreground">{payment.id}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Receipt
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Make Payment Tab */}
        <TabsContent value="make-payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Make a Payment</CardTitle>
              <CardDescription>
                Submit your rent payment securely online
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Payment Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="2500.00"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <select
                    id="payment-method"
                    className="w-full p-2 border rounded-md"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="ach">ACH Transfer</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-date">Payment Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="payment-date"
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Separator />

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Payment Amount</span>
                    <span className="font-medium">{paymentAmount ? formatCurrency(parseFloat(paymentAmount)) : '$0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Processing Fee</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="text-lg font-bold">{paymentAmount ? formatCurrency(parseFloat(paymentAmount)) : '$0.00'}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Receipt className="w-4 h-4 mr-2" />
                  Submit Payment
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Payment Methods</CardTitle>
              <CardDescription>
                Manage your saved payment methods for faster checkout
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mock saved payment methods */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Bank of America ****1234</p>
                    <p className="text-sm text-muted-foreground">Checking Account</p>
                  </div>
                </div>
                <Badge>Default</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-100 rounded">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Visa ****5678</p>
                    <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>

              <Button variant="outline" className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

