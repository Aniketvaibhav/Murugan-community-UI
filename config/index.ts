export const config = {
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    localtunnelUrl: process.env.NEXT_PUBLIC_LOCALTUNNEL_API_URL,
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
} as const;

// Helper to get the active API URL (prefer localtunnel URL when available)
export const getApiUrl = () => {
  return config.api.localtunnelUrl || config.api.url;
}; 