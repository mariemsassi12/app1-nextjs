import { PrismaClient } from '@prisma/client'

const prisma = globalThis.__prisma || (globalThis.__prisma = new PrismaClient())

export async function GET(request) {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,
      },
      take: 10,
    })

    // Add cache headers
    return new Response(
      JSON.stringify({
        success: true,
        data: users,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120', // ISR Cache
        },
      }
    )
  } catch (error) {
    console.error('GET /api/users error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || String(error),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function POST(request) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const user = await prisma.user.create({
      data: { email, name },
    })

    return new Response(
      JSON.stringify({
        success: true,
        data: user,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('POST /api/users error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || String(error),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

