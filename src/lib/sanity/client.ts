import {
  apiVersion,
  dataset,
  projectId,
  useCdn,
  previewSecretId,
} from "./config";
import {
  diversityTrackerQuery,
  getAll,
  ideaLabsSessionQuery,
  ideaLabSessionByIdQuery,
  sessionByIdQuery,
  sessionCategoryCountQuery,
  sessionQuery,
  sessionSchemaByIdQuery,
  siherGuidesSessionQuery,
  fixSessionsQuery,
  communitiesQuery,
  COMMUNITY_BANNER_GROQ,
  allTopicsQuery,
  scholarsIdeasLabSessionQuery,
  scholarsIdeasLabCardByIdQuery,
  grow3dgeIdeasLabSessionQuery,
  grow3dgeIdeasLabCardByIdQuery,
  fixCardByIdQuery,
  guidesByIdQuery,
  dashboardBannerQuery,
  seoSettingsQuery,
  liveSessionsQuery,
  liveSessionSchemaQuery,
  siherGoLiveSessionsQuery,
} from "./groq";
import { createClient } from "next-sanity";

if (!projectId) {
  console.error(
    "The Sanity Project ID is not set. Check your environment variables."
  );
}

export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      // Only use token if it's available, otherwise use public access
      ...(process.env.NEXT_PUBLIC_SANITY_API_TOKEN && {
        token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
      }),
    })
  : null;

export const previewClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
    })
  : null;

import { QueryParams } from "next-sanity";

type FetchParams = QueryParams | undefined;
type FetchQuery = string;

type FetchResult<T> = Promise<T[] | T | null>;

export const fetcher = async <T = unknown>([query, params]: [
  FetchQuery,
  FetchParams
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
]): FetchResult<T> => {
  if (!client) return [];
  
  try {
    return await client.fetch<T>(query, params || {});
  } catch (error: any) {
    // Handle Sanity 401 errors gracefully without affecting authentication
    if (error?.statusCode === 401 || error?.message?.includes('Unauthorized')) {
      return [];
    }
    
    // Re-throw other errors
    throw error;
  }
};

(async () => {
  if (client) {
    try {
      const data = await client.fetch(getAll);
      if (!data || !data.length) {
        console.warn(
          "Sanity returns empty array. Are you sure the dataset is public?"
        );
      }
    } catch (error: any) {
      if (error?.statusCode === 401 || error?.message?.includes('Unauthorized')) {
        // Silently handle missing token during initialization
      } else {
        console.error('[Sanity] Error during initialization:', error);
      }
    }
  }
})();

export async function getSessionData() {
  if (client) {
    return (await client.fetch(sessionQuery)) || [];
  }
  return [];
}

export async function getSessionCategoryCont() {
  if (client) {
    return (await client.fetch(sessionCategoryCountQuery)) || [];
  }
  return [];
}

export async function getSessionById(id: string) {
  if (client) {
    return (await client.fetch(sessionByIdQuery, { id })) || {};
  }
  return {};
}

export async function getGuidesById(id: string) {
  if (client) {
    return (await client.fetch(guidesByIdQuery, { id })) || {};
  }
  return {};
}
export async function getSessionPageData() {
  if (client) {
    return (await client.fetch(sessionSchemaByIdQuery)) || {};
  }
  return {};
}

export async function getDiversityTrackerData() {
  if (client) {
    return (await client.fetch(diversityTrackerQuery)) || {};
  }
  return {};
}

export async function getSiherGuidesSessionData() {
  if (client) {
    return (await client.fetch(siherGuidesSessionQuery)) || {};
  }
  return {};
}

export async function getIdeaLabsSessionData() {
  if (client) {
    return (await client.fetch(ideaLabsSessionQuery)) || {};
  }
  return {};
}

export async function getIdeaLabSessionById(id: string) {
  if (client) {
    const result = (await client.fetch(ideaLabSessionByIdQuery, { id })) || {};

    return result;
  }
  return {};
}

