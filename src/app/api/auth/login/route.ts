import { NextRequest, NextResponse } from 'next/server';
import { USERS, SESSION_SECRET } from '@/lib/config';
import { LoginResponse, UserId } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json<LoginResponse>({
        success: false,
        error: 'Usuario y contraseña son requeridos'
      }, { status: 400 });
    }

    // Check against hardcoded users
    let matchedUser: UserId | null = null;

    for (const [userId, user] of Object.entries(USERS)) {
      if (user.username === username && user.password === password) {
        matchedUser = userId as UserId;
        break;
      }
    }

    if (!matchedUser) {
      return NextResponse.json<LoginResponse>({
        success: false,
        error: 'Usuario o contraseña incorrectos'
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
      error: 'Ocurrió un error durante el inicio de sesión'
    }, { status: 500 });
  }
}

