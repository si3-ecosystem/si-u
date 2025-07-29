"use server";

import { RSVPStatus, RSVPResponse } from '@/types/rsvp';

/**
 * Server action to handle RSVP operations
 */
export async function updateRSVP(sessionId: string, status: RSVPStatus): Promise<RSVPResponse> {
  try {
    // Get the API URL from environment
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    // In a real implementation, you'd get the user ID from the session/auth
    // For now, we'll use a placeholder
    const userId = 'current-user-id'; // Replace with actual user ID from auth
    
    const response = await fetch(`${apiUrl}/api/sessions/${sessionId}/rsvp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        status,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.rsvp,
      message: `RSVP updated to ${status || 'removed'}`,
    };
  } catch (error) {
    console.error('RSVP update error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update RSVP',
    };
  }
}

/**
 * Server action to get RSVP status for a session
 */
export async function getRSVPStatus(sessionId: string): Promise<RSVPResponse> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const userId = 'current-user-id'; // Replace with actual user ID from auth
    
    const response = await fetch(`${apiUrl}/api/sessions/${sessionId}/rsvp/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: true,
          data: undefined, // No RSVP found
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.rsvp,
    };
  } catch (error) {
    console.error('Get RSVP status error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get RSVP status',
    };
  }
}
