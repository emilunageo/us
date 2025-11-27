// Haversine formula to calculate distance between two points
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Reverse geocoding using OpenStreetMap Nominatim (free, no API key needed)
export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<{ city: string; country: string }> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
      {
        headers: {
          'User-Agent': 'CountdownApp/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Geocoding failed');
    }
    
    const data = await response.json();
    const address = data.address || {};
    
    return {
      city: address.city || address.town || address.village || address.municipality || 'Unknown',
      country: address.country || 'Unknown'
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      city: 'Unknown',
      country: 'Unknown'
    };
  }
}

