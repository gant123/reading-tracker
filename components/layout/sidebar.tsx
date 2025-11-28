'use client';

import {
  BookOpen,
  Clock,
  Gift,
  LayoutDashboard,
  Sparkles,
  Users,
  Tablet,
} from 'lucide-react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  role: 'PARENT' | 'CHILD';
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const childLinks = [
    { href: '/child', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/child/timer', label: 'Timer', icon: Clock },
    { href: '/child/books', label: 'Books', icon: BookOpen },
    { href: '/child/rewards', label: 'Rewards', icon: Gift },
    { href: '/child/avatar', label: 'Avatar', icon: Sparkles, highlight: true },
  ];

  const parentLinks = [
    { href: '/parent', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/parent/children', label: 'Children', icon: Users },
    { href: '/parent/books', label: 'Books', icon: BookOpen },
    { href: '/parent/rewards', label: 'Rewards', icon: Gift },
      { href: '/parent/devices', label: 'Devices', icon: Tablet, highlight: true }, // NEW!
  ];

  const links = role === 'PARENT' ? parentLinks : childLinks;

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-5rem)] p-4 flex-shrink-0">
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            const isHighlight:any  = 'highlight' in link && link.highlight;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? isHighlight
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-purple-200'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200'
                    : isHighlight
                      ? 'text-purple-700 hover:bg-purple-50 border border-purple-200 bg-gradient-to-r from-pink-50 to-purple-50'
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isHighlight && !isActive ? 'text-purple-500' : ''}`} />
                <span className="font-medium">{link.label}</span>
                {isHighlight && !isActive && (
                  <span className="ml-auto text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-0.5 rounded-full font-bold">
                    NEW
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer - Tips */}
        <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-800 font-medium">
            {role === 'CHILD' 
              ? '💡 Tip: Read daily to build your streak!' 
              : '💡 Tip: Set up rewards to motivate reading!'}
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation - Visible only on mobile/tablet */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 pb-safe">
        <div className="flex items-center justify-around h-16">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive:any = pathname === link.href;
            const isHighlight = 'highlight' in link && link.highlight;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex flex-col items-center justify-center flex-1 h-full px-1 transition-all ${
                  isActive
                    ? isHighlight
                      ? 'text-purple-600'
                      : 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <span className={`absolute top-1 w-1 h-1 rounded-full ${
                    isHighlight ? 'bg-purple-500' : 'bg-blue-500'
                  }`} />
                )}
                
                {/* Icon with background on active */}
                <div className={`p-1.5 rounded-xl transition-all ${
                  isActive 
                    ? isHighlight
                      ? 'bg-purple-100'
                      : 'bg-blue-100'
                    : ''
                }`}>
                  <Icon className={`w-5 h-5 ${
                    isActive 
                      ? isHighlight 
                        ? 'text-purple-600' 
                        : 'text-blue-600'
                      : ''
                  }`} />
                </div>
                
                {/* Label */}
                <span className={`text-[10px] mt-0.5 font-medium ${
                  isActive ? 'font-semibold' : ''
                }`}>
                  {link.label}
                </span>

                {/* NEW badge for highlight items */}
                {isHighlight && !isActive && (
                  <span className="absolute -top-0.5 right-1/2 translate-x-1/2 text-[8px] bg-gradient-to-r from-pink-500 to-purple-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                    NEW
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}