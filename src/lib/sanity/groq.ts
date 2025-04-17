import { groq } from "next-sanity";

export const getAll = groq`*[]`;

export const sessionQuery = groq`
  *[_type == "session"] {
    _id,
    published,
    order,
    thumbnail {
     ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background,
        alt,
    },
    title,
    community-> {
      _id,
      communityName,
      communityDescription,
      communityLogo {
        asset-> {
          url
        }
      }
    },
    position,
    description,
    category,
    progress,
    overview,
    curriculum[] {
      moduleTitle,
      completed
    },
    totalModules,
    lastActivity,
    status
  }
`;

export const sessionCategoryCountQuery = groq`
  *[_type == "session"] {
    category
  } 
  | group(category) {
    "category": @._key,
    "count": count(@)
  }
`;

export const sessionByIdQuery = groq`
  *[_type == "session" && _id == $id][0] {
    _id,
    published,
    order,
    thumbnail {
     ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background,
        alt,
    },
    title,
    community->{
      _id,
      title
    },
    description,
    category,
    progress,
    overview,
    curriculum[] {
    ...,
      moduleTitle,
      completed
    },
    totalModules,
    lastActivity,
    status
  }
`;
