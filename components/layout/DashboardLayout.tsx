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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-[100vw] h-[100vw] bg-gradient-to-br from-blue-100/40 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-[80vw] h-[80vw] bg-gradient-to-tr from-purple-100/30 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

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
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 min-h-[calc(100vh-5rem)]">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}