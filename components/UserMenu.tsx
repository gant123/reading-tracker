'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { LogOut, ChevronDown, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface UserMenuProps {
  userName: string;
  userEmail?: string;
  avatarStyle?: string;
  avatarSeed?: string;
  avatarColor?: string;
  role?: 'PARENT' | 'CHILD';
}

export function UserMenu({ 
  userName, 
  userEmail, 
  avatarStyle = 'adventurer',
  avatarSeed,
  avatarColor = '60a5fa',
  role,
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const seed = avatarSeed || userName;
  const bgColor = avatarColor?.replace('#', '') || '60a5fa';
  const avatarUrl = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${encodeURIComponent(seed)}&size=64&backgroundColor=${bgColor}`;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="relative">
          <img
            src={avatarUrl}
            alt={userName}
            className="w-8 h-8 rounded-full ring-2 ring-white shadow-sm"
          />
          {role === 'CHILD' && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          )}
        </div>
        <span className="text-gray-700 font-medium hidden sm:block">{userName}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt={userName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                {userEmail && (
                  <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                )}
              </div>
            </div>
          </div>
          
          {role === 'CHILD' && (
            <Link
              href="/child/avatar"
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Avatar Shop
            </Link>
          )}
          
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}