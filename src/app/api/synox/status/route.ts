import { NextResponse } from 'next/server';

const SYNOX_UPSTREAM = 'https://api.synoxcloud.xyz';

export async function GET() {
  try {
    const res = await fetch(`${SYNOX_UPSTREAM}/api/status/server`, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'SynoxHub-ConsumerApp/1.0',
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { active: false, status: res.status, error: 'Upstream unavailable' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { active: false, error: 'Failed to query server health', details: message },
      { status: 500 }
    );
  }
}
