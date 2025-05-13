"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"
import { getApiUrl } from "@/config"

const API_URL = `${getApiUrl()}/api`
const BACKEND_URL = API_URL.replace('/api', '') // Remove /api to get base URL

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  location: string;
  avatar?: string;
  coverImage?: string;
  createdAt: string;
  followers: number;
  following: number;
  posts: number;
}

type AuthUser = User | null;

type AuthContextType = {
  user: AuthUser;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, username: string, email: string, password: string, passwordConfirm: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (userData: User) => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setLoading(false)
          return
        }
        
        // Instead of /auth/me, we'll decode the JWT token to get basic user info
        // and set the authenticated state. The full user data will be loaded
        // when needed by specific components.
        try {
          // Basic validation of token format
          const tokenParts = token.split('.')
          if (tokenParts.length !== 3) {
            throw new Error('Invalid token format')
          }
          
          // Set authenticated state if token exists and has valid format
          setIsAuthenticated(true)
          setLoading(false)
        } catch (err) {
          console.error('Invalid token:', err)
          localStorage.removeItem("token")
          setUser(null)
          setIsAuthenticated(false)
          setLoading(false)
        }
      } catch (err) {
        localStorage.removeItem("token")
        setUser(null)
        setIsAuthenticated(false)
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.post(`${API_URL}/auth/login`, { email, password })
      const { token, user: userData } = response.data.data
      localStorage.setItem("token", token)
      setUser({
        id: userData._id,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        bio: userData.bio || "",
        location: userData.location || "",
        avatar: userData.avatar ? (userData.avatar.startsWith('http') ? userData.avatar : `${BACKEND_URL}${userData.avatar}`) : undefined,
        coverImage: userData.coverImage ? (userData.coverImage.startsWith('http') ? userData.coverImage : `${BACKEND_URL}${userData.coverImage}`) : undefined,
        createdAt: userData.createdAt,
        followers: userData.followers || 0,
        following: userData.following || 0,
        posts: userData.posts || 0
      })
      setIsAuthenticated(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, username: string, email: string, password: string, passwordConfirm: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.post(`${API_URL}/auth/register`, { 
        name, 
        username, 
        email, 
        password, 
        passwordConfirm 
      })
      const { token, user: userData } = response.data.data
      localStorage.setItem("token", token)
      setUser({
        id: userData._id,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        bio: userData.bio || "",
        location: userData.location || "",
        avatar: userData.avatar ? (userData.avatar.startsWith('http') ? userData.avatar : `${BACKEND_URL}${userData.avatar}`) : undefined,
        coverImage: userData.coverImage ? (userData.coverImage.startsWith('http') ? userData.coverImage : `${BACKEND_URL}${userData.coverImage}`) : undefined,
        createdAt: userData.createdAt,
        followers: userData.followers || 0,
        following: userData.following || 0,
        posts: userData.posts || 0
      })
      setIsAuthenticated(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (token) {
        await axios.post(`${API_URL}/auth/logout`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
      localStorage.removeItem("token")
      setUser(null)
      setIsAuthenticated(false)
    } catch (err: any) {
      // Even if the logout request fails, we still want to clear the local state
      localStorage.removeItem("token")
      setUser(null)
      setIsAuthenticated(false)
      setError(err.response?.data?.message || 'Logout failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateUserData = (userData: User) => {
    setUser({
      ...userData
    });
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        login, 
        register, 
        logout,
        updateUserData,
        loading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
