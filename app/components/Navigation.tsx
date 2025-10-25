'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Home,
  Building,
  Users,
  Wrench,
  FileText,
  BarChart3,
  MessageCircle,
  Calendar,
  Receipt,
  Settings,
  LogOut,
  UserCheck,
  Menu,
  DollarSign,
  Megaphone,
  Bell
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { user, logout, switchUser } = useAuth();

  if (!user) return null;

  const getNavigationItems = () => {
    switch (user.role) {
      case 'property_manager':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: Home },
          { name: 'Properties', href: '/dashboard/properties', icon: Building },
          { name: 'Tenants', href: '/dashboard/tenants', icon: Users },
          { name: 'Service Requests', href: '/dashboard/service-requests', icon: Wrench },
          { name: 'Financials', href: '/dashboard/financials', icon: DollarSign },
          { name: 'Documents', href: '/dashboard/documents', icon: FileText },
          { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
          { name: 'Announcements', href: '/dashboard/announcements', icon: Megaphone },
          { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
        ];
      case 'tenant':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: Home },
          { name: 'My Property', href: '/dashboard/property', icon: Building },
          { name: 'Service Requests', href: '/dashboard/service-requests', icon: Wrench },
          { name: 'Payments', href: '/dashboard/payments', icon: DollarSign },
          { name: 'Documents', href: '/dashboard/documents', icon: FileText },
          { name: 'Messages', href: '/dashboard/messages', icon: MessageCircle },
          { name: 'Announcements', href: '/dashboard/announcements', icon: Megaphone },
          { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
        ];
      case 'service_provider':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: Home },
          { name: 'Work Orders', href: '/dashboard/work-orders', icon: Wrench },
          { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
          { name: 'Invoices', href: '/dashboard/invoices', icon: Receipt },
          { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
          { name: 'Profile', href: '/dashboard/profile', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'property_manager': return 'bg-blue-600';
      case 'tenant': return 'bg-green-600';
      case 'service_provider': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'property_manager': return 'Property Manager';
      case 'tenant': return 'Tenant';
      case 'service_provider': return 'Service Provider';
      default: return role;
    }
  };

  const navigationItems = getNavigationItems();
  const demoUsers = [
    { id: '1', name: 'Sarah Johnson', role: 'property_manager', label: 'Property Manager' },
    { id: '2', name: 'Mike Chen', role: 'tenant', label: 'Tenant' },
    { id: '3', name: 'ABC Plumbing', role: 'service_provider', label: 'Service Provider' },
  ];

  return (
    <nav className={`${getRoleColor(user.role)} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex-shrink-0">
              <h1 className="text-white text-xl font-bold">PropertyHub</h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:space-x-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-white/10 h-auto py-2 px-3"
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Role Badge */}
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {getRoleLabel(user.role)}
            </Badge>

            {/* User Role Switcher (Demo Feature) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Switch Role
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Demo: Switch User Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {demoUsers.map((demoUser) => (
                  <DropdownMenuItem
                    key={demoUser.id}
                    onClick={() => switchUser(demoUser.id)}
                    className={user?.id === demoUser.id ? 'bg-accent' : ''}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{demoUser.name}</span>
                      <span className="text-xs text-muted-foreground">{demoUser.label}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-white/10 text-white">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle>PropertyHub</SheetTitle>
                <SheetDescription>
                  {getRoleLabel(user.role)}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-1">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};