"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Icons } from "@/components/icons"
import { Camera, MapPin, Calendar, X } from "lucide-react"
import axios from 'axios'
import { format } from "date-fns"
import { getApiUrl } from "@/config"

// API configuration
const API_URL = `${getApiUrl()}/api`
const BACKEND_URL = API_URL.replace('/api', '') // Remove /api to get base URL

interface UserProfile {
  _id: string;
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

export default function EditProfilePage() {
  const { user, isAuthenticated, updateUserData } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false)

  // Initialize form state
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [profileImage, setProfileImage] = useState<string>("/placeholder.svg?height=128&width=128")
  const [coverImage, setCoverImage] = useState<string>("/placeholder.svg?height=300&width=1200")
  const [joinedDate, setJoinedDate] = useState<string | null>(null)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)

  // Refs for file inputs
  const profileImageInputRef = useRef<HTMLInputElement>(null)
  const coverImageInputRef = useRef<HTMLInputElement>(null)

  // Set initial form data from user context
  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setUsername(user.username || "")
      setBio(user.bio || "")
      setLocation(user.location || "")
      setProfileImage(user.avatar || "/placeholder.svg?height=128&width=128")
      setCoverImage(user.coverImage || "/placeholder.svg?height=300&width=1200")
      if (user.createdAt) {
        setJoinedDate(format(new Date(user.createdAt), 'MMMM yyyy'))
      }
    }
  }, [user])

  // Fetch user data
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login")
      return
    }

    if (!hasAttemptedFetch && isAuthenticated) {
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem('token')
          if (!token) {
            router.push('/login')
            return
          }

          const response = await axios.get(`${API_URL}/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          console.log('API Response:', response.data)

          if (!response.data?.data?.user) {
            throw new Error('Invalid response format')
          }

          const userData = response.data.data.user

          console.log('Processing user data:', userData)

          // Update form fields
          setName(userData.name)
          setUsername(userData.username)
          setBio(userData.bio || "")
          setLocation(userData.location || "")

          // Handle image URLs
          const avatarUrl = userData.avatar ? 
            (userData.avatar.startsWith('http') ? userData.avatar : `${BACKEND_URL}${userData.avatar}`) :
            "/placeholder.svg?height=128&width=128"
          
          const coverImageUrl = userData.coverImage ?
            (userData.coverImage.startsWith('http') ? userData.coverImage : `${BACKEND_URL}${userData.coverImage}`) :
            "/placeholder.svg?height=300&width=1200"

          setProfileImage(avatarUrl)
          setCoverImage(coverImageUrl)

          if (userData.createdAt) {
            setJoinedDate(format(new Date(userData.createdAt), 'MMMM yyyy'))
          }

          // Update auth context
          updateUserData({
            ...userData,
            id: userData._id,
            avatar: avatarUrl,
            coverImage: coverImageUrl
          })

          console.log('Form state updated:', {
            name: userData.name,
            username: userData.username,
            bio: userData.bio,
            location: userData.location
          })

        } catch (error: any) {
          console.error('Error details:', error.response || error)
          toast({
            title: "Error loading profile",
            description: error.response?.data?.message || "Failed to load user data",
            variant: "destructive",
          })
          
          if (error.response?.status === 401) {
            router.push('/login')
          }
        } finally {
          setIsLoading(false)
          setHasAttemptedFetch(true)
        }
      }

      fetchUserData()
    }
  }, [isAuthenticated, hasAttemptedFetch, router, toast, updateUserData])

  console.log('Render state:', { isLoading, isAuthenticated })

  const handleProfileImageClick = () => {
    profileImageInputRef.current?.click()
  }

  const handleCoverImageClick = () => {
    coverImageInputRef.current?.click()
  }

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImageFile(file)
      const imageUrl = URL.createObjectURL(file)
      setProfileImage(imageUrl)
    }
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImageFile(file)
      const imageUrl = URL.createObjectURL(file)
      setCoverImage(imageUrl)
    }
  }

  const handleRemoveProfileImage = () => {
    setProfileImage("/placeholder.svg?height=128&width=128")
    setProfileImageFile(null)
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = ""
    }
  }

  const handleRemoveCoverImage = () => {
    setCoverImage("/placeholder.svg?height=300&width=1200")
    setCoverImageFile(null)
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !username.trim()) {
      toast({
        title: "Missing information",
        description: "Name and username are required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token')
      }

      // Create form data for file upload
      const formData = new FormData()
      formData.append('name', name)
      formData.append('username', username)
      formData.append('bio', bio)
      formData.append('location', location)
      
      if (profileImageFile) {
        formData.append('avatar', profileImageFile)
      }
      if (coverImageFile) {
        formData.append('coverImage', coverImageFile)
      }

      // Update profile
      const response = await axios.put(`${API_URL}/users/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.data.user) {
        const updatedUserData = {
          ...response.data.data.user,
          id: response.data.data.user._id,
          avatar: response.data.data.user.avatar ? 
            (response.data.data.user.avatar.startsWith('http') ? 
              response.data.data.user.avatar : 
              `${BACKEND_URL}${response.data.data.user.avatar}`
            ) : undefined,
          coverImage: response.data.data.user.coverImage ? 
            (response.data.data.user.coverImage.startsWith('http') ? 
              response.data.data.user.coverImage : 
              `${BACKEND_URL}${response.data.data.user.coverImage}`
            ) : undefined
        }
        
        updateUserData(updatedUserData)
        
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated",
        })

        router.push("/profile")
      }
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      })

      if (error.response?.status === 401) {
        router.push('/login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-center p-8">
            <Icons.spinner className="h-8 w-4 animate-spin" />
            <span className="ml-2">Loading profile...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Router will redirect to login
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
          <p className="mt-2 text-muted-foreground">Update your personal information and profile images</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Cover Image Section */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-48 w-full overflow-hidden rounded-lg sm:h-64">
                {coverImage && (
                  <Image src={coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                  <Button type="button" variant="secondary" size="sm" className="gap-1" onClick={handleCoverImageClick}>
                    <Camera className="h-4 w-4" />
                    Change Cover
                  </Button>
                  {coverImageFile && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="ml-2 gap-1"
                      onClick={handleRemoveCoverImage}
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
              <input
                ref={coverImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverImageChange}
              />
            </CardContent>
          </Card>

          {/* Profile Image Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Image</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-32 w-32 cursor-pointer border-4 border-background">
                  <AvatarImage 
                    src={profileImage} 
                    alt="Profile"
                    onError={() => setProfileImage("/placeholder.svg?height=128&width=128")}
                  />
                  <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="gap-1"
                    onClick={handleProfileImageClick}
                  >
                    <Camera className="h-4 w-4" />
                    Change
                  </Button>
                </div>
              </div>
              {profileImageFile && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 gap-1"
                  onClick={handleRemoveProfileImage}
                >
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              )}
              <input
                ref={profileImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
              />
            </CardContent>
          </Card>

          {/* Personal Information Section */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Your location"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Joined Date</Label>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{joinedDate || 'Loading...'}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4 border-t p-6">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
