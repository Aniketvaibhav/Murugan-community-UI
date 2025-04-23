import { Avatar as UIAvatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getMediaUrl } from "@/lib/api/post"

interface AvatarProps {
  src?: string | null
  alt?: string
  className?: string
  fallback?: string
}

export function Avatar({ src, alt, className, fallback }: AvatarProps) {
  const imageUrl = src ? getMediaUrl(src) : null

  return (
    <UIAvatar className={className}>
      <AvatarImage src={imageUrl || "/placeholder.svg"} alt={alt || "Avatar"} />
      <AvatarFallback>{fallback || alt?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
    </UIAvatar>
  )
} 