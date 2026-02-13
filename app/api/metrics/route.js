export async function POST(request) {
  try {
    const metric = await request.json()

    // Log metrics (in production, send to monitoring service like DataDog, New Relic, etc.)
    console.log('[METRIC]', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      timestamp: metric.timestamp,
    })

    // Example: Send to external monitoring service
    // await fetch('https://your-analytics-service.com/metrics', {
    //   method: 'POST',
    //   body: JSON.stringify(metric),
    //   headers: { 'Content-Type': 'application/json' },
    // })

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      }
    )
  } catch (error) {
    console.error('Error logging metric:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to log metric' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
