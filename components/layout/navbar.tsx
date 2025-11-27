'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserMenu } from '@/components/UserMenu';

interface NavbarProps {
  userName?: string;
  userEmail?: string;
  role?: 'PARENT' | 'CHILD';
  avatarStyle?: string;
  avatarSeed?: string;
  avatarColor?: string;
}

export function Navbar({ 
  userName, 
  userEmail, 
  role,
  avatarStyle,
  avatarSeed,
  avatarColor 
}: NavbarProps) {
  const dashboardLink = role === 'PARENT' ? '/parent' : '/child';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-xl">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo Section */}
          <Link href={dashboardLink} className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 transition-transform group-hover:scale-105">
              <Image 
                src="/logo.png" 
                alt="Reading Tracker Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Reading Tracker
              </span>
              {role && (
                <span className={`block text-[10px] font-semibold uppercase tracking-wider ${
                  role === 'PARENT' ? 'text-purple-500' : 'text-blue-500'
                }`}>
                  {role === 'PARENT' ? 'Parent Dashboard' : 'Reader Dashboard'}
                </span>
              )}
            </div>
          </Link>
          
          {/* User Menu Section */}
          {userName && (
            <UserMenu 
              userName={userName}
              userEmail={userEmail}
              role={role}
              avatarStyle={avatarStyle}
              avatarSeed={avatarSeed}
              avatarColor={avatarColor}
            />
          )}
        </div>
      </div>
    </nav>
  );
}