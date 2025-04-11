// server/api/calendar/add-event.js
import { google } from 'googleapis'

export default defineEventHandler(async (event) => {
  try {
    // Get Nuxt runtime config
    const config = useRuntimeConfig()
   
    // Get the request body with booking details and tokens
    const body = await readBody(event)
    const { bookingId, accessToken, refreshToken, expiryDate, bookingDetails } = body
   
    if (!accessToken) {
      throw createError({
        statusCode: 400,
        message: 'Missing Google access token'
      })
    }
   
    console.log('Processing calendar event with direct token approach')
   
    // Set up Google OAuth client with the provided tokens
    const oauth2Client = new google.auth.OAuth2(
      config.public.googleClientId,
      config.googleClientSecret,
      config.public.googleRedirectUri
    )
   
    // Set credentials directly from the request
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken || null,
      expiry_date: expiryDate ? Number(expiryDate) : null
    })
   
    // Create the calendar API client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
   
    // Extract booking details from the client data
    const service = bookingDetails?.service?.name || '预约'
    // These field names were incorrect - should match the actual request structure
    const customerName = bookingDetails?.bookingInfo?.guestName || 'Customer'
    const customerPhone = bookingDetails?.bookingInfo?.guestPhone || 'No phone'
    const notes = bookingDetails?.bookingInfo?.notes || ''
    
    // Create a proper date object from the date components
    const bookingDate = new Date(
      bookingDetails.date.year, 
      bookingDetails.date.month, 
      bookingDetails.date.date
    )
    
    // Get the time slot
    const startTimeStr = bookingDetails?.timeSlot?.start || '12:00'
    const endTimeStr = bookingDetails?.timeSlot?.end || '13:00'
    
    // Create proper start and end time Date objects
    const startTime = new Date(bookingDate)
    const [startHours, startMinutes] = startTimeStr.split(':').map(Number)
    startTime.setHours(startHours, startMinutes, 0, 0)
    
    const endTime = new Date(bookingDate)
    const [endHours, endMinutes] = endTimeStr.split(':').map(Number)
    endTime.setHours(endHours, endMinutes, 0, 0)
   
    // Create the calendar event
    const calendarEvent = {
      summary: `${service} - ${customerName}`,
      description: `预约详情:\n电话: ${customerPhone}\n备注: ${notes}`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'Asia/Shanghai', // Adjust this to your timezone
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'Asia/Shanghai', // Adjust this to your timezone
      },
      reminders: {
        useDefault: true,
      },
    }
   
    console.log('Creating calendar event:', calendarEvent)
   
    // Insert the event
    const calendarResponse = await calendar.events.insert({
      calendarId: 'primary', // Uses the user's primary calendar
      resource: calendarEvent,
    })
   
    console.log('Calendar event created:', calendarResponse.data)
   
    return {
      success: true,
      eventId: calendarResponse.data.id,
      htmlLink: calendarResponse.data.htmlLink,
      message: 'Event added to Google Calendar'
    }
  } catch (error) {
    console.error('Error adding event to calendar:', error)
   
    // Handle token refresh errors or other Google API issues
    if (error.response?.status === 401) {
      return {
        success: false,
        needsReauth: true,
        message: 'Authentication expired, needs to reconnect Google'
      }
    }
   
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to add event to calendar',
      details: error.message
    })
  }
})