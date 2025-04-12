"use client"

import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function useAuthRedirect() {
  const router = useRouter()
  const { toast } = useToast()

  const redirectToLogin = (featureName?: string) => {
    const message = featureName ? `Please log in to access ${featureName}` : "Please log in to access this feature"

    toast({
      title: "Authentication Required",
      description: message,
      duration: 3000,
    })

    // Short delay before redirecting to allow the toast to be seen
    setTimeout(() => {
      router.push("/login")
    }, 1000)
  }

  return { redirectToLogin }
}
