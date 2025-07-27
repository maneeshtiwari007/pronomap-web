/**
 * Open Street Map (OSM) API integration for fetching nearby places
 * This module uses the Overpass API which is a free and open-source read-only API 
 * for OpenStreetMap data
 */

import axios from 'axios';
import { getBoundingBox, calculateRoadDistance, estimateTravelTime } from './mapUtils';
import queryOverpass from 'query-overpass';

// Categories of places we can search for
export type PlaceCategory = 
  | 'hospital' 
  | 'school' 
  | 'college' 
  | 'mall' 
  | 'restaurant'
  | 'park'
  | 'gym'
  | 'stadium'
  | 'pharmacy'
  | 'bank'
  | 'atm'
  | 'airport'
  | 'bus'
  | 'hotels'
  | 'parks';

// Overpass API endpoint
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// Mapping of place categories to OSM tags for Overpass queries
const OSM_TAG_MAPPING: Record<PlaceCategory, string[]> = {
  hospital: ['amenity=hospital', 'healthcare=hospital'],
  school: ['amenity=school', 'building=school'],
  college: ['amenity=college', 'building=college', 'amenity=university'],
  mall: ['shop=mall', 'building=retail', 'amenity=marketplace'],
  restaurant: ['amenity=restaurant', 'amenity=fast_food', 'amenity=food_court'],
  park: ['leisure=park', 'leisure=garden'],
  gym: ['leisure=fitness_centre', 'leisure=sports_centre'],
  stadium: ['leisure=stadium', 'building=stadium'],
  pharmacy: ['amenity=pharmacy', 'healthcare=pharmacy'],
  bank: ['amenity=bank'],
  atm: ['amenity=atm'],
  airport: ['aeroway=aerodrome', 'aeroway=terminal'],
  bus: ['amenity=bus_station', 'highway=bus_stop'],
  hotels: ['tourism=hotel', 'building=hotel'],
  parks: ['leisure=water_park', 'leisure=theme_park', 'leisure=recreation_ground']
};

// Route colors by category
export const ROUTE_COLORS: Record<PlaceCategory, string> = {
  hospital: '#EF4444', // Red
  school: '#3B82F6',   // Blue
  college: '#8B5CF6',  // Purple
  mall: '#F59E0B',     // Amber/Yellow
  restaurant: '#F97316', // Orange
  park: '#10B981',     // Green
  gym: '#6366F1',      // Indigo
  stadium: '#EC4899',  // Pink
  pharmacy: '#14B8A6', // Teal
  bank: '#0EA5E9',     // Sky blue
  atm: '#6B7280',      // Gray
  airport: '#06B6D4',  // Cyan
  bus: '#EAB308',      // Yellow
  hotels: '#4F46E5',   // Indigo
  parks: '#84CC16'     // Lime
};

// Emoji icons for each category
export const CATEGORY_ICONS: Record<PlaceCategory, string> = {
  hospital: '🏥',
  school: '🏫',
  college: '🎓',
  mall: '🛍️',
  restaurant: '🍽️',
  park: '🏞️',
  gym: '💪',
  stadium: '🏟️',
  pharmacy: '💊',
  bank: '🏦',
  atm: '💰',
  airport: '✈️',
  bus: '🚌',
  hotels: '🏨',
  parks: '🎡'
};

// Human-readable names for each category
export const CATEGORY_NAMES: Record<PlaceCategory, string> = {
  hospital: 'Hospital',
  school: 'School',
  college: 'College',
  mall: 'Shopping Mall',
  restaurant: 'Restaurant',
  park: 'Park',
  gym: 'Gym',
  stadium: 'Stadium',
  pharmacy: 'Pharmacy',
  bank: 'Bank',
  atm: 'ATM',
  airport: 'Airport',
  bus: 'Bus Terminal',
  hotels: 'Hotel',
  parks: 'Adventure Park'
};

/**
 * Construct an Overpass QL query for a specific place category within a radius
 * @param lat Latitude of center point
 * @param lng Longitude of center point
 * @param category Place category to search for
 * @param radiusKm Radius in kilometers
 * @returns Overpass QL query string
 */
function buildOverpassQuery(
  lat: number,
  lng: number,
  category: PlaceCategory,
  radiusKm: number
): string {
  const tags = OSM_TAG_MAPPING[category];
  const radius = radiusKm * 1000; // Convert to meters for Overpass
  
  // Build more efficient query for better results
  const tagQueries = tags.map(tag => {
    const [key, value] = tag.split('=');
    return `
      node["${key}"="${value}"](around:${radius},${lat},${lng});
      way["${key}"="${value}"](around:${radius},${lat},${lng});
      relation["${key}"="${value}"](around:${radius},${lat},${lng});
    `;
  }).join('\n');
  
  return `
    [out:json][timeout:30];
    (
      ${tagQueries}
    );
    out body center;
    >;
    out skel qt;
  `;
}

