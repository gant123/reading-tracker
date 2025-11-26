import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
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

  // Fetch user's avatar settings
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      avatarStyle: true,
      avatarSeed: true,
      avatarColor: true,
    },
  });

  return (
    <DashboardLayout
      role="PARENT"
      userName={session.user.name || 'User'}
      userEmail={session.user.email || ''}
      avatarStyle={user?.avatarStyle}
      avatarSeed={user?.avatarSeed || session.user.name || undefined}
      avatarColor={user?.avatarColor}
    >
      {children}
    </DashboardLayout>
  );
}