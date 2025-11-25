import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from './DashboardLayout';
import { ReactNode } from 'react';

interface ParentLayoutWrapperProps {
  children: ReactNode;
}

export async function ParentLayoutWrapper({ children }: ParentLayoutWrapperProps) {
  const session = await auth();

  if (!session || session.user.role !== 'PARENT') {
    redirect('/login');
  }

  return (
    <DashboardLayout
      role="PARENT"
      userName={session.user.name || 'User'}
      userEmail={session.user.email || ''}
    >
      {children}
    </DashboardLayout>
  );
}