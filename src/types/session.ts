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

export interface Tag {
  _id: string;
  title: string;
  slug: string;
}

export interface Session {
  _id: string;
  published: boolean;
  order: number;
  thumbnail: SanityImage;
  title: string;
  company?: string;
  videoUrl?: string;
  community: {
    _id: string;
    communityName: string;
    communityDescription: string;
    communityLogo: SanityImage;
  } | null;
  position: string;
  description: string;
  category: "blockchain" | "nfts" | "cryptocurrency" | "defi";
  tags: Tag[];
  progress: number;
  overview: string;
  curriculum: {
    moduleTitle: string;
    completed: boolean;
  }[];
  totalModules: number;
  lastActivity: string | null;
  status: "in_progress" | "completed" | "not_started";
  speakerName?: string;
  speakerImage: SanityImage | null;
}

export interface SessionCategoryCount {
  category: string;
  count: number;
}

export interface Topic {
  title: string;
  description: string;
  categoryKey: string;
  icon: SanityImage;
}

export interface SessionBanner {
  title: string;
  description: string;
  thumbnail: SanityImage;
  background: SanityImage;
}

export interface SessionSchema {
  _id: string;
  title: string;
  banner: SessionBanner;
  description: string;
  topics: Topic[];
  siutitle: string;
  siudescription: string;
  siusessions: Session[];
}
