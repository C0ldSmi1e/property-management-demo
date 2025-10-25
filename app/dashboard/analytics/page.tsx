'use client';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '../../utils/helpers';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Building,
  Users,
  Wrench,
  Calendar,
  Download,
  BarChart3,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '../../utils/helpers';
import { Separator } from '@/components/ui/separator';

export default function AnalyticsPage() {
  const { userData } = useAuth();

  if (!userData) return null;

  const { properties, analytics, serviceRequests } = userData;

  // Prepare chart data
  const propertyTypeData = properties.reduce((acc: any, property: any) => {
    const existing = acc.find((item: any) => item.type === property.type);
    if (existing) {
      existing.count += 1;
      existing.revenue += property.rentAmount;
    } else {
      acc.push({
        type: property.type,
        count: 1,
        revenue: property.rentAmount
      });
    }
    return acc;
  }, []);

  const occupancyData = [
    { status: 'Occupied', count: properties.filter((p: any) => p.status === 'occupied').length, color: '#22c55e' },
    { status: 'Vacant', count: properties.filter((p: any) => p.status === 'vacant').length, color: '#eab308' },
    { status: 'Maintenance', count: properties.filter((p: any) => p.status === 'maintenance').length, color: '#ef4444' }
  ];

  const revenueData = analytics.propertyPerformance.map((perf: any) => {
    const property = properties.find((p: any) => p.id === perf.propertyId);
    return {
      name: property?.name.split(' - ')[0] || 'Unknown',
      income: perf.monthlyIncome,
      expenses: perf.monthlyExpenses,
      profit: perf.netIncome
    };
  });

  const serviceRequestTrendData = analytics.serviceRequestTrends;

  const maintenanceCostData = properties.map((property: any) => {
    const requests = serviceRequests.filter((r: any) => r.propertyId === property.id && r.status === 'completed');
    const totalCost = requests.reduce((sum: number, r: any) => sum + (r.actualCost || 0), 0);
    return {
      property: property.name.split(' - ')[0],
      cost: totalCost,
      requests: requests.length
    };
  });

  const totalRevenue = analytics.monthlyRevenue;
  const totalExpenses = analytics.maintenanceCosts;
  const netIncome = totalRevenue - totalExpenses;
  const occupancyRate = analytics.occupancyRate;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financials & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive financial insights and property portfolio performance
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
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
            <p className="text-xs text-muted-foreground">After expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              {properties.filter((p: any) => p.status === 'occupied').length} of {properties.length} units
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Costs</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="financials" className="space-y-4">
        <TabsList>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Financials Tab with AI Insights */}
        <TabsContent value="financials" className="space-y-4">
          {/* AI-Powered Insights */}
          <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                AI Financial Insights
              </CardTitle>
              <CardDescription>
                Smart analysis based on your historical data and market trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Revenue Trending Up</p>
                      <p className="text-sm text-muted-foreground">
                        Your total revenue increased by <span className="font-semibold text-green-600">12.5%</span> compared to last month.
                        This is <span className="font-semibold">8% above</span> market average.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Optimal Occupancy</p>
                      <p className="text-sm text-muted-foreground">
                        Your occupancy rate of <span className="font-semibold">{occupancyRate}%</span> is healthy.
                        Consider raising rent by 3-5% on renewal for occupied units.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Maintenance Optimization</p>
                      <p className="text-sm text-muted-foreground">
                        Scheduled maintenance can reduce emergency repairs by up to <span className="font-semibold">35%</span>.
                        Recommend quarterly HVAC checks.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Revenue Potential</p>
                      <p className="text-sm text-muted-foreground">
                        Filling vacant units could generate an additional <span className="font-semibold text-green-600">{formatCurrency(1800)}/mo</span>.
                        Market demand is high in your area.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Anomalies Detected */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Anomalies Detected
              </CardTitle>
              <CardDescription>
                Our AI identified unusual patterns that require your attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Unusual Maintenance Cost Spike</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-semibold">Riverside Condos</span> maintenance costs increased by
                    <span className="font-semibold text-orange-600"> 145%</span> this month ({formatCurrency(450)} vs avg {formatCurrency(180)}).
                    <br />
                    <span className="text-xs">Detected pattern: Potential recurring HVAC issues based on 3 similar requests in 2 months.</span>
                  </p>
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <Link href="/dashboard/properties/2">
                      Investigate Property →
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Late Payment Pattern</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-semibold">Lisa Rodriguez</span> has paid rent 3-5 days late for the last 3 months.
                    <br />
                    <span className="text-xs">AI Recommendation: Set up automatic payment reminders 7 days before due date.</span>
                  </p>
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <Link href="/dashboard/tenants/4">
                      View Tenant →
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <TrendingDown className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Declining Profit Margin</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-semibold">Sunset Apartments</span> profit margin decreased from 68% to 52% over 6 months.
                    <br />
                    <span className="text-xs">Root cause analysis: Utility costs up 22%, may indicate inefficient HVAC or water leaks.</span>
                  </p>
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <Link href="/dashboard/properties/1">
                      Review Expenses →
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Predictions & Recommendations */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Predictive Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-sm">HVAC System - Maple Street House</p>
                      <p className="text-xs text-muted-foreground">Last serviced: 8 months ago</p>
                      <Badge variant="destructive" className="mt-1">High Priority</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-orange-600">85% Risk</p>
                      <p className="text-xs text-muted-foreground">Next 30 days</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    AI predicts potential failure. Proactive service now ({formatCurrency(200)}) vs emergency repair ({formatCurrency(800 - 1200)}).
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-sm">Water Heater - Unit 3B</p>
                      <p className="text-xs text-muted-foreground">Age: 9 years (avg lifespan: 10-12 years)</p>
                      <Badge variant="secondary" className="mt-1">Medium Priority</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-yellow-600">45% Risk</p>
                      <p className="text-xs text-muted-foreground">Next 6 months</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    Consider budgeting {formatCurrency(1200)} for replacement within 6 months.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Smart Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <ArrowUpRight className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Optimize Rent Pricing</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Market analysis shows similar properties rent for 8% more.
                      Increasing rent to <span className="font-semibold">{formatCurrency(2700)}/mo</span> on renewals could add
                      <span className="font-semibold text-green-600"> +{formatCurrency(2400)}/year</span> revenue.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Reduce Vacancy Costs</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Current vacancy costs: <span className="font-semibold">{formatCurrency(1800)}/mo</span>.
                      Offering 1 month free rent could fill units faster, reducing total loss from
                      <span className="font-semibold"> {formatCurrency(5400)}</span> to <span className="font-semibold text-green-600">{formatCurrency(1800)}</span>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <Wrench className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Maintenance Budget Planning</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on property age and historical data, allocate
                      <span className="font-semibold"> {formatCurrency(950)}/mo</span> for Q4 maintenance
                      (current: {formatCurrency(780)}/mo). Prevents emergency overspending.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Historical Trend Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>6-Month Financial Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { month: 'May', revenue: 7200, expenses: 1100, profit: 6100 },
                  { month: 'Jun', revenue: 7500, expenses: 980, profit: 6520 },
                  { month: 'Jul', revenue: 7800, expenses: 1250, profit: 6550 },
                  { month: 'Aug', revenue: 8000, expenses: 1100, profit: 6900 },
                  { month: 'Sep', revenue: 7900, expenses: 1400, profit: 6500 },
                  { month: 'Oct', revenue: 8000, expenses: 780, profit: 7220 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                  <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} name="Net Profit" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Key Performance Indicators */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cash Flow Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Operating Ratio</span>
                    <span className="font-semibold text-green-600">9.8%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: '90.2%' }} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    Excellent - Below 15% industry standard
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">ROI Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Annual ROI</span>
                    <span className="font-semibold text-green-600">11.2%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: '74.6%' }} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    Above 8-10% target range
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Collection Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">On-Time Payments</span>
                    <span className="font-semibold text-green-600">92%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: '92%' }} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    Good - Industry avg: 88%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Property Revenue Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="income" fill="#22c55e" name="Income" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                    <Bar dataKey="profit" fill="#3b82f6" name="Net Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Property Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={propertyTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="revenue"
                      label={({ type, revenue }: any) => `${type}: ${formatCurrency(Number(revenue))}`}
                    >
                      {propertyTypeData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#22c55e', '#eab308', '#ef4444'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="occupancy" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Occupancy Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={occupancyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="count"
                      label={({ status, count }) => `${status}: ${count}`}
                    >
                      {occupancyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.propertyPerformance.map((perf: any) => {
                    const property = properties.find((p: any) => p.id === perf.propertyId);
                    const profitMargin = ((perf.netIncome / perf.monthlyIncome) * 100).toFixed(1);

                    return (
                      <div key={perf.propertyId} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{property?.name.split(' - ')[0]}</span>
                          <Badge variant={parseFloat(profitMargin) > 70 ? 'default' : parseFloat(profitMargin) > 50 ? 'secondary' : 'destructive'}>
                            {profitMargin}% margin
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Income:</span>
                            <span className="text-green-600">{formatCurrency(perf.monthlyIncome)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Expenses:</span>
                            <span className="text-red-600">{formatCurrency(perf.monthlyExpenses)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-medium">
                            <span>Net Income:</span>
                            <span className={perf.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatCurrency(perf.netIncome)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Costs by Property</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={maintenanceCostData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="property" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'cost' ? formatCurrency(value as number) : value,
                        name === 'cost' ? 'Total Cost' : 'Requests'
                      ]}
                    />
                    <Bar dataKey="cost" fill="#ef4444" name="cost" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Request Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={serviceRequestTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" name="Request Count" />
                    <Line type="monotone" dataKey="avgResolutionTime" stroke="#ef4444" name="Avg Resolution (days)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">New Requests</span>
                      <span className="font-medium">
                        {serviceRequests.filter((r: any) => {
                          const requestDate = new Date(r.createdAt);
                          const thisMonth = new Date();
                          return requestDate.getMonth() === thisMonth.getMonth();
                        }).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Completed</span>
                      <span className="font-medium text-green-600">
                        {serviceRequests.filter((r: any) => r.status === 'completed').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Pending</span>
                      <span className="font-medium text-yellow-600">
                        {serviceRequests.filter((r: any) => r.status === 'pending').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Average Costs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Per Request</span>
                      <span className="font-medium">
                        {formatCurrency(
                          serviceRequests.reduce((sum: number, r: any) => sum + (r.actualCost || r.estimatedCost || 0), 0) / serviceRequests.length || 0
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Per Property</span>
                      <span className="font-medium">
                        {formatCurrency(analytics.maintenanceCosts / properties.length)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">% of Revenue</span>
                      <span className="font-medium">
                        {((analytics.maintenanceCosts / analytics.monthlyRevenue) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">ROI</span>
                      <span className="font-medium text-green-600">
                        {((netIncome / totalRevenue) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Rent</span>
                      <span className="font-medium">{formatCurrency(analytics.averageRent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Occupancy</span>
                      <Badge variant={occupancyRate > 90 ? 'default' : occupancyRate > 70 ? 'secondary' : 'destructive'}>
                        {occupancyRate}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Schedule Report</p>
                <p className="text-xs text-muted-foreground">Set up automated reports</p>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Download className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Export Data</p>
                <p className="text-xs text-muted-foreground">Download as PDF or Excel</p>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <BarChart3 className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Custom Report</p>
                <p className="text-xs text-muted-foreground">Create custom analytics</p>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Forecasting</p>
                <p className="text-xs text-muted-foreground">Predict future trends</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
