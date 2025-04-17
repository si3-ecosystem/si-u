export interface SanityImage {
  _type: string;
  asset: {
    _ref: string;
    _type: string;
  };
  blurDataURL?: string;
  ImageColor?: string;
  alt?: string;
}

export interface Session {
  _id: string;
  published: boolean;
  order: number;
  thumbnail: SanityImage;
  title: string;
  community: {
    _id: string;
    communityName: string;
    communityDescription: string;
    communityLogo: {
      asset: {
        url: string;
      };
    } | null;
  } | null;
  position: string;
  description: string;
  category: "blockchain" | "nfts" | "cryptocurrency" | "defi";
  progress: number;
  overview: string;
  curriculum: {
    moduleTitle: string;
    completed: boolean;
  }[];
  totalModules: number;
  lastActivity: string | null;
  status: "in_progress" | "completed" | "not_started";
}

export interface SessionCategoryCount {
  category: string;
  count: number;
}
