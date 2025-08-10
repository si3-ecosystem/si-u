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
    ...,
     topic-> {
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

export const guidesByIdQuery = groq`
  *[_type == "guidesSession" && _id == $id][0] {
  ...,
      _id,
    title,
    description,
    date,
    time,
    guideName,
    guideImage {
      ...,
      "blurDataURL": asset->metadata.lqip,
      "ImageColor": asset->metadata.palette.dominant.background,
      alt
    },
    language,
    partner->{
      _id,
      name,
      logo {
        ...,
        "blurDataURL": asset->metadata.lqip
      }
    },
    videoUrl,
    featured,
    rsvpChannelLink,
    googleCalendarUrl,
    allowCancel
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

export const fixCardByIdQuery = (id: string) => `
  *[_type == "fixCards" && _id == "${id}"][0]{
    _id,
    title,
    description,
    category->{_id, title, slug},
    language,
    date,
    time,
    fixImage{
      asset->{url}
    },
    guideName,
    guideImage{
      asset->{url}
    },
    videoUrl,
    body,
    rsvpChannelLink,
    googleCalendarUrl,
    allowCancel,
    partner->{_id, title, logo},
    downloadPdf,
    pdfFile{asset->{url}},
  }
`;

export const fixSessionsQuery = groq`
  *[_type == "fixxSession"]{
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
    fixCards[]->{
  pdfFile{asset->{url}},
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

export const communitiesQuery = groq`
  *[_type == "cards" && published == true] | order(communityName asc){
    _id,
    published,
    order,
    background,
    communityLogo,
    communityName,
    communityType,
    communityLocation,
    communityDescription,
    communityWebsite,
    communityLeaderName,
    communityLeaderEmail,
    xHandle,
    linkedXHandle,
    linkedIn,
    discover
  }
`;

export const COMMUNITY_BANNER_GROQ = `*[_type == "communitySchema"][0].banner{
  title,
  description,
  thumbnail,
  background,
  ctaText
}`;

export const allTopicsQuery = groq`
  *[_type == "topic"]{
    _id,
    title,
    slug
  }
`;

export const scholarsIdeasLabSessionQuery = groq`
  *[_type == "sessionsIdeaLabsSession"][0] {
    _id,
    title,
    description,
    banner-> {
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

export const scholarsIdeasLabCardByIdQuery = groq`
  *[_type == "sessionsIdeaLabCards" && _id == $id][0]{
    ...,
    _id,
    title,
    description,
    publishedAt,
    date,
    ideaLabImage,
    body
  }
`;


export const dashboardBannerQuery = groq`
  *[_type == "dashboardSchema"][0] {
    _id,
    title,
    banner-> {
      title,
      background {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background
      }
    },
  }
`;