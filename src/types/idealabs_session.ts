export interface IdeaLabCategory {
  _id: string;
  title: string;
  slug: { current: string };
}

export interface IdeaLabCard {
  _id: string;
  title: string;
  description: string;
  date: string;
  ideaLabImage?: any;
  videoUrl?: string;
  category?: IdeaLabCategory;
  body?: any;
}

export interface IdeaLabsSession {
  _id: string;
  title: string;
  description: string;
  banner?: {
    title?: string;
    description?: string;
    thumbnail?: any;
    background?: any;
  };
  cards: IdeaLabCard[];
}
