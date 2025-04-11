// server/api/auth/google/callback.js
import { google } from 'googleapis'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code
  const config = useRuntimeConfig()
  
  if (!code) {
    throw createError({
      statusCode: 400,
      message: 'Authorization code is missing'
    })
  }
  
  const oauth2Client = new google.auth.OAuth2(
    config.googleClientId,
    config.googleClientSecret,
    config.googleRedirectUri
  )
  
  try {
    const { tokens } = await oauth2Client.getToken(code)
    
    // Store tokens in session or database associated with user
    // This is a simplified example - you should use your session mechanism
    const supabase = useSupabaseClient()
    await supabase
      .from('user_google_tokens')
      .upsert({
        user_id: event.context.user.id, // You need to get the user from the request context
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: new Date(tokens.expiry_date).toISOString()
      })
    
    return sendRedirect(event, '/booking/success')
  } catch (error) {
    console.error('Error exchanging code for tokens:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to exchange authorization code for tokens'
    })
  }
})