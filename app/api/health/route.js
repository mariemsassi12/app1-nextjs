import { PrismaClient } from '@prisma/client'

const prisma = globalThis.__prisma || (globalThis.__prisma = new PrismaClient())

export async function GET() {
  try {
    
    await prisma.$queryRaw`SELECT 1`
    
    return new Response(
      JSON.stringify({
        status: 'ok',
        database: 'connected',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ status: 'error', database: 'disconnected' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}