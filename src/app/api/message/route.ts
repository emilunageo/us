import { NextRequest, NextResponse } from 'next/server';
import { validateToken, getTokenFromRequest } from '@/lib/auth';
import { setMessage } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const userId = validateToken(getTokenFromRequest(request));
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { text } = body;

    if (typeof text !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    // Limit message length
    const trimmedText = text.trim().slice(0, 200);

    const message = setMessage(userId, trimmedText);

    return NextResponse.json({
      success: true,
      message
    });

  } catch (error) {
    console.error('Message update error:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

