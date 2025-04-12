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

export default function EditProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)

  // Refs for file inputs
  const profileImageInputRef = useRef<HTMLInputElement>(null)
  const coverImageInputRef = useRef<HTMLInputElement>(null)

  // Load user data on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      setName(user.name || "")
      setUsername(user.username || "")
      setBio(
        "Devoted follower of Lord Murugan. Passionate about sharing spiritual experiences and connecting with fellow devotees.",
      )
      setLocation("Chennai, Tamil Nadu")
      setProfileImage(user.avatar || "/placeholder.svg?height=128&width=128")
      setCoverImage("/placeholder.svg?height=300&width=1200")
    }
  }, [user, isAuthenticated, router])

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
    setProfileImage(user?.avatar || "/placeholder.svg?height=128&width=128")
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

    setIsSubmitting(true)

    // In a real app, this would upload the images to a storage service
    // and then update the user profile in the database

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      })
      setIsSubmitting(false)
      router.push("/profile")
    }, 1500)
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
                  <AvatarImage src={profileImage || ""} alt="Profile" />
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
                  <span>January 2023 (not editable)</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4 border-t p-6">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
