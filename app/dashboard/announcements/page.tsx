'use client';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AnnouncementsBoard } from '../../components/AnnouncementsBoard';

export default function AnnouncementsPage() {
  const { user, userData } = useAuth();

  if (!user) return null;

  const canCreate = user.role === 'property_manager';
  const propertyId = user.role === 'tenant' && userData?.property ? userData.property.id : undefined;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
        <p className="text-muted-foreground">
          {user.role === 'property_manager'
            ? 'Manage community announcements and important notices'
            : 'Stay updated with important community announcements'
          }
        </p>
      </div>

      {/* Announcements Board */}
      <AnnouncementsBoard
        userRole={user.role}
        propertyId={propertyId}
        canCreate={canCreate}
      />
    </div>
  );
}
