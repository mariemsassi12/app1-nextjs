export const runtime = 'edge'

export async function middleware(request) {
  // Check if this is an analytics request
  if (request.nextUrl.pathname === '/api/analytics') {
    // Extract useful data on the edge with minimal latency
    const country = request.geo?.country || 'unknown'
    const city = request.geo?.city || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || 'direct'

    const analyticsData = {
      timestamp: new Date().toISOString(),
      country,
      city,
      referer,
      path: request.nextUrl.pathname,
      method: request.method,
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: analyticsData,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      }
    )
  }

  return new Response('Not Found', { status: 404 })
}

export const config = {
  matcher: ['/api/analytics'],
}
