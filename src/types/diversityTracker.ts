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

export interface DiversityBanner {
  title: string;
  subTitle: string;
  description: string;
  thumbnail?: SanityImage;
  background?: SanityImage;
}

export interface DiversityTracker {
  _id: string;
  title: string;
  description: string;
  banner: DiversityBanner;
}
