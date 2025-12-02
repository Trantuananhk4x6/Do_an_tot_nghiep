import { LocationInfo } from '../types/job.types';

// Vietnamese cities with coordinates
export const VIETNAMESE_CITIES = [
  { city: 'Hồ Chí Minh', country: 'Vietnam', lat: 10.8231, lng: 106.6297, aliases: ['ho chi minh', 'hcm', 'saigon', 'sài gòn', 'tp.hcm', 'tphcm'] },
  { city: 'Hà Nội', country: 'Vietnam', lat: 21.0285, lng: 105.8542, aliases: ['hanoi', 'ha noi', 'hn'] },
  { city: 'Đà Nẵng', country: 'Vietnam', lat: 16.0544, lng: 108.2022, aliases: ['da nang', 'danang', 'dn'] },
  { city: 'Cần Thơ', country: 'Vietnam', lat: 10.0452, lng: 105.7469, aliases: ['can tho', 'cantho'] },
  { city: 'Hải Phòng', country: 'Vietnam', lat: 20.8449, lng: 106.6881, aliases: ['hai phong', 'haiphong', 'hp'] },
  { city: 'Biên Hòa', country: 'Vietnam', lat: 10.9574, lng: 106.8426, aliases: ['bien hoa', 'bienhoa'] },
  { city: 'Bình Dương', country: 'Vietnam', lat: 10.9804, lng: 106.6519, aliases: ['binh duong', 'binhduong', 'thu dau mot'] },
  { city: 'Nha Trang', country: 'Vietnam', lat: 12.2388, lng: 109.1967, aliases: ['nhatrang'] },
  { city: 'Huế', country: 'Vietnam', lat: 16.4637, lng: 107.5909, aliases: ['hue', 'thua thien hue'] },
  { city: 'Vũng Tàu', country: 'Vietnam', lat: 10.4114, lng: 107.1362, aliases: ['vung tau', 'vungtau', 'ba ria'] },
  { city: 'Đồng Nai', country: 'Vietnam', lat: 10.9574, lng: 106.8426, aliases: ['dong nai', 'dongnai'] },
  { city: 'Long An', country: 'Vietnam', lat: 10.5362, lng: 106.4133, aliases: ['long an', 'longan'] },
];

// International cities for global search
export const INTERNATIONAL_CITIES = [
  { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, aliases: ['sg'] },
  { city: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018, aliases: ['bkk'] },
  { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, aliases: ['jp'] },
  { city: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780, aliases: ['kr'] },
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, aliases: ['au'] },
  { city: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, aliases: ['sf', 'bay area'] },
  { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, aliases: ['nyc', 'ny'] },
  { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, aliases: ['uk'] },
  { city: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, aliases: ['de'] },
  { city: 'Remote', country: 'Global', lat: 0, lng: 0, aliases: ['remote', 'work from home', 'wfh'] },
];

const ALL_CITIES = [...VIETNAMESE_CITIES, ...INTERNATIONAL_CITIES];

// Get user's current location using Geolocation API
export async function getCurrentLocation(): Promise<LocationInfo | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Find nearest city
        const nearestCity = findNearestCity(latitude, longitude);
        
        if (nearestCity) {
          resolve({
            city: nearestCity.city,
            country: nearestCity.country,
            isDetected: true,
            coordinates: { latitude, longitude }
          });
        } else {
          // Default to Ho Chi Minh if can't determine
          resolve({
            city: 'Hồ Chí Minh',
            country: 'Vietnam',
            isDetected: true,
            coordinates: { latitude, longitude }
          });
        }
      },
      (error) => {
        console.log('Geolocation error:', error.message);
        resolve(null);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000 // 5 minutes cache
      }
    );
  });
}

// Find nearest city based on coordinates
function findNearestCity(lat: number, lng: number): typeof ALL_CITIES[0] | null {
  let nearest = null;
  let minDistance = Infinity;

  ALL_CITIES.forEach(city => {
    if (city.lat === 0 && city.lng === 0) return; // Skip Remote
    
    const distance = calculateDistance(lat, lng, city.lat, city.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = city;
    }
  });

  // Only return if within 100km
  return minDistance < 100 ? nearest : null;
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Parse location from text (CV or user input)
export function parseLocationFromText(text: string): LocationInfo | null {
  const lowerText = text.toLowerCase();
  
  for (const city of ALL_CITIES) {
    // Check main city name
    if (lowerText.includes(city.city.toLowerCase())) {
      return {
        city: city.city,
        country: city.country,
        isDetected: false
      };
    }
    
    // Check aliases
    for (const alias of city.aliases) {
      if (lowerText.includes(alias)) {
        return {
          city: city.city,
          country: city.country,
          isDetected: false
        };
      }
    }
  }
  
  return null;
}

// Get all available cities for dropdown
export function getAvailableCities(): { city: string; country: string; isVietnam: boolean }[] {
  const vietnamCities = VIETNAMESE_CITIES.map(c => ({
    city: c.city,
    country: c.country,
    isVietnam: true
  }));
  
  const internationalCities = INTERNATIONAL_CITIES.map(c => ({
    city: c.city,
    country: c.country,
    isVietnam: false
  }));
  
  return [...vietnamCities, ...internationalCities];
}

// Get location display name for search
export function getLocationForSearch(location: string): string {
  const lowerLocation = location.toLowerCase();
  
  // Map to standard names for job platforms
  const locationMap: Record<string, string> = {
    'hồ chí minh': 'Ho Chi Minh',
    'ho chi minh': 'Ho Chi Minh',
    'hcm': 'Ho Chi Minh',
    'saigon': 'Ho Chi Minh',
    'sài gòn': 'Ho Chi Minh',
    'hà nội': 'Ha Noi',
    'hanoi': 'Ha Noi',
    'ha noi': 'Ha Noi',
    'đà nẵng': 'Da Nang',
    'da nang': 'Da Nang',
    'danang': 'Da Nang',
  };
  
  return locationMap[lowerLocation] || location;
}

// Check if location is in Vietnam
export function isVietnamLocation(location: string): boolean {
  const lowerLocation = location.toLowerCase();
  
  // Check if any Vietnamese city matches
  for (const city of VIETNAMESE_CITIES) {
    if (lowerLocation.includes(city.city.toLowerCase())) return true;
    for (const alias of city.aliases) {
      if (lowerLocation.includes(alias)) return true;
    }
  }
  
  // Check for Vietnam country name
  if (lowerLocation.includes('vietnam') || lowerLocation.includes('việt nam') || lowerLocation.includes('vn')) {
    return true;
  }
  
  return false;
}
