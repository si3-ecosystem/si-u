import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - SI3 Dashboard',
  description: 'Administrative dashboard for managing RSVPs and system monitoring',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Panel
              </h1>
              <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                Admin or Team
              </span>
            </div>
            <nav className="flex items-center gap-4 text-sm">
              <a 
                href="/admin/dashboard" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </a>
              <a 
                href="/admin/users" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Users
              </a>
              <a 
                href="/home" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Back to Home
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
