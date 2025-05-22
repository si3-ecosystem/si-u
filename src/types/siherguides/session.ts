// Types for SI HER Guides Session
import type { SanityImage } from "@/types/session";

export interface GuidesSessionBanner {
  title: string;
  description: string;
  thumbnail?: SanityImage;
  background?: SanityImage;
}

export interface GuidesSession {
  _id: string;
  title: string;
  description: string;
  date?: string;
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
