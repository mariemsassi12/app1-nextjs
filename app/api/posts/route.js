import { PrismaClient } from '@prisma/client'

const prisma = globalThis.__prisma || (globalThis.__prisma = new PrismaClient())

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where = published ? { published: published === 'true' } : {}

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    return new Response(
      JSON.stringify({
        success: true,
        count: posts.length,
        data: posts,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    )
  } catch (error) {
    console.error('GET /api/posts error:', error)
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
    const { title, content, authorId, published } = await request.json()

    if (!title || !authorId) {
      return new Response(
        JSON.stringify({ error: 'Title and authorId are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: published || false,
        author: { connect: { id: authorId } },
      },
      include: {
        author: true,
      },
    })

    return new Response(
      JSON.stringify({
        success: true,
        data: post,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('POST /api/posts error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || String(error),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