/**
 * Process OSM result features to a simplified format
 * @param features Raw GeoJSON features from Overpass
 * @param type Place category
 * @param propertyLat Source property latitude for distance calculation
 * @param propertyLng Source property longitude for distance calculation
 * @returns Array of processed nearby places
 */
function processOsmFeatures(
  features: any[], 
  type: PlaceCategory,
  propertyLat: number,
  propertyLng: number
): any[] {
  return features
    .filter(feature => 
      // Filter out features without properties or without names
      feature.properties && 
      (feature.properties.name || feature.properties.tags?.name)
    )
    .map(feature => {
      // Extract coordinates
      let latitude, longitude;
      
      if (feature.geometry.type === 'Point') {
        [longitude, latitude] = feature.geometry.coordinates;
      } else if (feature.geometry.type === 'Polygon') {
        // For polygons, use the centroid
        const coords = feature.geometry.coordinates[0];
        let sumLat = 0, sumLng = 0;
        coords.forEach((coord: number[]) => {
          sumLng += coord[0];
          sumLat += coord[1];
        });
        latitude = sumLat / coords.length;
        longitude = sumLng / coords.length;
      } else {
        // For other types, try to use first coordinate
        if (feature.geometry.coordinates && feature.geometry.coordinates.length) {
          if (Array.isArray(feature.geometry.coordinates[0])) {
            [longitude, latitude] = feature.geometry.coordinates[0];
          } else {
            [longitude, latitude] = feature.geometry.coordinates;
          }
        }
      }
      
      // Ensure we extracted valid coordinates
      if (!latitude || !longitude) return null;
      
      // Extract name from properties
      const name = feature.properties.name || 
                   feature.properties.tags?.name || 
                   CATEGORY_NAMES[type];
      
      // Calculate distances
      const directDistance = calculateDistance(propertyLat, propertyLng, latitude, longitude);
      const roadDistance = calculateRoadDistance(propertyLat, propertyLng, latitude, longitude);
      
      // Calculate travel time estimates
      const drivingTime = estimateTravelTime(roadDistance, 'driving');
      const walkingTime = estimateTravelTime(roadDistance, 'walking');
      
      // Return simplified place object with enhanced distance data
      return {
        id: feature.id || `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        type,
        latitude,
        longitude,
        directDistance, // As the crow flies
        distance: roadDistance, // Estimated road distance
        travelTime: drivingTime,
        walkingTime,
        // Add additional details from tags if available
        address: feature.properties.tags?.['addr:street'] || '',
        phone: feature.properties.tags?.phone || '',
        website: feature.properties.tags?.website || '',
        openingHours: feature.properties.tags?.opening_hours || '',
        // Add raw properties for debugging
        rawData: feature.properties
      };
    })
    .filter(Boolean) // Remove nulls
    .sort((a, b) => {
      // Add null-safety check
      if (!a || !b) return 0;
      // Sort by distance
      return a.distance - b.distance;
    });
}

/**
 * Use Overpass API to fetch nearby places
 * @param lat Latitude of center point (property)
 * @param lng Longitude of center point (property)
 * @param category Type of place to search for
 * @param radiusKm Radius in kilometers
 * @returns Promise with nearby places
 */
export function fetchNearbyPlaces(
  lat: number,
  lng: number,
  category: PlaceCategory,
  radiusKm: number = 5
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    // Build the Overpass query for this category
    const query = buildOverpassQuery(lat, lng, category, radiusKm);
    
    // Use the query-overpass package to execute the query
    queryOverpass(query, (error: Error | null, data: any) => {
      if (error) {
        console.error(`Error fetching ${category} places:`, error);
        // Resolve with empty array instead of rejecting, to gracefully handle API failures
        resolve([]);
        return;
      }
      
      try {
        // Process the results into our simplified format
        const processed = processOsmFeatures(data.features, category, lat, lng);
        resolve(processed);
      } catch (err) {
        console.error(`Error processing ${category} data:`, err);
        resolve([]);
      }
    });
  });
}

/**
 * Fetch multiple categories of nearby places
 * @param lat Latitude of center point (property)
 * @param lng Longitude of center point (property)
 * @param categories Array of place categories to search for
 * @param radiusKm Radius in kilometers
 * @returns Promise with nearby places grouped by category
 */
export async function fetchMultiCategoryNearbyPlaces(
  lat: number,
  lng: number,
  categories: PlaceCategory[],
  radiusKm: number = 5
): Promise<Record<PlaceCategory, any[]>> {
  // Initialize results object
  const results: Partial<Record<PlaceCategory, any[]>> = {};
  
  // Fetch places for each requested category in parallel
  await Promise.all(
    categories.map(async (category) => {
      try {
        const places = await fetchNearbyPlaces(lat, lng, category, radiusKm);
        results[category] = places;
      } catch (err) {
        console.error(`Failed to fetch ${category} places:`, err);
        results[category] = [];
      }
    })
  );
  
  return results as Record<PlaceCategory, any[]>;
}

/**
 * Simplified function to get nearby places of all categories
 * @param lat Latitude of center point (property)
 * @param lng Longitude of center point (property)
 * @param radiusKm Radius in kilometers
 * @returns Promise with all nearby places grouped by category
 */
export function getAllNearbyPlaces(
  lat: number,
  lng: number,
  radiusKm: number = 5
): Promise<Record<PlaceCategory, any[]>> {
  const allCategories: PlaceCategory[] = [
    'hospital', 'school', 'college', 'mall', 'restaurant',
    'park', 'gym', 'stadium', 'pharmacy', 'bank', 'atm',
    'airport', 'bus', 'hotels', 'parks'
  ];
  
  return fetchMultiCategoryNearbyPlaces(lat, lng, allCategories, radiusKm);
}

/**
 * Get an approximation of road routing for drawing routes
 * between two points using OSM data. For more accurate routes,
 * a dedicated routing API would be better, but this gives a good
 * visual approximation using OSM nodes.
 * 
 * @param lat1 Start latitude
 * @param lng1 Start longitude
 * @param lat2 End latitude
 * @param lng2 End longitude
 * @returns Promise with array of coordinate pairs for route
 */
export function getApproximateRoute(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): Promise<[number, number][]> {
  return new Promise((resolve, reject) => {
    // Get a bounding box that covers both points
    const [minLng, minLat, maxLng, maxLat] = getBoundingBox(
      (lat1 + lat2) / 2, 
      (lng1 + lng2) / 2,
      Math.max(5, calculateDistance(lat1, lng1, lat2, lng2) * 1.5)
    );
    
    // Query for highways within the bounding box
    const query = `
      [out:json][timeout:25];
      (
        way["highway"](${minLat},${minLng},${maxLat},${maxLng});
      );
      out body;
      >;
      out skel qt;
    `;
    
    queryOverpass(query, (error: Error | null, data: any) => {
      if (error) {
        console.error("Error fetching route data:", error);
        // If we can't get route data, just return a direct line
        resolve([[lat1, lng1], [lat2, lng2]]);
        return;
      }
      
      try {
        // This is a simplified approach that doesn't use real routing
        // A proper routing algorithm would use A* or similar
        // Here we just find some roads and fit a route-like path
        
        // Extract ways and nodes from the data
        const highways = data.features.filter((f: any) => 
          f.properties.tags && f.properties.tags.highway
        );
        
        // If we don't have enough road data, return direct line
        if (highways.length < 3) {
          resolve([[lat1, lng1], [lat2, lng2]]);
          return;
        }
        
        // Simple approximation: start point, 1-3 intermediate points, end point
        const route: [number, number][] = [[lat1, lng1]];
        
        // Get a middle point from one of the highways
        let middlePointAdded = false;
        
        for (const highway of highways) {
          if (highway.geometry.type === "LineString") {
            const coords = highway.geometry.coordinates;
            if (coords.length > 2) {
              // Add a middle point from this highway
              const midIndex = Math.floor(coords.length / 2);
              route.push([coords[midIndex][1], coords[midIndex][0]]);
              middlePointAdded = true;
              break;
            }
          }
        }
        
        // If we couldn't add a middle point, add an artificial one
        if (!middlePointAdded) {
          route.push([
            (lat1 + lat2) / 2 + (Math.random() * 0.001 - 0.0005),
            (lng1 + lng2) / 2 + (Math.random() * 0.001 - 0.0005)
          ]);
        }
        
        // Add the end point
        route.push([lat2, lng2]);
        
        resolve(route);
      } catch (err) {
        console.error("Error processing route data:", err);
        resolve([[lat1, lng1], [lat2, lng2]]);
      }
    });
  });
}

/**
 * Calculate distance between two coordinates in kilometers
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

/**
 * Convert degrees to radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}