import { PrismaClient } from '@prisma/client'

// Hada el Prisma Client bech ya7ki m3a Neon Database
const prisma = globalThis.__prisma || (globalThis.__prisma = new PrismaClient())

export async function GET(request) {
  try {
    const users = await prisma.user.findMany({
      // Na77ina el include posts khater fasa-kht-ha
      take: 10,
      orderBy: {
        createdAt: 'desc', // Bech y-jiblek ekher users t-zadou
      }
    })

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
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
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

    // Create user fi el database
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