import { Post, PostMedia } from "@/types/post"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
const API_URL = `${API_BASE_URL}/api`

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    Authorization: token ? `Bearer ${token}` : "",
  }
}

// Helper function to get full media URL
export const getMediaUrl = (url: string) => {
  if (url.startsWith('http')) return url
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

export async function createPost(data: {
  content: string
  media: PostMedia[]
  tags: string[]
}): Promise<Post> {
  const formData = new FormData()
  formData.append("content", data.content)
  formData.append("tags", data.tags.join(","))

  // Append media files
  data.media.forEach((item, index) => {
    if (item.file) {
      formData.append("media", item.file)
    }
  })

  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      ...getAuthHeaders(),
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Please log in to create a post")
    }
    throw new Error("Failed to create post")
  }

  const result = await response.json()
  return result.data
}

export async function getPosts(page = 1, limit = 10): Promise<{
  posts: Post[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}> {
  const response = await fetch(
    `${API_URL}/posts?page=${page}&limit=${limit}`,
    {
      credentials: "include",
      headers: {
        ...getAuthHeaders(),
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch posts")
  }

  const result = await response.json()
  return result.data // Extract from the data property
}

export async function getPost(id: string): Promise<Post> {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    credentials: "include",
    headers: {
      ...getAuthHeaders(),
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch post")
  }

  return response.json()
}

export async function updatePost(id: string, data: {
  content: string
  tags: string[]
}): Promise<Post> {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to update post")
  }

  return response.json()
}

export async function deletePost(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      ...getAuthHeaders(),
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete post")
  }
}

export async function likePost(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/posts/${id}/like`, {
    method: "POST",
    credentials: "include",
    headers: {
      ...getAuthHeaders(),
    },
  })

  if (!response.ok) {
    throw new Error("Failed to like post")
  }
}

export async function unlikePost(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/posts/${id}/like`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      ...getAuthHeaders(),
    },
  })

  if (!response.ok) {
    throw new Error("Failed to unlike post")
  }
}

export async function addComment(id: string, content: string): Promise<void> {
  const response = await fetch(`${API_URL}/posts/${id}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ content }),
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to add comment")
  }
}

export async function deleteComment(postId: string, commentId: string): Promise<void> {
  const response = await fetch(`${API_URL}/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      ...getAuthHeaders(),
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete comment")
  }
} 