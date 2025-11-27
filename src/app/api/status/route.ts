import { NextRequest, NextResponse } from 'next/server';
import { validateToken, getTokenFromRequest } from '@/lib/auth';
import { getLocation, getMessage } from '@/lib/store';
import { calculateDistance } from '@/lib/geo';
import { USERS } from '@/lib/config';
import { StatusResponse, UserId, UserStatus } from '@/lib/types';

function getOtherUserId(userId: UserId): UserId {
  return userId === 'a' ? 'b' : 'a';
}

function buildUserStatus(userId: UserId): UserStatus {
  const user = USERS[userId];
  return {
    user: {
      id: userId,
      name: user.name,
      photo: user.photo
    },
    location: getLocation(userId),
    message: getMessage(userId)
  };
}

export async function GET(request: NextRequest) {
  try {
    const userId = validateToken(getTokenFromRequest(request));
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const otherUserId = getOtherUserId(userId);
    
    const currentUser = buildUserStatus(userId);
    const otherUser = buildUserStatus(otherUserId);

    // Calculate distance if both locations are available
    let distance: number | null = null;
    let showCity = true;

    if (currentUser.location && otherUser.location) {
      distance = calculateDistance(
        currentUser.location.lat,
        currentUser.location.lon,
        otherUser.location.lat,
        otherUser.location.lon
      );
      
      // Show city if same country, otherwise show country
      showCity = currentUser.location.country === otherUser.location.country;
    }

    const response: StatusResponse = {
      currentUser,
      otherUser,
      distance,
      showCity
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Status fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}

