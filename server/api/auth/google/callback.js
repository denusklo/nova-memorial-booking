export default defineEventHandler(async (event) => {
  try {
    // Step 1: Check if query exists
    const query = getQuery(event)
    if (!query) {
      return {
        status: 'error',
        step: 'query_validation',
        message: "Query parameters missing"
      }
    }
    // Step 2: Check for authorization code
    const code = query.code
    if (!code) {
      return {
        status: 'error',
        step: 'code_validation',
        message: "Authorization code is missing",
        query: JSON.stringify(query)
      }
    }
    // Step 3: Check if runtime config is available
    const config = useRuntimeConfig()
    if (!config.googleClientId || !config.googleClientSecret || !config.googleRedirectUri) {
      return {
        status: 'error',
        step: 'config_validation',
        message: "Google OAuth configuration is incomplete",
        configAvailable: {
          googleClientId: Boolean(config.googleClientId),
          googleClientSecret: Boolean(config.googleClientSecret),
          googleRedirectUri: Boolean(config.googleRedirectUri)
        }
      }
    }

    try {
      // Step 4 & 5: Exchange code for tokens using fetch API
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          code,
          client_id: config.googleClientId,
          client_secret: config.googleClientSecret,
          redirect_uri: config.googleRedirectUri,
          grant_type: 'authorization_code'
        })
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        return {
          status: 'error',
          step: 'token_exchange',
          message: "Failed to exchange authorization code for tokens",
          error: errorData.error,
          details: JSON.stringify(errorData)
        };
      }

      const tokens = await tokenResponse.json();

      // Step 6: Return success HTML
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
                expiryDate: '${tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : ''}'
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
    } catch (tokenError) {
      // Handle token exchange errors specifically
      return {
        status: 'error',
        step: 'token_exchange',
        message: "Failed to exchange authorization code for tokens",
        error: tokenError.message,
        details: 'No additional details'
      }
    }
  } catch (globalError) {
    // Catch any unexpected errors in the overall handler
    return {
      status: 'error',
      step: 'global_handler',
      message: "Unexpected error in auth callback handler",
      error: globalError.message
    }
  }
})