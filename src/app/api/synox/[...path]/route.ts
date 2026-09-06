import { NextRequest, NextResponse } from 'next/server';

const SYNOX_UPSTREAM = 'https://api.synoxcloud.xyz';

async function handleProxy(request: NextRequest, { params }: { params: { path: string[] } }) {
  const pathArray = params.path || [];
  const targetPath = '/' + pathArray.join('/');

  // Get search params and append apikey if missing
  const searchParams = new URLSearchParams(request.nextUrl.searchParams);

  // Custom user API key check from header
  const customApiKey = request.headers.get('x-synox-api-key') || process.env.SYNOX_API_KEY || 'FREE';

  if (!searchParams.has('apikey')) {
    searchParams.set('apikey', customApiKey);
  }

  const upstreamUrl = `${SYNOX_UPSTREAM}${targetPath}?${searchParams.toString()}`;

  try {
    const fetchOptions: RequestInit = {
      method: request.method,
      headers: {
        'User-Agent': 'SynoxHub-ConsumerApp/1.0',
        'Accept': request.headers.get('accept') || '*/*',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      const contentType = request.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const bodyText = await request.text();
        fetchOptions.body = bodyText;
        (fetchOptions.headers as Record<string, string>)['Content-Type'] = 'application/json';
      } else if (contentType) {
        const arrayBuffer = await request.arrayBuffer();
        fetchOptions.body = arrayBuffer;
        (fetchOptions.headers as Record<string, string>)['Content-Type'] = contentType;
      }
    }

    const upstreamRes = await fetch(upstreamUrl, fetchOptions);

    if (upstreamRes.status === 429) {
      return NextResponse.json(
        {
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Public quota exhausted. Please enter your personal Synox API key in settings.',
          statusCode: 429,
        },
        { status: 429 }
      );
    }

    const resContentType = upstreamRes.headers.get('content-type') || '';

    // Handle JSON responses
    if (resContentType.includes('application/json')) {
      const data = await upstreamRes.json();
      return NextResponse.json(data, { status: upstreamRes.status });
    }

    // Handle text stream / plain text responses
    if (resContentType.includes('text/') || resContentType.includes('application/javascript')) {
      const textData = await upstreamRes.text();
      return new NextResponse(textData, {
        status: upstreamRes.status,
        headers: {
          'Content-Type': resContentType,
        },
      });
    }

    // Handle binary responses (images, media, pdfs, audio, buffer)
    const blob = await upstreamRes.arrayBuffer();
    return new NextResponse(blob, {
      status: upstreamRes.status,
      headers: {
        'Content-Type': resContentType || 'application/octet-stream',
        'Content-Disposition': upstreamRes.headers.get('content-disposition') || 'inline',
        'Cache-Control': upstreamRes.headers.get('cache-control') || 'public, max-age=3600',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'PROXY_FETCH_ERROR',
        message: 'Failed to communicate with Synox API server',
        details: message,
      },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest, context: { params: { path: string[] } }) {
  return handleProxy(request, context);
}

export async function POST(request: NextRequest, context: { params: { path: string[] } }) {
  return handleProxy(request, context);
}

export async function PUT(request: NextRequest, context: { params: { path: string[] } }) {
  return handleProxy(request, context);
}

export async function DELETE(request: NextRequest, context: { params: { path: string[] } }) {
  return handleProxy(request, context);
}
