import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function rateLimit(key: string, limit: number, window: number): Promise<boolean> {
  const current = await redis.incr(key)
  if (current === 1) await redis.expire(key, window)
  return current <= limit
}
