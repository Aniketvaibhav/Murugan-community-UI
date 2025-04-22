import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get environment variables with fallbacks
    const googleClientId = process.env.GOOGLE_CLIENT_ID || ""
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const redirectUri = `${baseUrl}/api/auth/google/callback`

    // Check if required environment variables are set
    if (!googleClientId) {
      console.error("Missing required environment variable: GOOGLE_CLIENT_ID")
      return new NextResponse(JSON.stringify({ error: "OAuth configuration error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Generate a random state parameter for CSRF protection
    const state = Math.random().toString(36).substring(2, 15)

    // Define OAuth scopes
    const scope = "email profile"

    // Construct the Google OAuth URL
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}&prompt=select_account`

    // For debugging
    console.log("Redirecting to:", googleAuthUrl)

    // Return a redirect response
    return NextResponse.redirect(googleAuthUrl, { status: 302 })
  } catch (error) {
    console.error("Error initiating Google OAuth flow:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to initiate authentication" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
