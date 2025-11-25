import { ChildLayoutWrapper } from '@/components/layout/ChildLayoutWrapper';
import { ReactNode } from 'react';

export default function ChildLayout({ children }: { children: ReactNode }) {
  return <ChildLayoutWrapper>{children}</ChildLayoutWrapper>;
}