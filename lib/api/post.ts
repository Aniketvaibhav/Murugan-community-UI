import { Post, PostMedia } from "@/types/post"
import { getApiUrl } from "@/config"
import { api } from "@/lib/api/api"

const API_BASE_URL = getApiUrl()
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

// Toggle like/unlike a post
export async function toggleLikePost(id: string, userId: string): Promise<{ likes: string[]; likesCount: number; liked: boolean }> {
  const response = await fetch(`${API_URL}/posts/${id}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ userId }),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to like/unlike post");
  }
  return response.json();
}

// Get all likes for a post
export async function getPostLikes(id: string): Promise<{ likes: string[]; likesCount: number }> {
  const response = await fetch(`${API_URL}/posts/${id}/likes`, {
    credentials: "include",
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch post likes");
  }
  return response.json();
}

export const getPostComments = async (postId: string) => {
  const response = await api.get(`/posts/${postId}`)
  return response.data.data.post.comments
}

export const addPostComment = async (postId: string, content: string, token: string) => {
  const response = await api.post(
    `/posts/${postId}/comments`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return response.data.data.comment
}

export const deletePostComment = async (postId: string, commentId: string, token: string) => {
  await api.delete(`/posts/${postId}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return true
} 