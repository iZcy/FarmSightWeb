// Reverse geocoding using Nominatim (OpenStreetMap)
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<{ address: string; error?: string }> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en,zh',
          'User-Agent': 'FarmSight/1.0', // Required by Nominatim
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    if (data.error) {
      return { address: '', error: 'Location not found' };
    }

    // Format the address nicely
    const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    return { address };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      error: 'Failed to fetch address',
    };
  }
}

// Get user's current location using browser geolocation API
export function getCurrentLocation(): Promise<{
  lat: number;
  lng: number;
  error?: string;
}> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        lat: 34.7466,
        lng: 113.6253,
        error: 'Geolocation not supported',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        resolve({
          lat: 34.7466, // Default to Henan, China
          lng: 113.6253,
          error: 'Could not get your location',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}
