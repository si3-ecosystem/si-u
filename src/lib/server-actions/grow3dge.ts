"use server";

import { client, writeClient } from '@/lib/sanity/client';

export interface Grow3dgeSessionData {
  // Basic Info
  title: string;
  description: string;
  duration: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  
  // Access Control
  accessType: 'public' | 'token-gated' | 'invite-only';
  maxCapacity?: number;
  nftRequired?: string;
  ownershipRequirement?: '1token' | '5tokens' | '10tokens';
  huddle01Link?: string;
  
  // POAP Settings
  enablePOAP: boolean;
  poapTitle?: string;
  poapDescription?: string;
  poapImageUrl?: string;
  attendanceRequirement: string;
  claimMethod: 'auto-mint' | 'claim-link' | 'manual';
  claimOpens?: string;
  claimCloses?: string;
  
  // Quiz Settings
  enableQuiz: boolean;
  passPercentage: number;
  questions?: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    points: number;
  }>;
  
  // Metadata
  creator?: any;
  status?: 'draft' | 'scheduled' | 'live' | 'completed' | 'cancelled';
}

export interface Grow3dgeResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

/**
 * Server action to create a new Grow3dge session
 */
export async function createGrow3dgeSession(sessionData: Grow3dgeSessionData): Promise<Grow3dgeResponse> {
  try {
    if (!writeClient) {
      throw new Error("Sanity write client not configured");
    }

    const sessionWithMetadata = {
      ...sessionData,
      _type: 'grow3dgeSession',
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      status: sessionData.status || 'draft',
    };

    // Handle creator reference
    if (sessionWithMetadata.creator && typeof sessionWithMetadata.creator === 'object') {
      sessionWithMetadata.creator = sessionWithMetadata.creator._ref || sessionWithMetadata.creator;
    }

    const result = await writeClient.create(sessionWithMetadata);

    return {
      success: true,
      data: result,
      message: 'Grow3dge session created successfully',
    };
  } catch (error) {
    console.error('Create Grow3dge session error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create Grow3dge session',
    };
  }
}

/**
 * Server action to update an existing Grow3dge session
 */
export async function updateGrow3dgeSession(id: string, updates: Partial<Grow3dgeSessionData>): Promise<Grow3dgeResponse> {
  try {
    if (!writeClient) {
      throw new Error("Sanity write client not configured");
    }

    if (!id) {
      throw new Error("Session ID is required");
    }

    const result = await writeClient
      .patch(id)
      .set({
        ...updates,
        _updatedAt: new Date().toISOString()
      })
      .commit();

    return {
      success: true,
      data: result,
      message: 'Grow3dge session updated successfully',
    };
  } catch (error) {
    console.error('Update Grow3dge session error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update Grow3dge session',
    };
  }
}

/**
 * Server action to delete a Grow3dge session
 */
export async function deleteGrow3dgeSession(id: string): Promise<Grow3dgeResponse> {
  try {
    if (!writeClient) {
      throw new Error("Sanity write client not configured");
    }

    if (!id) {
      throw new Error("Session ID is required");
    }

    await writeClient.delete(id);

    return {
      success: true,
      message: 'Grow3dge session deleted successfully',
    };
  } catch (error) {
    console.error('Delete Grow3dge session error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete Grow3dge session',
    };
  }
}

/**
 * Server action to get Grow3dge sessions
 */
export async function getGrow3dgeSessionsAction(status?: string): Promise<Grow3dgeResponse> {
  try {
    if (!client) {
      throw new Error("Sanity client not configured");
    }

    let query = `*[_type == "grow3dgeSession"`;
    const params: Record<string, any> = {};

    if (status) {
      query += ` && status == $status`;
      params.status = status;
    }

    query += `] | order(_createdAt desc) {
      _id,
      _createdAt,
      _updatedAt,
      title,
      description,
      date,
      startTime,
      endTime,
      duration,
      accessType,
      status,
      enablePOAP,
      enableQuiz,
      "creator": creator->{
        _id,
        name,
        walletAddress,
        image
      }
    }`;

    const sessions = await client.fetch(query, params);

    return {
      success: true,
      data: sessions,
    };
  } catch (error) {
    console.error('Get Grow3dge sessions error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Grow3dge sessions',
    };
  }
}

/**
 * Server action to get a single Grow3dge session by ID
 */
export async function getGrow3dgeSessionById(id: string): Promise<Grow3dgeResponse> {
  try {
    if (!client) {
      throw new Error("Sanity client not configured");
    }

    if (!id) {
      throw new Error("Session ID is required");
    }

    const query = `*[_type == "grow3dgeSession" && _id == $id][0] {
      ...
    }`;

    const session = await client.fetch(query, { id });

    if (!session) {
      throw new Error("Session not found");
    }

    return {
      success: true,
      data: session,
    };
  } catch (error) {
    console.error('Get Grow3dge session error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Grow3dge session',
    };
  }
}