export async function getFixSessions() {
  if (client) {
    return (await client.fetch(fixSessionsQuery)) || {};
  }
  return {};
}

export async function getCommunities() {
  if (client) {
    return (await client.fetch(communitiesQuery)) || [];
  }
  return [];
}

export async function getCommunityBanner() {
  if (client) {
    return (await client.fetch(COMMUNITY_BANNER_GROQ)) || {};
  }
  return {};
}

export async function getAllTopics() {
  if (client) {
    return (await client.fetch(allTopicsQuery)) || [];
  }
  return [];
}

export async function getScholarsIdeasLabSessionData() {
  if (client) {
    return (await client.fetch(scholarsIdeasLabSessionQuery)) || {};
  }
  return {};
}

export async function getScholarsIdeasLabCardById(id: string) {
  if (client) {
    return (await client.fetch(scholarsIdeasLabCardByIdQuery, { id })) || {};
  }
  return {};
}

export async function getGrow3dgeIdeasLabSessionData() {
  if (client) {
    return (await client.fetch(grow3dgeIdeasLabSessionQuery)) || {};
  }
  return {};
}

export async function getGrow3dgeIdeasLabCardById(id: string) {
  if (client) {
    return (await client.fetch(grow3dgeIdeasLabCardByIdQuery, { id })) || {};
  }
  return {};
}

export async function getFixCardById(id: string) {
  if (!client) throw new Error("Sanity client not configured");
  return client.fetch(fixCardByIdQuery(id));
}

export async function getDashboardBanner() {
  if (client) {
    return (await client.fetch(dashboardBannerQuery)) || {};
  }
  return {};
}

export async function getSeoSettings() {
  if (client) {
    return (await client.fetch(seoSettingsQuery)) || {};
  }
  return {};
}

export async function getSiherGoLive() {
  if (client) {
    return (await client.fetch(seoSettingsQuery)) || {};
  }
  return {};
}

export async function getLiveSessionsData() {
  if (client) {
    return (await client.fetch(liveSessionsQuery)) || [];
  }
  return [];
}

export async function getLiveSessionSchema() {
  if (client) {
    return (await client.fetch(liveSessionSchemaQuery)) || {};
  }
  return {};
}

// Get all SIHER Go Live sessions
export async function getSiherGoLiveSessions(accessType?: string) {
  if (client) {
    try {
      // If accessType is provided, filter by it; otherwise fetch all
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
        creator,
        _createdAt,
        _updatedAt
      }`;

      const query = accessType
        ? `*[_type == "siherGoLive" && accessType == $accessType] | order(_createdAt desc) ${baseFields}`
        : `*[_type == "siherGoLive"] | order(_createdAt desc) ${baseFields}`;

      return (await client.fetch(query, accessType ? { accessType } : {})) || [];
    } catch (error) {
      console.error('Error fetching SIHER Go Live sessions:', error);
      return [];
    }
  }
  return [];
}

// Create a new SIHER Go Live session
export async function createSiherGoLiveSession(sessionData: any) {
  if (!client) throw new Error("Sanity client not configured");
  
  const sessionWithMetadata = {
    ...sessionData,
    _type: 'siherGoLive',
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
  };

  // Remove the creator reference since we're just storing the ID as a string
  if (sessionWithMetadata.creator && typeof sessionWithMetadata.creator === 'object') {
    sessionWithMetadata.creator = sessionWithMetadata.creator._ref || sessionWithMetadata.creator;
  }

  return client.create(sessionWithMetadata);
}

// Update an existing SIHER Go Live session
export async function updateSiherGoLiveSession(id: string, updates: any) {
  if (!client) throw new Error("Sanity client not configured");
  
  return client
    .patch(id)
    .set({
      ...updates,
      _updatedAt: new Date().toISOString()
    })
    .commit();
}

// Delete a SIHER Go Live session
export async function deleteSiherGoLiveSession(id: string) {
  if (!client) throw new Error("Sanity client not configured");
  return client.delete(id);
}
