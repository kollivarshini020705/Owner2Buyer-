import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'Owner2Buyer - Direct P2P Broker-Free Real Estate',
  description: 'Directly list, search, negotiate, and digitally sign stamp papers on India\'s premium peer-to-peer real estate portal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
