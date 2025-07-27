import { Property, PropertyFilter } from "@shared/schema";
import { apiRequest } from "./queryClient";

/**
 * Format a price for display (e.g., ₹90L or ₹1.2Cr)
 * @param price Price in INR
 * @returns Formatted price string
 */
export function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)}Cr`;
  } else {
    return `₹${(price / 100000).toFixed(0)}L`;
  }
}

/**
 * Searches properties using filter criteria
 * @param filter Property filter criteria
 * @returns Promise with filtered properties
 */
export async function searchProperties(filter: PropertyFilter): Promise<Property[]> {
  try {
    const response = await apiRequest('POST', '/api/properties/search', filter);
    return await response.json();
  } catch (error) {
    console.error('Error searching properties:', error);
    throw error;
  }
}

/**
 * Get featured properties
 * @param limit Number of properties to return
 * @returns Promise with featured properties
 */
export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  try {
    const response = await fetch(`/api/properties/featured/${limit}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch featured properties: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    throw error;
  }
}

/**
 * Get a single property by ID
 * @param id Property ID
 * @returns Promise with property details
 */
export async function getPropertyById(id: number): Promise<Property> {
  try {
    const response = await fetch(`/api/properties/${id}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch property: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching property #${id}:`, error);
    throw error;
  }
}

/**
 * Get nearby places for a property
 * @param propertyId Property ID
 * @returns Promise with nearby places
 */
export async function getNearbyPlaces(propertyId: number): Promise<any[]> {
  try {
    const response = await fetch(`/api/properties/${propertyId}/nearby`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch nearby places: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching nearby places for property #${propertyId}:`, error);
    throw error;
  }
}

/**
 * Format an area value with unit
 * @param area Area in sq.ft
 * @returns Formatted area string
 */
export function formatArea(area: number): string {
  return `${area.toLocaleString()} sq.ft`;
}

/**
 * Get property type display value
 * @param type Property type code
 * @returns Human-readable property type
 */
export function getPropertyTypeDisplay(type: string): string {
  switch (type) {
    case '1BHK':
      return '1 BHK';
    case '2BHK':
      return '2 BHK';
    case '3BHK':
      return '3 BHK';
    case '4BHK':
      return '4 BHK';
    default:
      return type;
  }
}
