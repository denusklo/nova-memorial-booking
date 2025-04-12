// Modified server/api/auth/google/callback.js
import { google } from 'googleapis'

export default defineEventHandler(async (event) => {

  const query = getQuery(event)
  // const config = useRuntimeConfig()

  // return {
  //   'config.googleClientId': config.googleClientId,
  //   'config.googleClientSecret': config.googleClientSecret,
  //   'config.googleRedirectUri': config.googleRedirectUri,
  // };


  const code = query.code
  const config = useRuntimeConfig()

  if (!code) {
    return sendRedirect(event, `/bookings/auth-error?error=${encodeURIComponent('Authorization code is missing')}`)
  }

  const oauth2Client = new google.auth.OAuth2(
    config.googleClientId,
    config.googleClientSecret,
    config.googleRedirectUri
  )

  try {
    const { tokens } = await oauth2Client.getToken(code)

    // Instead of redirecting, return an HTML page that sends a message to the opener
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authorization Successful</title>
        <script>
          // Send tokens back to the opener window
          if (window.opener) {
            window.opener.postMessage({
              type: 'google-auth-success',
              accessToken: '${tokens.access_token}',
              refreshToken: '${tokens.refresh_token || ''}',
              expiryDate: '${tokens.expiry_date}'
            }, '*');

            // Close this window after sending data
            setTimeout(() => window.close(), 1000);
          } else {
            document.body.innerHTML = '<p>Authorization successful. You can close this window and return to the application.</p>';
          }
        </script>
      </head>
      <body>
        <p>Authorization successful! This window will close automatically...</p>
      </body>
      </html>
    `;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {

    console.log('Detailed token exchange error:', error.response?.data || error.message || error)

    // Return an error HTML page
    const errorMsg = encodeURIComponent(JSON.stringify(error.response?.data || error.message));
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authorization Failed</title>
        <script>
          if (window.opener) {
            window.opener.postMessage({
              type: 'google-auth-error',
              error: '${errorMsg}'
            }, '*');
            setTimeout(() => window.close(), 1000);
          }
        </script>
      </head>
      <body>
        <p>Authorization failed. This window will close automatically...</p>
        <p>Error: '${JSON.stringify(error.response?.data)}'</p>
        <p>config.googleClientId: '${config.googleClientId}'</p>
        <p>config.googleClientSecret: '${config.googleClientSecret}'</p>
        <p>config.googleRedirectUri: '${config.googleRedirectUri}'</p>
      </body>
      </html>
    `;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
})