export const runtime = 'edge'

// Ultra-fast edge function for geo-based responses
export async function GET(request) {
  const country = request.geo?.country || 'US'
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  // Example: Return localized content based on country
  const messages = {
    FR: 'Bienvenue sur notre plateforme!',
    DE: 'Willkommen auf unserer Plattform!',
    ES: '¡Bienvenido a nuestra plataforma!',
    US: 'Welcome to our platform!',
  }

  const message = messages[country] || messages.US

  return new Response(
    JSON.stringify({
      success: true,
      country,
      message,
      ip,
      timestamp: Date.now(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    }
  )
}
