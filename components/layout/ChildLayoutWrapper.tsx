import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from './DashboardLayout';
import { ReactNode } from 'react';

interface ChildLayoutWrapperProps {
  children: ReactNode;
}

export async function ChildLayoutWrapper({ children }: ChildLayoutWrapperProps) {
  const session = await auth();

  if (!session || session.user.role !== 'CHILD') {
    redirect('/login');
  }

  return (
    <DashboardLayout
      role="CHILD"
      userName={session.user.name || 'User'}
      userEmail={session.user.email || ''}
    >
      {children}
    </DashboardLayout>
  );
}