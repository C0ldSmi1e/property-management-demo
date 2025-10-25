'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import {
  Receipt,
  Download,
  Send,
  Edit,
  ArrowLeft,
  Calendar,
  DollarSign,
  Building,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Printer,
  Mail
} from 'lucide-react';

interface InvoiceDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { userData } = useAuth();
  const resolvedParams = React.use(params);
  const [isEditing, setIsEditing] = useState(false);
  const [paymentNotes, setPaymentNotes] = useState('');

  if (!userData) return null;

  // Mock invoice data based on ID
  const mockInvoice = {
    id: resolvedParams.id,
    workOrderId: 'WO-001',
    title: 'Kitchen Faucet Repair',
    description: 'Repair of leaking kitchen faucet including replacement of worn gaskets and valve assembly',
    amount: 185.00,
    taxAmount: 14.80,
    totalAmount: 199.80,
    status: resolvedParams.id === 'INV-001' ? 'paid' : resolvedParams.id === 'INV-002' ? 'pending' : 'overdue',
    issueDate: '2024-10-21T16:30:00Z',
    dueDate: '2024-11-20T16:30:00Z',
    paidDate: resolvedParams.id === 'INV-001' ? '2024-10-25T14:20:00Z' : undefined,
    propertyId: '1',
    propertyName: 'Sunset Apartments - Unit 3B',
    propertyAddress: '123 Sunset Boulevard, Los Angeles, CA 90028',
    clientName: 'Johnson Property Management',
    clientEmail: 'sarah@propertymanagement.com',
    clientAddress: '456 Business Ave, Los Angeles, CA 90013',
    serviceProvider: {
      name: 'ABC Plumbing Services',
      address: '789 Service St, Los Angeles, CA 90015',
      phone: '(555) 345-6789',
      email: 'contact@abcplumbing.com',
      license: 'CA-PLB-12345'
    },
    lineItems: [
      {
        description: 'Kitchen faucet repair - labor',
        quantity: 2,
        rate: 75.00,
        amount: 150.00
      },
      {
        description: 'Replacement gasket kit',
        quantity: 1,
        rate: 25.00,
        amount: 25.00
      },
      {
        description: 'Emergency call-out fee',
        quantity: 1,
        rate: 10.00,
        amount: 10.00
      }
    ],
    notes: 'Work completed successfully. Faucet tested and confirmed leak-free. Recommended annual maintenance check.',
    paymentTerms: 'Net 30 days',
    paymentMethod: resolvedParams.id === 'INV-001' ? 'Bank Transfer' : undefined
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'overdue': return AlertCircle;
      default: return Receipt;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'overdue': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const handleMarkAsPaid = () => {
    console.log('Marking invoice as paid:', resolvedParams.id);
  };

  const handleSendReminder = () => {
    console.log('Sending payment reminder for invoice:', resolvedParams.id);
  };

  const StatusIcon = getStatusIcon(mockInvoice.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard/invoices" className="hover:text-foreground flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Invoices
            </Link>
            <span>/</span>
            <span>{resolvedParams.id}</span>
          </div>
          <div className="flex items-center gap-3">
            <StatusIcon className={`w-6 h-6 ${getStatusColor(mockInvoice.status)}`} />
            <h1 className="text-3xl font-bold tracking-tight">Invoice {mockInvoice.id}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusBadgeVariant(mockInvoice.status)}>
              {mockInvoice.status}
            </Badge>
            <Badge variant="outline">{mockInvoice.workOrderId}</Badge>
            <Badge variant="secondary">{formatCurrency(mockInvoice.totalAmount)}</Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          {mockInvoice.status !== 'paid' && (
            <>
              <Button variant="outline" onClick={handleSendReminder}>
                <Mail className="mr-2 h-4 w-4" />
                Send Reminder
              </Button>
              <Button onClick={handleMarkAsPaid}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Paid
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Invoice Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(mockInvoice.totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Including tax: {formatCurrency(mockInvoice.taxAmount)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issue Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{formatDate(mockInvoice.issueDate)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{formatDate(mockInvoice.dueDate)}</div>
            {new Date(mockInvoice.dueDate) < new Date() && mockInvoice.status !== 'paid' && (
              <p className="text-xs text-red-600">Overdue</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <StatusIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={getStatusBadgeVariant(mockInvoice.status)} className="text-sm">
              {mockInvoice.status}
            </Badge>
            {mockInvoice.paidDate && (
              <p className="text-xs text-muted-foreground mt-1">
                Paid: {formatDate(mockInvoice.paidDate)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Invoice Details */}
      <Tabs defaultValue="invoice" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="payment">Payment Details</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="invoice" className="space-y-4">
          <Card>
            <CardContent className="p-8">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold">INVOICE</h2>
                  <p className="text-lg">{mockInvoice.id}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-bold">{mockInvoice.serviceProvider.name}</h3>
                  <p className="text-sm text-muted-foreground">{mockInvoice.serviceProvider.address}</p>
                  <p className="text-sm text-muted-foreground">{mockInvoice.serviceProvider.phone}</p>
                  <p className="text-sm text-muted-foreground">License: {mockInvoice.serviceProvider.license}</p>
                </div>
              </div>

              {/* Bill To */}
              <div className="grid gap-8 md:grid-cols-2 mb-8">
                <div>
                  <h4 className="font-medium mb-2">Bill To:</h4>
                  <p className="font-medium">{mockInvoice.clientName}</p>
                  <p className="text-sm text-muted-foreground">{mockInvoice.clientAddress}</p>
                  <p className="text-sm text-muted-foreground">{mockInvoice.clientEmail}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Service Location:</h4>
                  <p className="font-medium">{mockInvoice.propertyName}</p>
                  <p className="text-sm text-muted-foreground">{mockInvoice.propertyAddress}</p>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="grid gap-4 md:grid-cols-3 mb-8">
                <div>
                  <span className="text-sm text-muted-foreground">Invoice Date</span>
                  <p className="font-medium">{formatDate(mockInvoice.issueDate)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Due Date</span>
                  <p className="font-medium">{formatDate(mockInvoice.dueDate)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Work Order</span>
                  <p className="font-medium">{mockInvoice.workOrderId}</p>
                </div>
              </div>

              {/* Line Items */}
              <div className="mb-8">
                <h4 className="font-medium mb-4">Services Provided</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3 font-medium">Description</th>
                        <th className="text-right p-3 font-medium">Qty</th>
                        <th className="text-right p-3 font-medium">Rate</th>
                        <th className="text-right p-3 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockInvoice.lineItems.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-3">{item.description}</td>
                          <td className="p-3 text-right">{item.quantity}</td>
                          <td className="p-3 text-right">{formatCurrency(item.rate)}</td>
                          <td className="p-3 text-right font-medium">{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(mockInvoice.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>{formatCurrency(mockInvoice.taxAmount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(mockInvoice.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {mockInvoice.notes && (
                <div className="mt-8 pt-6 border-t">
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">{mockInvoice.notes}</p>
                </div>
              )}

              {/* Payment Terms */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-2">Payment Terms</h4>
                <p className="text-sm text-muted-foreground">{mockInvoice.paymentTerms}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <span className="text-sm text-muted-foreground">Payment Status</span>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusIcon className={`w-4 h-4 ${getStatusColor(mockInvoice.status)}`} />
                    <Badge variant={getStatusBadgeVariant(mockInvoice.status)}>
                      {mockInvoice.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">Amount Due</span>
                  <p className="font-bold text-lg text-green-600">
                    {mockInvoice.status === 'paid' ? formatCurrency(0) : formatCurrency(mockInvoice.totalAmount)}
                  </p>
                </div>
              </div>

              {mockInvoice.status === 'paid' && mockInvoice.paidDate && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Payment Received</span>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2 text-sm">
                    <div>
                      <span className="text-green-700">Paid On:</span>
                      <p className="font-medium">{formatDate(mockInvoice.paidDate)}</p>
                    </div>
                    <div>
                      <span className="text-green-700">Method:</span>
                      <p className="font-medium">{mockInvoice.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              )}

              {mockInvoice.status === 'overdue' && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">Payment Overdue</span>
                  </div>
                  <p className="text-sm text-red-700">
                    This invoice is {Math.floor((new Date().getTime() - new Date(mockInvoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days overdue.
                    Please contact the client for payment.
                  </p>
                  <Button variant="destructive" size="sm" className="mt-2" onClick={handleSendReminder}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Payment Reminder
                  </Button>
                </div>
              )}

              {mockInvoice.status === 'pending' && (
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-3">Record Payment</h4>
                    <form className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="paymentAmount">Payment Amount</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="paymentAmount"
                              type="number"
                              step="0.01"
                              defaultValue={mockInvoice.totalAmount}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="paymentDate">Payment Date</Label>
                          <Input
                            id="paymentDate"
                            type="date"
                            defaultValue={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <select className="w-full p-2 border rounded-md">
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="check">Check</option>
                          <option value="credit_card">Credit Card</option>
                          <option value="cash">Cash</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paymentNotes">Payment Notes</Label>
                        <Textarea
                          id="paymentNotes"
                          value={paymentNotes}
                          onChange={(e) => setPaymentNotes(e.target.value)}
                          placeholder="Add any notes about the payment..."
                          rows={2}
                        />
                      </div>

                      <Button type="submit" className="w-full" onClick={handleMarkAsPaid}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Record Payment
                      </Button>
                    </form>
                  </div>
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
              <div className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">Invoice Sent</span>
                    <span className="text-xs text-muted-foreground">{formatDate(mockInvoice.issueDate)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Invoice {mockInvoice.id} sent to {mockInvoice.clientEmail}
                  </p>
                </div>

                {mockInvoice.status === 'paid' && (
                  <div className="p-3 border rounded-lg bg-green-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-green-800">Payment Confirmed</span>
                      <span className="text-xs text-green-600">{formatDate(mockInvoice.paidDate!)}</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Payment of {formatCurrency(mockInvoice.totalAmount)} received via {mockInvoice.paymentMethod}
                    </p>
                  </div>
                )}

                {mockInvoice.status === 'overdue' && (
                  <div className="p-3 border rounded-lg bg-yellow-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-yellow-800">Payment Reminder Sent</span>
                      <span className="text-xs text-yellow-600">{formatDate(new Date(new Date(mockInvoice.dueDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString())}</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Automatic reminder sent for overdue payment
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="newMessage">Send Message</Label>
                <Textarea
                  id="newMessage"
                  placeholder="Send a message about this invoice..."
                  rows={3}
                />
                <Button size="sm">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
