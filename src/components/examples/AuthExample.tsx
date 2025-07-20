"use client";

import { useAuth } from '@/hooks/useAuth';

/**
 * Example component demonstrating how to use the useAuth hook
 * to access user data and authentication state throughout your app
 */
export function AuthExample() {
  const {
    // User data
    user,
    address,
    isLoggedIn,
    isLoading,
    error,
    
    // Auth status checks
    isAuthenticated,
    isVerified,
    hasRole,
    isAdmin,
    isGuide,
    isPartner,
    
    // Auth actions
    logout,
    refreshUser,
    
    // Utility methods
    getDisplayName,
    getInitials,
  } = useAuth();

  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view this content.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Information</h2>
      
      {/* Basic user info */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Basic Info</h3>
        <p><strong>Display Name:</strong> {getDisplayName()}</p>
        <p><strong>Initials:</strong> {getInitials()}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Username:</strong> {user?.username || 'Not set'}</p>
        <p><strong>Website:</strong> {user?.website || 'Not set'}</p>
        <p><strong>Wallet Address:</strong> {address || 'Not connected'}</p>
      </div>

      {/* Auth status */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Auth Status</h3>
        <p><strong>Logged In:</strong> {isLoggedIn ? 'Yes' : 'No'}</p>
        <p><strong>Verified:</strong> {isVerified ? 'Yes' : 'No'}</p>
        <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
        <p><strong>Is Guide:</strong> {isGuide ? 'Yes' : 'No'}</p>
        <p><strong>Is Partner:</strong> {isPartner ? 'Yes' : 'No'}</p>
      </div>

      {/* User roles */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Roles</h3>
        <div className="flex flex-wrap gap-2">
          {user?.roles?.map((role) => (
            <span 
              key={role} 
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
            >
              {role}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={refreshUser}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Refresh User Data
        </button>
        
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Raw user data (for debugging) */}
      <details className="mt-6">
        <summary className="cursor-pointer font-semibold">Raw User Data</summary>
        <pre className="mt-2 p-4 bg-gray-100 rounded-md text-sm overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </details>
    </div>
  );
}

/**
 * Example of role-based conditional rendering
 */
export function RoleBasedExample() {
  const { hasRole, isAdmin, isGuide } = useAuth();

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">Role-Based Content</h3>
      
      {isAdmin && (
        <div className="p-2 bg-red-100 text-red-800 rounded mb-2">
          🔴 Admin-only content
        </div>
      )}
      
      {isGuide && (
        <div className="p-2 bg-green-100 text-green-800 rounded mb-2">
          🟢 Guide-only content
        </div>
      )}
      
      {hasRole('partner') && (
        <div className="p-2 bg-blue-100 text-blue-800 rounded mb-2">
          🔵 Partner-only content
        </div>
      )}
      
      <div className="p-2 bg-gray-100 text-gray-800 rounded">
        📄 Content visible to all authenticated users
      </div>
    </div>
  );
}
