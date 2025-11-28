import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
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
// 2. LOGGING: See what is actually inside the session
console.log("DEBUG SESSION:", session.user); 

// 3. SAFETY CHECK: Ensure ID exists before querying
if (!session.user.id) {
  console.error("User ID is missing from session!");
  // Handle this case (redirect or return null)
  return null; 
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
      role="CHILD"
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