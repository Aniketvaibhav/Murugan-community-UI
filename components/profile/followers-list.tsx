"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UserPlus, UserMinus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { followUser } from "@/actions/follow-actions"
import { useAuth } from "@/contexts/auth-context"

// Mock data for followers
const mockFollowers = [
  {
    id: "2",
    name: "Priya Sundaram",
    username: "priyas",
    avatar: "/placeholder.svg?height=40&width=40",
    isFollowing: true,
  },
  {
    id: "3",
    name: "Anand Venkat",
    username: "anandv",
    avatar: "/placeholder.svg?height=40&width=40",
    isFollowing: false,
  },
  {
    id: "4",
    name: "Lakshmi Narayanan",
    username: "lakshminarayanan",
    avatar: "/placeholder.svg?height=40&width=40",
    isFollowing: true,
  },
  {
    id: "5",
    name: "Karthik Raja",
    username: "karthikr",
    avatar: "/placeholder.svg?height=40&width=40",
    isFollowing: false,
  },
]

interface FollowersListProps {
  count: number
  type: "followers" | "following"
  username: string
}

export function FollowersList({ count, type, username }: FollowersListProps) {
  const [followers, setFollowers] = useState(mockFollowers)
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  const handleFollow = async (followerId: string, isFollowing: boolean) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to follow users",
      })
      return
    }

    // Set loading state for this specific follower
    setLoadingStates((prev) => ({ ...prev, [followerId]: true }))

    try {
      const result = await followUser(followerId, isFollowing)

      if (result.success) {
        // Update the followers list
        setFollowers(
          followers.map((follower) =>
            follower.id === followerId ? { ...follower, isFollowing: result.isFollowing } : follower,
          ),
        )

        toast({
          title: result.isFollowing ? "Following" : "Unfollowed",
          description: result.isFollowing
            ? `You are now following ${followers.find((f) => f.id === followerId)?.name}`
            : `You have unfollowed ${followers.find((f) => f.id === followerId)?.name}`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingStates((prev) => ({ ...prev, [followerId]: false }))
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="h-auto p-0">
          {count} {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{type === "followers" ? "Followers" : "Following"}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-1">
          <div className="space-y-4">
            {followers.map((follower) => (
              <div key={follower.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={follower.avatar || "/placeholder.svg"} alt={follower.name} />
                    <AvatarFallback>{follower.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link href={`/profile/${follower.username}`} className="font-medium hover:underline">
                      {follower.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">@{follower.username}</p>
                  </div>
                </div>
                {user?.username !== follower.username && (
                  <Button
                    variant={follower.isFollowing ? "outline" : "default"}
                    size="sm"
                    className="gap-1"
                    onClick={() => handleFollow(follower.id, follower.isFollowing)}
                    disabled={loadingStates[follower.id]}
                  >
                    {loadingStates[follower.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : follower.isFollowing ? (
                      <>
                        <UserMinus className="h-4 w-4" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Follow
                      </>
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
