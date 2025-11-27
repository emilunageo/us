import { NextRequest, NextResponse } from 'next/server';
import { USERS, SESSION_SECRET } from '@/lib/config';
import { LoginResponse, UserId } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<LoginResponse>({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }

    // Check against hardcoded users
    let matchedUser: UserId | null = null;
    
    for (const [userId, user] of Object.entries(USERS)) {
      if (user.email === email && user.password === password) {
        matchedUser = userId as UserId;
        break;
      }
    }

    if (!matchedUser) {
      return NextResponse.json<LoginResponse>({
        success: false,
        error: 'Invalid email or password'
      }, { status: 401 });
    }

    // Create a simple token (userId + secret encoded)
    const token = Buffer.from(`${matchedUser}:${SESSION_SECRET}`).toString('base64');

    return NextResponse.json<LoginResponse>({
      success: true,
      userId: matchedUser,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<LoginResponse>({
      success: false,
      error: 'An error occurred during login'
    }, { status: 500 });
  }
}

