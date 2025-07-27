import L from 'leaflet';

/**
 * Calculates the distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return Math.round(distance * 10) / 10; // Round to 1 decimal
}

/**
 * Converts degrees to radians
 * @param deg Degrees
 * @returns Radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Calculates a bounding box around a given coordinate with specified radius
 * @param lat Center latitude
 * @param lng Center longitude
 * @param radiusKm Radius in kilometers
 * @returns Bounding box [minLng, minLat, maxLng, maxLat]
 */
export function getBoundingBox(
  lat: number,
  lng: number,
  radiusKm: number
): [number, number, number, number] {
  const R = 6371; // Earth's radius in km
  
  // Angular distance in radians
  const radDist = radiusKm / R;
  
  const radLat = deg2rad(lat);
  const radLng = deg2rad(lng);
  
  const minLat = radLat - radDist;
  const maxLat = radLat + radDist;
  
  // Adjust longitude distance based on latitude
  const deltaLng = Math.asin(Math.sin(radDist) / Math.cos(radLat));
  
  const minLng = radLng - deltaLng;
  const maxLng = radLng + deltaLng;
  
  // Convert back to degrees
  return [
    (minLng * 180) / Math.PI,
    (minLat * 180) / Math.PI,
    (maxLng * 180) / Math.PI,
    (maxLat * 180) / Math.PI
  ];
}

/**
 * Generates a GeoJSON point feature from coordinates
 * @param lat Latitude
 * @param lng Longitude
 * @param properties Properties to add to the feature
 * @returns GeoJSON Point Feature
 */
export function createGeoJSONPoint(
  lat: number,
  lng: number,
  properties: Record<string, any> = {}
): any {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [lng, lat]
    },
    properties
  };
}

/**
 * Generates a GeoJSON LineString feature between two points
 * @param lat1 Start latitude
 * @param lng1 Start longitude
 * @param lat2 End latitude
 * @param lng2 End longitude
 * @param properties Properties to add to the feature
 * @returns GeoJSON LineString Feature
 */
export function createGeoJSONLine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  properties: Record<string, any> = {}
): any {
  return {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [lng1, lat1],
        [lng2, lat2]
      ]
    },
    properties
  };
}

/**
 * Create a marker element with custom style
 * @param color Background color
 * @param text Text to display
 * @param icon Optional icon class
 * @returns HTMLElement for marker
 */
export function createMarkerElement(
  color: string,
  text: string,
  icon?: string
): HTMLElement {
  const el = document.createElement('div');
  el.className = 'custom-marker';
  el.style.backgroundColor = color;
  el.style.color = 'white';
  el.style.padding = '6px 10px';
  el.style.borderRadius = '4px';
  el.style.fontSize = '12px';
  el.style.fontWeight = 'bold';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
  
  if (icon) {
    const iconEl = document.createElement('span');
    iconEl.className = icon;
    iconEl.style.marginRight = '4px';
    el.appendChild(iconEl);
  }
  
  const textEl = document.createTextNode(text);
  el.appendChild(textEl);
  
  return el;
}

/**
 * Converts a property type to an appropriate icon name
 * @param propertyType Type of property
 * @returns Icon name
 */
export function getPropertyTypeIcon(propertyType: string): string {
  switch (propertyType) {
    case '1 BHK':
    case '2 BHK':
    case '3 BHK':
    case '4 BHK':
      return 'apartment';
    case 'Villa':
      return 'home';
    case 'Plot':
      return 'terrain';
    default:
      return 'location';
  }
}

/**
 * Calculates the road distance between two points
 * If useOSRM is true, uses OSRM routing service for accurate road distance
 * Otherwise uses an enhanced algorithm with dynamic road factor multiplier
 * 
 * @param startLat Start latitude
 * @param startLng Start longitude
 * @param endLat End latitude
 * @param endLng End longitude
 * @param useOSRM Whether to use OSRM routing service
 * @returns Distance in kilometers (Promise if useOSRM is true)
 */
