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
    // Increased height to h-20 for a "bigger" feel
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-xl h-20 flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link href={dashboardLink} className="flex items-center gap-4 group">
            {/* BIGGER LOGO: w-16 h-16 (64px) */}
            <div className="relative w-16 h-16 transition-transform group-hover:scale-105">
              <Image 
                src="/logo.png" 
                alt="Reading Tracker Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-extrabold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              Reading Tracker
            </span>
          </Link>
          
          {/* User Menu Section */}
          {userName && (
            <div className="flex items-center gap-4">
              <UserMenu 
                userName={userName}
                userEmail={userEmail}
                role={role}
                avatarStyle={avatarStyle}
                avatarSeed={avatarSeed}
                avatarColor={avatarColor}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}