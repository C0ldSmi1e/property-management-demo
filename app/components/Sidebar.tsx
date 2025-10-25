'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { cn } from '@/lib/utils';
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
  DollarSign,
  Megaphone,
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout, switchUser } = useAuth();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!user) return null;

  const getNavigationItems = () => {
    switch (user.role) {
      case 'property_manager':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: Home },
          { name: 'Properties', href: '/dashboard/properties', icon: Building },
          { name: 'Tenants', href: '/dashboard/tenants', icon: Users },
          { name: 'Service Requests', href: '/dashboard/service-requests', icon: Wrench },
          { name: 'Financials & Analytics', href: '/dashboard/analytics', icon: BarChart3 },
          { name: 'Documents', href: '/dashboard/documents', icon: FileText },
          { name: 'Announcements', href: '/dashboard/announcements', icon: Megaphone },
        ];
      case 'tenant':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: Home },
          { name: 'My Property', href: '/dashboard/property', icon: Building },
          { name: 'Service Requests', href: '/dashboard/service-requests', icon: Wrench },
          { name: 'Payments', href: '/dashboard/payments', icon: DollarSign },
          { name: 'Documents', href: '/dashboard/documents', icon: FileText },
          { name: 'Messages', href: '/dashboard/messages', icon: MessageCircle },
          { name: 'Profile', href: '/dashboard/profile', icon: Settings },
        ];
      case 'service_provider':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: Home },
          { name: 'Work Orders', href: '/dashboard/work-orders', icon: Wrench },
          { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
          { name: 'Invoices', href: '/dashboard/invoices', icon: Receipt },
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

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg ${getRoleColor(user.role)} flex items-center justify-center`}>
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">PropertyHub</span>
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300 border-r bg-background",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className={cn(
            "flex items-center justify-between p-4 border-b",
            isCollapsed && "justify-center"
          )}>
            {!isCollapsed && (
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${getRoleColor(user.role)} flex items-center justify-center`}>
                  <Building className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">PropertyHub</span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* User Info */}
          <div className={cn(
            "p-4 border-b",
            isCollapsed && "p-2"
          )}>
            {isCollapsed ? (
              <div className="flex justify-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <Button
                      variant={active ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isCollapsed && "justify-center px-2",
                        active && "bg-primary/10 text-primary hover:bg-primary/20"
                      )}
                    >
                      <IconComponent className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
                      {!isCollapsed && <span>{item.name}</span>}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Bottom Actions */}
          <div className="p-2 border-t space-y-1">
            {/* Role Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <UserCheck className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
                  {!isCollapsed && <span>Switch Role</span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-48">
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

            {/* Settings */}
            <Link href="/dashboard/profile">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <Settings className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span>Settings</span>}
              </Button>
            </Link>

            {/* Logout */}
            <Button
              variant="ghost"
              onClick={logout}
              className={cn(
                "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
                isCollapsed && "justify-center px-2"
              )}
            >
              <LogOut className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Spacer for fixed sidebar */}
      <div className={cn(
        "hidden lg:block transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )} />

      {/* Mobile spacer */}
      <div className="lg:hidden h-16" />
    </>
  );
};

