// Types for SI HER Guides Session
import type { SanityImage } from "@/types/session";

export interface GuidesSessionBanner {
  title: string;
  description: string;
  thumbnail?: SanityImage;
  background?: SanityImage;
}

// RSVP Settings Interface
export interface RSVPSettings {
  enabled: boolean;
  maxCapacity?: number;
  waitlistEnabled: boolean;
  rsvpDeadline?: string;
  allowGuests: boolean;
  maxGuestsPerRSVP: number;
  requiresApproval: boolean;
  collectContactInfo: boolean;
}

// Email Settings Interface
export interface EmailSettings {
  sendConfirmation: boolean;
  confirmationTemplate?: string;
  reminderSchedule?: Array<{
    timing: '1_week' | '24_hours' | '1_day' | '2_hours';
    customMessage?: string;
  }>;
}

// Location Interface
export interface SessionLocation {
  type: 'virtual' | 'physical' | 'hybrid';
  venue?: string;
  address?: string;
  virtualLink?: string;
  accessInstructions?: string;
}

// Organizer Interface
export interface SessionOrganizer {
  name: string;
  email: string;
  phone?: string;
}

export interface GuidesSession {
  _id: string;
  title: string;
  description: string;
  date?: string;
  endDate?: string;
  time?: string;
  guideName: string;
  guideImage?: SanityImage | undefined;
  language?: string;
  // Updated to support multiple partners
  partners?: Array<{
    _id: string;
    name: string;
    title?: string; // Keep for backward compatibility
    logo: SanityImage;
  }>;
  // Legacy single partner field (deprecated but kept for backward compatibility)
  partner?: {
    _id: string;
    title: string;
    logo: SanityImage;
  };
  videoUrl?: string;
  featured?: boolean;

  // Enhanced RSVP Configuration
  rsvpSettings?: RSVPSettings;
  emailSettings?: EmailSettings;
  location?: SessionLocation;
  organizer?: SessionOrganizer;

  // Legacy fields (deprecated but kept for backward compatibility)
  rsvpChannelLink?: string;
  googleCalendarUrl?: string;
  fixImage?: SanityImage;
  allowCancel?: boolean;
  pdfFile?: {
    asset: {
      url: string;
      _type?: string;
      _ref?: string;
    };
  };
  // Enhanced PDF Guide Configuration
  pdfGuide?: {
    enabled: boolean;
    title: string; // Editable CTA text
    type: 'download' | 'url'; // Type of action
    downloadFile?: {
      asset: {
        url: string;
        _type?: string;
        _ref?: string;
      };
    };
    shareableUrl?: string; // URL for sharing
  };
}

export interface SiherGuidesSession {
  _id: string;
  title: string;
  description: string;
  banner?: GuidesSessionBanner;
  guides: GuidesSession[];
}

// Grow3dge Category Interface
export interface Grow3dgeCategory {
  _id: string;
  title: string;
  slug: {
    current: string;
    _type?: string;
  };
  icon?: SanityImage;
}

// Grow3dge Session Interface
export interface Grow3dgeSession {
  _id: string;
  title: string;
  description: string;
  topicTitle: string;
  sessionTitle:string;
  sessionDescription:string;
  topicDesc: string;
  banner?: GuidesSessionBanner;
  topics?: Grow3dgeCategory[]; // Changed to array
  fixCards: FixCard[];
}

// Fix Card Interface (for grow3dge sessions)
export interface FixCard {
  _id: string;
  title: string;
  description: string;
  category?: Grow3dgeCategory;
  language?: string;
  date?: string;
  time?: string;
  fixImage?: SanityImage;
  guideName?: string;
  guideImage?: SanityImage;
  backgroundImage?: SanityImage;
  videoUrl?: string;
  body?: any;
  rsvpChannelLink?: string;
  googleCalendarUrl?: string;
  allowCancel?: boolean;
  // Updated to support multiple partners
  partners?: Array<{
    _id: string;
    name: string;
    title?: string;
    logo: SanityImage;
  }>;
  // Legacy single partner field (deprecated but kept for backward compatibility)
  partner?: {
    _id: string;
    title: string;
    logo: SanityImage;
  };
  pdfFile?: {
    asset: {
      url: string;
      _type?: string;
      _ref?: string;
    };
  };
  pdfGuide?: {
    enabled: boolean;
    title: string;
    type: 'download' | 'url';
    downloadFile?: {
      asset: {
        url: string;
        _type?: string;
        _ref?: string;
      };
    };
    shareableUrl?: string;
  };
}