export function calculateRoadDistance(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  useOSRM: boolean = false
): number | Promise<number> {
  if (useOSRM) {
    return (async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        
        if (data.routes && data.routes[0]) {
          // Convert meters to kilometers
          return data.routes[0].distance / 1000;
        }
        return 0;
      } catch (error) {
        console.error('Error calculating road distance:', error);
        return 0;
      }
    })();
  }

  // First get the direct distance
  const directDistance = calculateDistance(startLat, startLng, endLat, endLng);
  
  // Define city center coordinates for Lucknow (approximate)
  const cityLat = 26.8467;
  const cityLng = 80.9462;
  
  // Calculate distances from city center to both points
  const distFromCity1 = calculateDistance(startLat, startLng, cityLat, cityLng);
  const distFromCity2 = calculateDistance(endLat, endLng, cityLat, cityLng);
  
  // Determine if points are in urban core, midtown, or outskirts
  const isUrbanCore1 = distFromCity1 < 5;
  const isUrbanCore2 = distFromCity2 < 5;
  const isMidtown1 = distFromCity1 >= 5 && distFromCity1 < 10;
  const isMidtown2 = distFromCity2 >= 5 && distFromCity2 < 10;
  const isOutskirts1 = distFromCity1 >= 10;
  const isOutskirts2 = distFromCity2 >= 10;
  
  // Apply a dynamic road factor based on multiple conditions
  let roadFactor = 1.3; // Default factor
  
  // Both in urban core (highest road factor due to congestion and winding roads)
  if (isUrbanCore1 && isUrbanCore2) {
    if (directDistance < 1) {
      roadFactor = 1.8; // Very short distances in dense urban areas have more detours
    } else if (directDistance < 3) {
      roadFactor = 1.6; // Short urban distances still have significant detours
    } else {
      roadFactor = 1.5; // Longer distances within urban core
    }
  }
  // One point in urban core, one in midtown
  else if ((isUrbanCore1 && isMidtown2) || (isUrbanCore2 && isMidtown1)) {
    if (directDistance < 5) {
      roadFactor = 1.5; // Need to navigate out of the core
    } else if (directDistance < 10) {
      roadFactor = 1.4; // Some main roads available
    } else {
      roadFactor = 1.35; // Longer distance with some direct routes
    }
  }
  // Both in midtown
  else if (isMidtown1 && isMidtown2) {
    if (directDistance < 3) {
      roadFactor = 1.4; // Less congested but still some detours
    } else {
      roadFactor = 1.3; // Better road network
    }
  }
  // One point in urban/midtown and one in outskirts
  else if ((isUrbanCore1 || isMidtown1) && isOutskirts2 || (isUrbanCore2 || isMidtown2) && isOutskirts1) {
    if (directDistance < 10) {
      roadFactor = 1.4; // Need to navigate through different density zones
    } else if (directDistance < 20) {
      roadFactor = 1.3; // Some highways available
    } else {
      roadFactor = 1.25; // Longer distances likely use highways
    }
  }
  // Both in outskirts
  else if (isOutskirts1 && isOutskirts2) {
    if (directDistance < 5) {
      roadFactor = 1.25; // Rural roads may be less direct
    } else if (directDistance < 15) {
      roadFactor = 1.2; // Some main roads connect outskirt areas
    } else {
      roadFactor = 1.15; // Long distances use highways
    }
  }
  
  // Apply the road factor
  let roadDistance = directDistance * roadFactor;
  
  // Add a small random variation for realism (±5%)
  const variation = (Math.random() * 0.1) - 0.05;
  roadDistance = roadDistance * (1 + variation);
  
  // Add a slight bias for travel time consistency
  // For very short distances, add a minimum of 0.3km to account for initial/final navigation
  if (roadDistance < 1.5) {
    roadDistance += 0.3;
  }
  
  // Round to 1 decimal place for display
  return Math.round(roadDistance * 10) / 10;
}

/**
 * Get travel time estimate based on distance and Lucknow traffic patterns
 * @param distanceKm Distance in kilometers
 * @param mode Travel mode (driving, walking, cycling)
 * @returns Estimated travel time as string
 */
export function estimateTravelTime(distanceKm: number, mode: 'driving' | 'walking' | 'cycling' = 'driving'): string {
  // Base average speeds in km/h for different modes
  let speed = 30; // Default speed if none of the conditions match
  
  // Adjust speed based on distance and mode
  if (mode === 'driving') {
    // Driving speeds vary based on distance (representing urban/highway driving)
    if (distanceKm < 3) {
      // Short urban trips with traffic lights, congestion
      speed = 18;
    } else if (distanceKm < 7) {
      // Medium urban trips with some main roads
      speed = 25;
    } else if (distanceKm < 15) {
      // Longer trips with a mix of urban roads and highways
      speed = 35;
    } else {
      // Primarily highway driving
      speed = 45;
    }
    
    // Apply peak hour adjustment (assume peak hours with 30% slower speeds)
    // In a real app, we would check current time of day
    const isPeakHour = false; // Simplification for demo
    if (isPeakHour) {
      speed = speed * 0.7; // 30% reduction in speed during peak hours
    }
  } 
  else if (mode === 'walking') {
    // Walking speeds vary less but still affected by urban density
    if (distanceKm < 1) {
      // Walking in dense areas with crossings
      speed = 4.2;
    } else {
      // Walking in less dense areas
      speed = 5;
    }
  } 
  else if (mode === 'cycling') {
    // Cycling speeds
    if (distanceKm < 2) {
      // Urban cycling with frequent stops
      speed = 12;
    } else if (distanceKm < 5) {
      // Mix of urban cycling with some dedicated paths
      speed = 15;
    } else {
      // Longer routes with better infrastructure
      speed = 18;
    }
  }
  
  // Calculate time in hours
  const timeHours = distanceKm / speed;
  
  // Convert to minutes
  const timeMinutes = timeHours * 60;
  
  // Add a small fixed time overhead for starting/ending trips
  const overheadMinutes = mode === 'driving' ? 2 : (mode === 'cycling' ? 1 : 0);
  const totalMinutes = timeMinutes + overheadMinutes;
  
  // Format the time for display
  if (totalMinutes < 1) {
    return 'Less than 1 min';
  } else if (totalMinutes < 60) {
    return `${Math.round(totalMinutes)} min`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return `${hours} hr${hours > 1 ? 's' : ''} ${minutes > 0 ? `${minutes} min` : ''}`;
  }
}

