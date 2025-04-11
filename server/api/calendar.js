// server/api/calendar.js
import { google } from 'googleapis'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { booking } = body
  
  // Set up Google Calendar API
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
  
  // Use a service account or stored tokens
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  })
  
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
  
  try {
    // Create event
    const event = {
      summary: `预约: ${booking.service.name}`,
      description: `客户: ${booking.user ? booking.user.email : booking.guest_name}`,
      start: {
        dateTime: `${booking.booking_date}T${booking.start_time}:00+08:00`,
      },
      end: {
        dateTime: `${booking.booking_date}T${booking.end_time}:00+08:00`,
      },
    }
    
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    })
    
    return { success: true, eventId: response.data.id }
  } catch (error) {
    console.error('Error creating calendar event:', error)
    return { success: false, error: error.message }
  }
})