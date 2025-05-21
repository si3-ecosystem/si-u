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
  fixCardByIdQuery,
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
    })
  : null;

export const previewClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      token: previewSecretId,
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
  return client ? await client.fetch<T>(query, params || {}) : [];
};

(async () => {
  if (client) {
    const data = await client.fetch(getAll);
    if (!data || !data.length) {
      console.error(
        "Sanity returns empty array. Are you sure the dataset is public?"
      );
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

export async function getFixCardById(id: string) {
  if (!client) throw new Error("Sanity client not configured");
  return client.fetch(fixCardByIdQuery(id));
}
