/**
 * Simple in-memory rate limiter for Next.js API routes (serverless-safe).
 * Uses a sliding window approach per IP.
 * Note: Works per-instance on Vercel. For true distributed rate limiting,
 * use Upstash Redis (TODO: upgrade path documented in README roadmap).
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes to prevent memory growth
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
        if (entry.resetAt < now) store.delete(key);
    }
}, 5 * 60 * 1000);

interface RateLimitOptions {
    limit: number;       // Max requests per window
    windowMs: number;    // Window duration in milliseconds
}

export function rateLimit(ip: string, key: string, options: RateLimitOptions): {
    allowed: boolean;
    remaining: number;
    resetAt: number;
} {
    const storeKey = `${key}:${ip}`;
    const now = Date.now();
    const entry = store.get(storeKey);

    if (!entry || entry.resetAt < now) {
        store.set(storeKey, { count: 1, resetAt: now + options.windowMs });
        return { allowed: true, remaining: options.limit - 1, resetAt: now + options.windowMs };
    }

    if (entry.count >= options.limit) {
        return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }

    entry.count++;
    return { allowed: true, remaining: options.limit - entry.count, resetAt: entry.resetAt };
}

export function getClientIp(request: Request): string {
    return (
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'unknown'
    );
}
