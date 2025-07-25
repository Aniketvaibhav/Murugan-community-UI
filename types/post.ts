export interface PostMedia {
  id: string
  type: "image" | "video"
  url: string
  file?: File
}

export interface PostComment {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar: string
    username: string
  }
  createdAt: string
}

export interface PostTag {
  id: string
  name: string
}

export interface Post {
  id: string
  content: string
  media: PostMedia[]
  author: {
    id: string
    name: string
    avatar: string
    username: string
  }
  createdAt: string
  likes: string[]
  likesCount: number
  comments: PostComment[]
  tags: PostTag[]
  isLiked?: boolean
}
