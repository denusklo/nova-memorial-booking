// server/api/calendar/add-event.js
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
   
    console.log('Processing calendar event with fetch API')
   
    // Extract booking details from the client data
    const service = bookingDetails?.service?.name || '预约'
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
   
    // Instead of using googleapis, use direct fetch call to the Google Calendar API
    const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(calendarEvent)
    });
    
    // Handle non-OK responses
    if (!calendarResponse.ok) {
      const errorData = await calendarResponse.json();
      
      // Handle authentication errors (similar to before)
      if (calendarResponse.status === 401) {
        return {
          success: false,
          needsReauth: true,
          message: 'Authentication expired, needs to reconnect Google'
        }
      }
      
      throw createError({
        statusCode: calendarResponse.status,
        message: errorData.error?.message || 'Google Calendar API error',
        details: JSON.stringify(errorData)
      });
    }
    
    // Parse the successful response
    const responseData = await calendarResponse.json();
    
    console.log('Calendar event created:', responseData);
   
    return {
      success: true,
      eventId: responseData.id,
      htmlLink: responseData.htmlLink,
      message: 'Event added to Google Calendar'
    }
  } catch (error) {
    console.error('Error adding event to calendar:', error)
   
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to add event to calendar',
      details: error.message
    })
  }
})