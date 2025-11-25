import { ParentLayoutWrapper } from '@/components/layout/ParentLayoutWrapper';
import { ReactNode } from 'react';

export default function ParentLayout({ children }: { children: ReactNode }) {
  return <ParentLayoutWrapper>{children}</ParentLayoutWrapper>;
}