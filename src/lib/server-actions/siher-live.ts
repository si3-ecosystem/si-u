"use server";

import { revalidatePath, revalidateTag } from 'next/cache';
import { client } from '@/lib/sanity/client';

export interface SiherLiveSessionData {
  title: string;
  description: string;
  sessionType: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  timezone: string;
  accessType: string;
  maxParticipants: string;
  proofOfAttendance: boolean;
  claimMethod: string;
  nftTitle?: string;
  claimOpens?: string;
  claimCloses?: string;
  attendanceRequirement: string;
  unlockEventLink?: string;
  huddle01Link?: string;
  creator?: any;
}

export interface SiherLiveResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

/**
 * Server action to create a new SIHER Go Live session
 */
export async function createSiherLiveSession(sessionData: SiherLiveSessionData): Promise<SiherLiveResponse> {
  try {
    if (!client) {
      throw new Error("Sanity client not configured");
    }

    const sessionWithMetadata = {
      ...sessionData,
      _type: 'siherGoLive',
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
    };

    // Handle creator reference properly
    if (sessionWithMetadata.creator && typeof sessionWithMetadata.creator === 'object') {
      sessionWithMetadata.creator = sessionWithMetadata.creator._ref || sessionWithMetadata.creator;
    }

    const result = await client.create(sessionWithMetadata);

    // Revalidate cache immediately
    revalidateTag('siherGoLive');
    revalidatePath('/siher-live');

    return {
      success: true,
      data: result,
      message: 'Session created successfully',
    };
  } catch (error) {
    console.error('Create session error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create session',
    };
  }
}

/**
 * Server action to update an existing SIHER Go Live session
 */
export async function updateSiherLiveSession(id: string, updates: Partial<SiherLiveSessionData>): Promise<SiherLiveResponse> {
  try {
    if (!client) {
      throw new Error("Sanity client not configured");
    }

    if (!id) {
      throw new Error("Session ID is required");
    }

    const result = await client
      .patch(id)
      .set({
        ...updates,
        _updatedAt: new Date().toISOString()
      })
      .commit();

    // Revalidate cache immediately
    revalidateTag('siherGoLive');
    revalidatePath('/siher-live');

    return {
      success: true,
      data: result,
      message: 'Session updated successfully',
    };
  } catch (error) {
    console.error('Update session error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update session',
    };
  }
}

/**
 * Server action to delete a SIHER Go Live session
 */
export async function deleteSiherLiveSession(id: string): Promise<SiherLiveResponse> {
  try {
    if (!client) {
      throw new Error("Sanity client not configured");
    }

    if (!id) {
      throw new Error("Session ID is required");
    }

    const result = await client.delete(id);

    // Revalidate cache immediately
    revalidateTag('siherGoLive');
    revalidatePath('/siher-live');

    return {
      success: true,
      data: result,
      message: 'Session deleted successfully',
    };
  } catch (error) {
    console.error('Delete session error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete session',
    };
  }
}

/**
 * Server action to get SIHER Go Live sessions
 */
export async function getSiherLiveSessionsAction(accessType?: string): Promise<SiherLiveResponse> {
  try {
    if (!client) {
      throw new Error("Sanity client not configured");
    }

    const baseFields = `{
      _id,
      title,
      description,
      status,
      date,
      startTime,
      endTime,
      duration,
      timezone,
      accessType,
      maxParticipants,
      proofOfAttendance,
      claimMethod,
      nftTitle,
      claimOpens,
      claimCloses,
      attendanceRequirement,
      unlockEventLink,
      huddle01Link,
      creator,
      _createdAt,
      _updatedAt
    }`;

    const query = accessType
      ? `*[_type == "siherGoLive" && accessType == $accessType] | order(_createdAt desc) ${baseFields}`
      : `*[_type == "siherGoLive"] | order(_createdAt desc) ${baseFields}`;

    const sessions = await client.fetch(query, accessType ? { accessType } : {});

    return {
      success: true,
      data: sessions || [],
    };
  } catch (error) {
    console.error('Get sessions error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get sessions',
      data: [],
    };
  }
}