import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get the authorization code and state from the query parameters
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    // Check if code is present
    if (!code) {
      console.error("No authorization code received from Google")
      return NextResponse.redirect(new URL("/login?error=no_code", request.url))
    }

    // Get base URL with fallback
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

    // For demonstration purposes, we'll simulate a successful authentication
    // In a real app, you would exchange the code for tokens here

    // Mock user data
    const userData = {
      id: "google-123456789",
      name: "Google User",
      username: "googleuser",
      avatar: "/placeholder.svg?height=128&width=128",
    }

    // Redirect to the client-side handler with the user data
    const callbackUrl = new URL(`/auth/google-callback`, baseUrl)
    callbackUrl.searchParams.set("userData", encodeURIComponent(JSON.stringify(userData)))

    return NextResponse.redirect(callbackUrl)
  } catch (error) {
    console.error("Google authentication callback error:", error)

    // Redirect to login page with error
    return NextResponse.redirect(new URL("/login?error=google_auth_failed", request.url))
  }
}
