import { Blog, BlogResponse, PaginatedResponse } from "@/types/blog"
import { api } from "./api"

export const getBlogs = async (page = 1, limit = 10, category?: string, search?: string) => {
  let url = `/blogs?page=${page}&limit=${limit}`
  if (category) url += `&category=${category}`
  if (search) url += `&search=${search}`
  const response = await api.get<PaginatedResponse<Blog>>(url)
  return response.data
}

export const getBlog = async (id: string) => {
  const response = await api.get<BlogResponse>(`/blogs/${id}`)
  return response.data
}

export const createBlog = async (formData: FormData) => {
  const response = await api.post<BlogResponse>("/blogs", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

export const updateBlog = async (id: string, data: Partial<Blog>) => {
  const response = await api.put<BlogResponse>(`/blogs/${id}`, data)
  return response.data
}

export const deleteBlog = async (id: string) => {
  const response = await api.delete<{ message: string }>(`/blogs/${id}`)
  return response.data
}

export const likeBlog = async (id: string) => {
  const response = await api.post<BlogResponse>(`/blogs/${id}/like`)
  return response.data
}

export const unlikeBlog = async (id: string) => {
  const response = await api.delete<BlogResponse>(`/blogs/${id}/like`)
  return response.data
}

export const getCategories = async () => {
  const response = await api.get<{ data: { categories: string[] } }>("/blogs/categories")
  return response.data
}

export const getBlogLikes = async (id: string): Promise<{ likes: string[]; likesCount: number }> => {
  const response = await api.get(`/blogs/${id}/likes`);
  return response.data;
};

export const toggleLikeBlog = async (id: string, userId: string): Promise<{ likes: string[]; likesCount: number; liked: boolean }> => {
  const response = await api.post(`/blogs/${id}/like`, { userId });
  return response.data;
};

export const getBlogComments = async (blogId: string) => {
  const response = await api.get(`/blogs/${blogId}`)
  return response.data.data.blog.comments
}

export const addBlogComment = async (blogId: string, content: string, token: string) => {
  const response = await api.post(
    `/blogs/${blogId}/comments`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return response.data.data.comment
}

export const deleteBlogComment = async (blogId: string, commentId: string, token: string) => {
  await api.delete(`/blogs/${blogId}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return true
} 