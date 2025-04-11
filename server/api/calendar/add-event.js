// server/api/calendar/add-event.js
import { google } from 'googleapis'

export default defineEventHandler(async (event) => {
  const { bookingId } = await readBody(event)
  const user = event.context.user // From your auth middleware

  // Get booking details
  const supabase = useSupabaseClient()
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      id, 
      booking_date, 
      start_time, 
      end_time,
      service:service_id(name, description)
    `)
    .eq('id', bookingId)
    .single()

  if (error || !booking) {
    throw createError({
      statusCode: 404,
      message: 'Booking not found'
    })
  }

  // Get user's Google tokens
  const { data: tokens, error: tokensError } = await supabase
    .from('user_google_tokens')
    .select('access_token, refresh_token, expiry_date')
    .eq('user_id', user.id)
    .single()

  if (tokensError || !tokens) {
    throw createError({
      statusCode: 403,
      message: 'Google Calendar not connected'
    })
  }

  // Set up OAuth client
  const oauth2Client = new google.auth.OAuth2(
    config.googleClientId,
    config.googleClientSecret,
    config.googleRedirectUri
  )

  oauth2Client.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: new Date(tokens.expiry_date).getTime()
  })

  // Create calendar event
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  try {
    const event = {
      summary: `预约: ${booking.service.name}`,
      description: booking.service.description,
      start: {
        dateTime: `${booking.booking_date}T${booking.start_time}:00+08:00`,
      },
      end: {
        dateTime: `${booking.booking_date}T${booking.end_time}:00+08:00`,
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    }

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    })

    // Update booking with calendar event ID
    await supabase
      .from('bookings')
      .update({ google_calendar_event_id: response.data.id })
      .eq('id', bookingId)

    return { success: true, eventId: response.data.id }
  } catch (error) {
    console.error('Error creating calendar event:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create calendar event'
    })
  }
})