'use client'

import { useEffect } from 'react'
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'

// Initialize Web Vitals monitoring
export function WebVitals() {
  useEffect(() => {
    // Get Cumulative Layout Shift
    onCLS((metric) => {
      console.log('CLS:', metric.value)
      sendMetric('CLS', metric)
    })

    // Get First Input Delay
    onFID((metric) => {
      console.log('FID:', metric.value)
      sendMetric('FID', metric)
    })

    // Get First Contentful Paint
    onFCP((metric) => {
      console.log('FCP:', metric.value)
      sendMetric('FCP', metric)
    })

    // Get Largest Contentful Paint
    onLCP((metric) => {
      console.log('LCP:', metric.value)
      sendMetric('LCP', metric)
    })

    // Get Time to First Byte
    onTTFB((metric) => {
      console.log('TTFB:', metric.value)
      sendMetric('TTFB', metric)
    })
  }, [])

  return null
}

// Send metrics to your analytics endpoint
function sendMetric(name, metric) {
  // Send to your own analytics service or Vercel Analytics
  const body = {
    name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    timestamp: new Date().toISOString(),
  }

  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/metrics', JSON.stringify(body))
  } else {
    fetch('/api/metrics', {
      method: 'POST',
      body: JSON.stringify(body),
      keepalive: true,
    }).catch((err) => console.error('Failed to send metric:', err))
  }
}
