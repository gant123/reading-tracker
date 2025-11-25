'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Clock, 
  Gift, 
  Trophy, 
  Users,
  Settings,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  role: 'PARENT' | 'CHILD';
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const childLinks = [
    { href: '/child', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/child/timer', label: 'Reading Timer', icon: Clock },
    { href: '/child/books', label: 'My Books', icon: BookOpen },
    { href: '/child/rewards', label: 'Rewards', icon: Gift },
  ];

  const parentLinks = [
    { href: '/parent', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/parent/children', label: 'Children', icon: Users },
    { href: '/parent/books', label: 'Book Approvals', icon: BookOpen },
    { href: '/parent/rewards', label: 'Rewards', icon: Gift },
  ];

  const links = role === 'PARENT' ? parentLinks : childLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}