export interface BlogMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export interface BlogComment {
  id: string;
  author: BlogAuthor;
  content: string;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  author: BlogAuthor;
  likes: number;
  comments: BlogComment[];
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean;
  media: BlogMedia[];
}

export interface BlogResponse {
  data: {
    blog: Blog;
  };
}

export interface PaginatedResponse<T> {
  data: {
    blogs: T[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
} 