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
    // Multiple partners support
    partners[]->{
      _id,
      name,
      logo {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background
      }
    },
    // Legacy single partner field (for backward compatibility)
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
    topicTitle,
    topicDesc,
    guidesRsvp,
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
    // Add topics array for popular topics section
    topics[]-> {
      _id,
      title,
      slug,
      icon {
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
      guidesRsvp,
      rsvpSettings,
      category->{
        _id,
        title,
        slug,
        icon {
          ...,
          "blurDataURL": asset->metadata.lqip,
          "ImageColor": asset->metadata.palette.dominant.background
        }
      },
      guideImage {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background
      },
      backgroundImage {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background
      },
      language,
      // Multiple partners support
      partners[]->{
        _id,
        name,
        logo {
          ...,
          "blurDataURL": asset->metadata.lqip,
          "ImageColor": asset->metadata.palette.dominant.background
        }
      },
      // Legacy single partner field (for backward compatibility)
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
    endDate,
    time,
    fixImage {
      ...,
      "blurDataURL": asset->metadata.lqip,
      "ImageColor": asset->metadata.palette.dominant.background
    },
    backgroundImage {
      ...,
      "blurDataURL": asset->metadata.lqip,
      "ImageColor": asset->metadata.palette.dominant.background
    },
    guideName,
    guideImage {
      ...,
      "blurDataURL": asset->metadata.lqip,
      "ImageColor": asset->metadata.palette.dominant.background
    },
    videoUrl,
    body,
    featured,
    // Enhanced RSVP Configuration
    rsvpSettings {
      enabled,
      maxCapacity,
      waitlistEnabled,
      rsvpDeadline,
      allowGuests,
      maxGuestsPerRSVP,
      requiresApproval,
      collectContactInfo
    },
    emailSettings {
      sendConfirmation,
      confirmationTemplate,
      reminderSchedule[] {
        timing,
        customMessage
      }
    },
    location {
      type,
      venue,
      address,
      virtualLink,
      accessInstructions
    },
    organizer {
      name,
      email,
      phone
    },
    // Legacy fields (for backward compatibility)
    rsvpChannelLink,
    googleCalendarUrl,
    allowCancel,
    // Multiple partners support
    partners[]->{
      _id,
      name,
      logo {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background
      }
    },
    // Legacy single partner field (for backward compatibility)
    partner->{
      _id,
      title,
      logo {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background
      }
    },
    pdfFile{asset->{url}},
    pdfGuide{
      enabled,
      title,
      type,
      downloadFile{asset->{url}},
      shareableUrl
    }
  }
`;

export const fixSessionsQuery = groq`
  *[_type == "fixxSession"]{
    _id,
    title,
    description,
    // Add new topic fields
    topicTitle,
    topicDesc,
    sessionTitle,
    sessionDescription,
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
    // Add topics array for popular topics section
    topics[]-> {
      _id,
      title,
      slug,
      icon {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background
      }
    },
    fixCards[]->{
      pdfFile{asset->{url}},
      pdfGuide{
        enabled,
        title,
        type,
        downloadFile{asset->{url}},
        shareableUrl
      },
      _id,
      fixRsvp,
      title,
      description,
      category->{_id, title, slug},
      language,
      date,
      endDate,
      time,
      fixImage {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background
      },
      backgroundImage {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background
      },
      guideName,
      guideImage {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background
      },
      videoUrl,
      body,
      featured,
      // Enhanced RSVP Configuration
      rsvpSettings {
        enabled,
        maxCapacity,
        waitlistEnabled,
        rsvpDeadline,
        allowGuests,
        maxGuestsPerRSVP,
        requiresApproval,
        collectContactInfo
      },
      emailSettings {
        sendConfirmation,
        confirmationTemplate,
        reminderSchedule[] {
          timing,
          customMessage
        }
      },
      location {
        type,
        venue,
        address,
        virtualLink,
        accessInstructions
      },
      organizer {
        name,
        email,
        phone
      },
      // Legacy fields (for backward compatibility)
      rsvpChannelLink,
      googleCalendarUrl,
      allowCancel,
      // External RSVP URLs
      guidesRsvp,
      fixRsvp,
      // Multiple partners support
      partners[]->{
        _id,
        name,
        logo {
          ...,
          "blurDataURL": asset->metadata.lqip,
          "ImageColor": asset->metadata.palette.dominant.background
        }
      },
      // Legacy single partner field (for backward compatibility)
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

export const grow3dgeIdeasLabSessionQuery = groq`
  *[_type == "grow3dgeIdeaLabsSession"][0] {
    _id,
    title,
    description,
    sessionTitle,
    sessionDescription,
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

export const grow3dgeIdeasLabCardByIdQuery = groq`
  *[_type == "grow3dgeIdeaLabCards" && _id == $id][0]{
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

export const siherGoLiveSessionsQuery = groq`
  *[_type == "siherGoLive"] | order(_createdAt desc) {
    _id,
    _createdAt,
    title,
    description,
    sessionType,
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
    status,
    "creator": {
      "name": creator->name,
      "email": creator->email,
      "image": creator->image
    }
  }
`;

export const createSiherGoLiveMutation = groq`
  *[_type == "siherGoLive" && _id == $id][0]
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

export const seoSettingsQuery = groq`
  *[_type == "seoSettings"][0] {
    _id,
    title,
    favicon {
      ...,
      "blurDataURL": asset->metadata.lqip,
      "ImageColor": asset->metadata.palette.dominant.background,
      alt
    },
    seoLogo {
      ...,
      "blurDataURL": asset->metadata.lqip,
      "ImageColor": asset->metadata.palette.dominant.background,
      alt
    },
    logo {
      ...,
      "blurDataURL": asset->metadata.lqip,
      "ImageColor": asset->metadata.palette.dominant.background,
      alt
    }
  }
`;

export const liveSessionsQuery = groq`
  *[_type == "liveSession"] | order(scheduledDate desc) {
    _id,
    title,
    description,
    scheduledDate,
    scheduledTime,
    status,
    attendeeCount,
    maxAttendees,
    speakerName,
    speakerImage {
      ...,
      "blurDataURL": asset->metadata.lqip,
      "ImageColor": asset->metadata.palette.dominant.background
    },
    thumbnail {
      ...,
      "blurDataURL": asset->metadata.lqip,
      "ImageColor": asset->metadata.palette.dominant.background,
      alt
    },
    category,
    meetingUrl,
    recordingUrl,
    proofOfAttendance
  }
`;

export const liveSessionSchemaQuery = groq`
  *[_type == "liveSessionSchema"][0] {
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
    }
  }
`;