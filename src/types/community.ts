import { SanityImage } from "./diversityTracker";

export interface Community {
  _id: string;
  linkedXHandle: string;
  published: boolean;
  order: number;
  background: SanityImage;
  communityLogo: SanityImage;
  communityName: string;
  communityType: string[];
  communityLocation: string;
  communityDescription: string;
  communityWebsite: string;
  communityLeaderName: string;
  communityLeaderEmail: string;
  xHandle: string;
  linkedIn: string;
  discover: string;
}
