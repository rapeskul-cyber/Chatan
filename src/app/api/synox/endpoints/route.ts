import { NextResponse } from 'next/server';

const SYNOX_UPSTREAM = 'https://api.synoxcloud.xyz';

// Server in-memory cache
let cachedRegistry: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

export async function GET() {
  const now = Date.now();

  if (cachedRegistry && now - cachedRegistry.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cachedRegistry.data, {
      headers: {
        'X-Cache': 'HIT',
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=60',
      },
    });
  }

  try {
    const res = await fetch(`${SYNOX_UPSTREAM}/endpoint`, {
      headers: {
        'User-Agent': 'SynoxHub-ConsumerApp/1.0',
      },
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      if (cachedRegistry) {
        return NextResponse.json(cachedRegistry.data, {
          headers: { 'X-Cache': 'STALE' },
        });
      }
      return NextResponse.json(
        { error: 'Failed to fetch upstream endpoints', status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    cachedRegistry = { data, timestamp: now };

    return NextResponse.json(data, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=60',
      },
    });
  } catch (error: unknown) {
    if (cachedRegistry) {
      return NextResponse.json(cachedRegistry.data, {
        headers: { 'X-Cache': 'STALE-FALLBACK' },
      });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to connect to Synox API', details: message },
      { status: 500 }
    );
  }
}
