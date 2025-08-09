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
  guideImage?: SanityImage;
  language?: string;
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
}

export interface SiherGuidesSession {
  _id: string;
  title: string;
  description: string;
  banner?: GuidesSessionBanner;
  guides: GuidesSession[];
}
