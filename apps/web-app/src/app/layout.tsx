import type { Metadata } from 'next';
import './globals.css';
import AppShell from '../components/AppShell';

export const metadata: Metadata = {
  title: 'Wasl App | Candidate & Family Dashboard',
  description: 'Private authenticated matrimonial dashboard with real-time alerts.',
  robots: {
    index: false,
    follow: false
  }
};

export default function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-900 text-slate-900 antialiased" suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
