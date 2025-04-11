// server/api/auth/google.js
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${config.googleClientId}&` +
    `redirect_uri=${encodeURIComponent(config.googleRedirectUri)}&` +
    `response_type=code&` +
    `scope=https://www.googleapis.com/auth/calendar.events&` +
    `access_type=offline&` +
    `prompt=consent`
  
  return { url: authUrl }
})