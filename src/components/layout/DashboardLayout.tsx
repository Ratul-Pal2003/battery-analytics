import { ReactNode } from 'react';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
  headerActions?: ReactNode;
}

/**
 * Main dashboard layout wrapper
 * Provides consistent structure for the entire application
 */
export function DashboardLayout({ children, headerActions }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <Header actions={headerActions} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
            <p>
              &copy; {new Date().getFullYear()} Zenfinity Energy. Battery Analytics Dashboard.
            </p>
            <p className="mt-2 md:mt-0">
              Built with React, TypeScript, and D3.js
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default DashboardLayout;
