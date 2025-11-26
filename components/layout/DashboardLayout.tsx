'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar'; // Import the Navbar

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
    // Removed the 'bg-gradient-to-b' class so your global background shows through!
    <div className="min-h-screen"> 
      
      {/* Use the shared Navbar component */}
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

        <main className="flex-1 overflow-x-hidden p-6">
          {children}
        </main>
      </div>
    </div>
  );
}