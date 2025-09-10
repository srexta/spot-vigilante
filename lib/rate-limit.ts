import { prisma } from './prisma'

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

const RATE_LIMITS = {
  submission: { windowMs: 24 * 60 * 60 * 1000, maxRequests: 10 }, // 10 submissions per day per IP
} as const

export async function checkRateLimit(
  ipAddress: string,
  action: keyof typeof RATE_LIMITS
): Promise<{ allowed: boolean; remaining: number; resetTime: Date }> {
  const config = RATE_LIMITS[action]
  const now = new Date()
  const windowStart = new Date(now.getTime() - config.windowMs)

  // Clean up old entries
  await prisma.rateLimit.deleteMany({
    where: {
      windowStart: { lt: windowStart }
    }
  })

  // Check current usage
  const existing = await prisma.rateLimit.findFirst({
    where: {
      ipAddress,
      action,
      windowStart: { gte: windowStart }
    }
  })

  if (!existing) {
    // Create new rate limit entry
    await prisma.rateLimit.create({
      data: {
        ipAddress,
        action,
        count: 1,
        windowStart
      }
    })

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: new Date(windowStart.getTime() + config.windowMs)
    }
  }

  if (existing.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: new Date(existing.windowStart.getTime() + config.windowMs)
    }
  }

  // Increment count
  await prisma.rateLimit.update({
    where: { id: existing.id },
    data: { count: existing.count + 1 }
  })

  return {
    allowed: true,
    remaining: config.maxRequests - existing.count - 1,
    resetTime: new Date(existing.windowStart.getTime() + config.windowMs)
  }
}