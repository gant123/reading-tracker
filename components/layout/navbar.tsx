import Link from 'next/link';
import { BookOpen } from 'lucide-react';

interface NavbarProps {
  userName?: string;
  role?: 'PARENT' | 'CHILD';
}

export function Navbar({ userName, role }: NavbarProps) {
  const dashboardLink = role === 'PARENT' ? '/parent' : '/child';

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={dashboardLink} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="font-bold text-xl">Reading Tracker</span>
          </Link>
          
          {userName && (
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Hi, {userName}!</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}