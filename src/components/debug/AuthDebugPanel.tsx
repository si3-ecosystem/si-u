"use client";

import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/store';
import { selectUserDebugLog, selectUser, selectIsLoggedIn, selectWalletAddress } from '@/redux/slice/userSlice';
import { UnifiedAuthService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Eye, EyeOff } from 'lucide-react';

export function AuthDebugPanel() {
  const user = useAppSelector(selectUser);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const walletAddress = useAppSelector(selectWalletAddress);
  const debugLog = useAppSelector(selectUserDebugLog);

  const [isVisible, setIsVisible] = useState(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [tokenPayload, setTokenPayload] = useState<any>(null);

  // Only show in development
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('si3-jwt');
      setJwtToken(token);

      if (token) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            setTokenPayload(payload);
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      }
    }
  }, []);

  const handleRefreshUserData = async () => {
    try {
      await UnifiedAuthService.refreshUserData();
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getLogEntryColor = (action: string) => {
    switch (action) {
      case 'initializeUser':
        return 'bg-blue-100 text-blue-800';
      case 'setUser':
        return 'bg-green-100 text-green-800';
      case 'updateUserProfile':
        return 'bg-yellow-100 text-yellow-800';
      case 'resetUser':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isDevelopment) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible ? (
        <Button
          onClick={() => setIsVisible(true)}
          className="rounded-full w-12 h-12 bg-purple-600 hover:bg-purple-700"
          title="Show Auth Debug Panel"
        >
          <Eye className="w-5 h-5" />
        </Button>
      ) : (
        <Card className="w-96 max-h-96 overflow-hidden shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Auth Debug Panel</CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefreshUserData}
                  title="Refresh User Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  title="Hide Panel"
                >
                  <EyeOff className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 text-xs overflow-y-auto max-h-80">
            {/* Auth Status */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <Badge variant={isLoggedIn ? "default" : "destructive"}>
                  {isLoggedIn ? "Logged In" : "Not Logged In"}
                </Badge>
              </div>

              {user._id && (
                <div className="text-gray-600">
                  User ID: {user._id}
                </div>
              )}

              {user.email && (
                <div className="text-gray-600">
                  Email: {user.email}
                </div>
              )}

              {walletAddress && (
                <div className="text-gray-600">
                  Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
              )}
            </div>

            {/* Token Info */}
            {jwtToken && (
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium mb-1">JWT Token</div>
                <div className="space-y-1">
                  <div>Length: {jwtToken.length}</div>
                  {tokenPayload && (
                    <>
                      <div>Expires: {new Date(tokenPayload.exp * 1000).toLocaleString()}</div>
                      <div>Issued: {new Date(tokenPayload.iat * 1000).toLocaleString()}</div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Debug Log */}
            <div>
              <div className="font-medium mb-2">Debug Log ({debugLog.length})</div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {debugLog.slice(-5).reverse().map((entry, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <Badge className={`text-xs ${getLogEntryColor(entry.action)}`}>
                        {entry.action}
                      </Badge>
                      <span className="text-gray-500 text-xs">
                        {formatTimestamp(entry.timestamp)}
                      </span>
                    </div>

                    {entry.preservedFields && entry.preservedFields.length > 0 && (
                      <div className="text-xs text-green-600 mb-1">
                        Preserved: {entry.preservedFields.join(', ')}
                      </div>
                    )}
                  </div>
                ))}

                {debugLog.length === 0 && (
                  <div className="text-gray-500 text-center py-2">
                    No debug entries yet
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t">
              <div className="text-xs font-medium mb-1">Quick Actions:</div>
              <div className="flex gap-1 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => console.log('Current Auth State:', UnifiedAuthService.getAuthState())}
                  className="text-xs"
                >
                  Log State
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => console.log('User Object:', user)}
                  className="text-xs"
                >
                  Log User
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
