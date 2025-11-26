'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { UserMenu } from '@/components/UserMenu';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

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
  const title = role === 'PARENT' ? 'Parent Dashboard' : 'Reading Tracker';
  const logoColor = role === 'PARENT' ? 'text-purple-600' : 'text-blue-600';
  const homeUrl = role === 'PARENT' ? '/parent' : '/child';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={homeUrl} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <BookOpen className={`w-8 h-8 ${logoColor}`} />
              <span className="font-bold text-xl">{title}</span>
            </Link>
            <UserMenu 
              userName={userName} 
              userEmail={userEmail}
              avatarStyle={avatarStyle}
              avatarSeed={avatarSeed}
              avatarColor={avatarColor}
              role={role}
            />
          </div>
        </div>
      </nav>

      {/* Main Layout with Sidebar */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar role={role} />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}