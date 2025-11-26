'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';

interface DashboardLayoutProps {
  children: ReactNode;
  role: 'PARENT' | 'CHILD';
  userName: string;
  userEmail: string;
  avatarStyle?: string;
  avatarSeed?: string;
  avatarColor?: string;
}

export function DashboardLayout({ 
  children, 
  role, 
  userName, 
  userEmail,
  avatarStyle,
  avatarSeed,
  avatarColor,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen"> 
      {/* Navbar */}
      <Navbar 
        userName={userName}
        userEmail={userEmail}
        role={role}
        avatarStyle={avatarStyle}
        avatarSeed={avatarSeed}
        avatarColor={avatarColor}
      />

      {/* Main Layout with Sidebar */}
      <div className="flex">
        <Sidebar role={role} />

        {/* Main content area - adds bottom padding on mobile for the bottom nav */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 pb-20 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}