import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'PulseChat Gateway',
    version: '1.0.0',
    websocket_endpoint: 'wss://pulsechat.app/ws/v1',
    timestamp: new Date().toISOString()
  });
}
