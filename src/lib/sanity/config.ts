export const useCdn = process.env.NODE_ENV === "production";

export const projectId: string =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  "default-project-id";

export const dataset: string =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const apiVersion: string =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-03-25";

export const previewSecretId: string | undefined =
  process.env.SANITY_REVALIDATE_SECRET;