/**
 * Creates an animated polyline between two points
 * @param map Leaflet map instance
 * @param start Start coordinates
 * @param end End coordinates
 * @param color Line color
 * @returns Promise that resolves when animation is complete
 */
export function createAnimatedLine(
  map: L.Map,
  start: [number, number],
  end: [number, number],
  color: string = '#3388ff'
): Promise<void> {
  return new Promise((resolve) => {
    const line = L.polyline([start, end], {
      color,
      weight: 3,
      opacity: 0.7,
      dashArray: '10, 10',
      dashOffset: '0'
    }).addTo(map);

    let offset = 0;
    const animate = () => {
      offset = (offset + 1) % 20;
      line.setStyle({ dashOffset: offset.toString() });
      requestAnimationFrame(animate);
    };

    animate();
    resolve();
  });
}

/**
 * Fetches nearby places using Overpass API
 * @param lat Center latitude
 * @param lng Center longitude
 * @param radius Search radius in meters
 * @param amenityType Type of amenity to search for
 * @returns Promise with array of nearby places
 */
export async function fetchNearbyPlaces(
  lat: number,
  lng: number,
  radius: number,
  amenityType: string
): Promise<any[]> {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="${amenityType}"](around:${radius},${lat},${lng});
      way["amenity"="${amenityType}"](around:${radius},${lat},${lng});
      relation["amenity"="${amenityType}"](around:${radius},${lat},${lng});
    );
    out body;
    >;
    out skel qt;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.elements || !Array.isArray(data.elements)) {
      console.warn('Invalid response from Overpass API:', data);
      return [];
    }
    
    // Process the elements to extract relevant information
    return data.elements.map((element: any) => {
      // Extract coordinates
      const lat = element.lat || (element.center && element.center.lat);
      const lon = element.lon || (element.center && element.center.lon);
      
      // Extract name
      const name = element.tags?.name || element.tags?.amenity || amenityType;
      
      // Extract additional details
      const details = {
        id: element.id,
        type: amenityType,
        name,
        lat,
        lon,
        tags: element.tags || {}
      };
      
      return details;
    }).filter((place: any) => place.lat && place.lon); // Filter out places without coordinates
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return [];
  }
}

/**
 * Creates a custom marker icon for nearby places
 * @param type Place type
 * @param distance Distance in kilometers
 * @param name Place name
 * @returns L.DivIcon instance
 */
export function createNearbyPlaceIcon(
  type: string,
  distance: number,
  name: string
): L.DivIcon {
  const icons: Record<string, string> = {
    school: '🏫',
    hospital: '🏥',
    restaurant: '🍽️',
    mall: '🛍️',
    park: '🌳',
    gym: '💪',
    pharmacy: '💊',
    bank: '🏦',
    atm: '🏧',
    bus_station: '🚌',
    train_station: '🚉',
    airport: '✈️'
  };

  const colors: Record<string, string> = {
    school: '#4CAF50',      // Green
    hospital: '#F44336',    // Red
    restaurant: '#FF9800',  // Orange
    mall: '#9C27B0',        // Purple
    park: '#8BC34A',        // Light Green
    gym: '#2196F3',         // Blue
    pharmacy: '#00BCD4',    // Cyan
    bank: '#795548',        // Brown
    atm: '#607D8B',         // Blue Grey
    bus_station: '#FFC107', // Amber
    train_station: '#3F51B5',// Indigo
    airport: '#E91E63'      // Pink
  };

  return L.divIcon({
    className: 'custom-place-marker',
    html: `
      <div class="flex flex-col items-center">
        <div class="rounded-full px-2 py-1 text-xs font-bold text-white shadow-lg flex items-center justify-center mb-1"
             style="background-color: ${colors[type] || '#666'}">
          <span class="mr-1">${icons[type] || '📍'}</span>
          <span>${distance.toFixed(1)} km</span>
        </div>
        <div class="bg-white px-2 py-0.5 text-xs font-bold rounded shadow text-center text-black" 
             style="white-space: nowrap; max-width: 100px; overflow: hidden; text-overflow: ellipsis;">
          ${name || type}
        </div>
      </div>
    `,
    iconSize: [100, 40],
    iconAnchor: [50, 20],
    popupAnchor: [0, -20]
  });
}
