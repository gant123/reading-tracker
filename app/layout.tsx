import type { Metadata } from 'next';
import {  Outfit } from 'next/font/google';
import '@/styles/globals.css';
import { Toaster } from '@/components/Toaster';
import Providers from './providers'; //

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BookHoot & Rewards',
  description: 'Track reading progress, earn rewards, and build healthy reading habits',
  icons: {
    icon: '/logo.png', // Uses your new logo as the browser tab icon too!
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.className} min-h-screen bg-gray-50`}>
        <div className="fixed inset-0 z-[-1] opacity-40 pointer-events-none"
             style={{
               backgroundImage: `radial-gradient(circle at 50% 120%, #e0e7ff, #f3e8ff, transparent)`
             }} 
        />
        <Providers> 
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}