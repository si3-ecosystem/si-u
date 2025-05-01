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
    company,
    videoUrl,
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
    status,
     tags[]-> {
      _id,
      title,
      slug
    },
    speakerName,
    speakerImage {
      ...,
      "blurDataURL": asset->metadata.lqip,
      "ImageColor": asset->metadata.palette.dominant.background
    }
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
    videoUrl,
    curriculum[] {
    ...,
      moduleTitle,
      completed
    },
    totalModules,
    lastActivity,
    status,
       speakerName,
    speakerImage {
      ...,
      "blurDataURL": asset->metadata.lqip,
      "ImageColor": asset->metadata.palette.dominant.background
    }
  }
`;

export const sessionSchemaByIdQuery = groq`
  *[_type == "sessionSchema" ][0] {
    _id,
    title,
   banner-> {
      ...,
      thumbnail {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background,
        alt
      },
      background {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background,
        alt
      }
    },
    description,
    topics[]-> {
      title,
      categoryKey,
      description,
      "icon":thumbnail {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background,
        alt,
      }
    },
     
    siutitle,
    siudescription,
     speakerName,
    speakerImage {
      ...,
      "blurDataURL": asset->metadata.lqip,
      "ImageColor": asset->metadata.palette.dominant.background
    }
   
  }
`;

export const diversityTrackerQuery = groq`
  *[_type == "diversityTrackerSchema"] [0] {
    _id,
    title,
    description,
    banner -> {
      title,
      subTitle,
      description,
      thumbnail {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background,
        alt
      },
      background {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background,
        alt
      }
    }
  }
`;

export const siherGuidesSessionQuery = groq`
  *[_type == "siherGuidesSession"][0] {
    _id,
    title,
    description,
    banner->{
      title,
      description,
      thumbnail {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background
      },
      background {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background
      }
    },
    "guides": guides[]->{
      _id,
      title,
      description,
      date,
      time,
      guideName,
      guideImage {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background
      },
      language,
      partner->{
        _id,
        title,
        ...,
        logo
      },
      videoUrl,
      featured,
      rsvpChannelLink,
      googleCalendarUrl,
      allowCancel
    }
  }
`;

export const ideaLabsSessionQuery = groq`
  *[_type == "ideaLabsSession"][0] {
    _id,
    title,
    description,
    banner->{
      title,
      description,
      thumbnail {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background
      },
      background {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background
      }
    },
    "cards": ideaLabCards[]-> {
      _id,
      title,
      description,
      date,
      ideaLabImage {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background
      },
      videoUrl,
      category-> {
        _id,
        title,
        slug
      },
      body
    }
  }
`;

export const ideaLabSessionByIdQuery = groq`
  *[_type == "ideaLabCards" && _id == $id][0]{
  ...,
    _id,
    title,
    description,
    publishedAt,
    ideaLabImage,
    body
  }
`;

export const fixSessionsQuery = groq`
  *[_type == "fixxSession"]{
    _id,
    title,
    description,
    banner->{_id, title, image},
    fixCards[]->{
      _id,
      title,
      description,
      category->{_id, title, slug},
      language,
      date,
      time,
      fixImage,
      guideName,
      guideImage,
      videoUrl,
      body,
      rsvpChannelLink,
      googleCalendarUrl,
      allowCancel,
      partner->{
        _id,
        title,
        ...,
        logo
      },
    }
  } | order(fixCards[0].date desc)
`;
