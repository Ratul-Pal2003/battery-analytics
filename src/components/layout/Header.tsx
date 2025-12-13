import { ReactNode } from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

/**
 * Dashboard header component
 */
export function Header({
  title = 'Zenfinity Battery Analytics',
  subtitle = 'Real-time battery performance monitoring and analysis',
  actions
}: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Logo/Icon */}
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-md">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {title}
              </h1>
              <p className="text-blue-100 text-sm md:text-base mt-1">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Actions (Battery selector, etc.) */}
          {actions && (
            <div className="hidden md:block">
              {actions}
            </div>
          )}
        </div>

        {/* Mobile actions */}
        {actions && (
          <div className="md:hidden mt-4">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
