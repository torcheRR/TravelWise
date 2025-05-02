export interface Post {
    id: string;
    userId: string;
    caption: string;
    imageUrl?: string;
    location?: string;
    createdAt: number;
  }