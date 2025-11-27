import { NextRequest, NextResponse } from 'next/server';
import { validateToken, getTokenFromRequest } from '@/lib/auth';
import { setLocation } from '@/lib/store';
import { reverseGeocode } from '@/lib/geo';

export async function POST(request: NextRequest) {
  try {
    const userId = validateToken(getTokenFromRequest(request));
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lat, lon } = body;

    if (typeof lat !== 'number' || typeof lon !== 'number') {
      return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
    }

    // Reverse geocode to get city and country
    const { city, country } = await reverseGeocode(lat, lon);

    // Save location
    const location = setLocation(userId, {
      lat,
      lon,
      city,
      country,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      location
    });

  } catch (error) {
    console.error('Location update error:', error);
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 });
  }
}

