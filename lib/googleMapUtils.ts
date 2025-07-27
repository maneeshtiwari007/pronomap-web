import { ENV } from "@/config/env";
import { Property } from "@shared/schema";

// Define types for Google Maps
declare global {
  interface Window {
    google: any;
  }
}

// Initialize Google Maps
export function initGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
}

// Format price in Lacs and Crores
const formatPrice = (price: number): string => {
  if (price >= 10000000) {
    // 1 Crore = 10 Million
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  } else {
    return `₹${(price / 100000).toFixed(2)} L`;
  }
};

// Create custom property marker
export function createPropertyMarker(
  map: google.maps.Map,
  property: Property,
  isSelected: boolean,
  onClick: Function,
  onMouseOut: () => void
) {
  // Only show price, not project name
  const price = property.price;
  let priceLabel = "";
  if (price >= 10000000) {
    priceLabel = `₹${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    priceLabel = `₹${(price / 100000).toFixed(2)} Lac`;
  } else {
    priceLabel = `₹${price}`;
  }
  const marker = new google.maps.Marker({
    position: { lat: property.latitude, lng: property.longitude },
    map,
    icon: {
      url: `data:image/svg+xml;utf8,<svg width='80' height='36' xmlns='http://www.w3.org/2000/svg'><rect x='0' y='0' width='80' height='36' rx='8' fill='${
        isSelected ? "%2343A047" : "%231E90FF"
      }'/><text x='40' y='22' font-size='16' font-family='Arial' font-weight='bold' fill='white' text-anchor='middle'>${priceLabel}</text></svg>`,
      scaledSize: new google.maps.Size(80, 36),
      anchor: new google.maps.Point(40, 18),
    },
    zIndex: isSelected ? 999 : 1,
  });
  marker.addListener("mouseover", onClick);
  marker.addListener("mouseout", onMouseOut);
  return marker;
}

// Create custom nearby place marker (red circle with white icon)
export const createNearbyPlaceMarker = (
  map: google.maps.Map,
  place: any,
  type: string,
  distance: number,
  onClick: () => void,
  isSelected: boolean = false
): google.maps.Marker => {
  const icons: { [key: string]: string } = {
    school: "🏫",
    hospital: "🏥",
    restaurant: "🍽️",
    shopping_mall: "🛍️",
    park: "🌳",
    gym: "💪",
    pharmacy: "💊",
    bank: "🏦",
    atm: "🏧",
    bus_station: "🚌",
    train_station: "🚉",
    airport: "✈️",
    college: "🎓",
    university: "🎓",
    subway_station: "🚇",
    library: "📚",
    police: "👮",
    fire_station: "🚒",
    post_office: "🏤",
    hotel: "🏨",
    community_centre: "🏢",
    sports_complex: "🏟️",
    movie_theater: "🎬",
    place_of_worship: "🕌",
    government_office: "🏛️",
    apartment: "🏢",
    commercial_complex: "🏬",
    industrial: "🏭",
    parking: "🅿️",
    cafe: "☕",
  };
  const icon = icons[type] || "📍";

  // Fallback: if distance is 0 or missing, use straight-line distance
  let displayDistance = distance;
  if (
    !displayDistance &&
    place.geometry &&
    place.geometry.location &&
    map &&
    map.getCenter
  ) {
    try {
      const mapCenter = map.getCenter();
      if (
        window.google &&
        window.google.maps &&
        window.google.maps.geometry &&
        window.google.maps.geometry.spherical
      ) {
        displayDistance =
          window.google.maps.geometry.spherical.computeDistanceBetween(
            mapCenter,
            place.geometry.location
          );
      }
    } catch {}
  }
  const distanceKm = displayDistance
    ? (displayDistance / 1000).toFixed(1)
    : "?";

  const boxColor = isSelected ? "#43A047" : "#ffd700";

  const marker = new google.maps.Marker({
    position: place.geometry.location,
    map,
    icon: {
      url:
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
        <svg width="44" height="62" xmlns="http://www.w3.org/2000/svg">
          <circle cx="22" cy="20" r="18" fill="#ffd700" stroke="#003c8f" stroke-width="2"/>
          <text x="22" y="26" font-family="Arial" font-size="22" fill="#003c8f" text-anchor="middle" dominant-baseline="middle">${icon}</text>
          <rect x="0" y="42" rx="5" ry="5" width="44" height="20" fill="${boxColor}" opacity="1" />
          <text x="22" y="55" font-family="Arial" font-size="12" fill="#003c8f" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${distanceKm} km</text>
        </svg>
      `),
      scaledSize: new google.maps.Size(44, 62),
      anchor: new google.maps.Point(22, 31),
    },
    clickable: true,
    title: place.name,
  });
  marker.addListener("click", onClick);
  marker.addListener("mousemove", () => {
    console.log("Mouse enter");
  });
  return marker;
};

// Create animated polyline
export function createAnimatedLine(
  map: google.maps.Map,
  start: google.maps.LatLng,
  end: google.maps.LatLng,
  color: string = "#3388ff"
): google.maps.Polyline {
  const line = new google.maps.Polyline({
    path: [start, end],
    strokeColor: color,
    strokeOpacity: 0.7,
    strokeWeight: 3,
    icons: [
      {
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 3,
          strokeColor: color,
        },
        offset: "50%",
      },
    ],
  });

  line.setMap(map);
  return line;
}

// Create radius circle
export const createRadiusCircle = (
  map: google.maps.Map,
  center: google.maps.LatLng,
  radius: number
): google.maps.Circle => {
  return new google.maps.Circle({
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.1,
    map,
    center,
    radius,
  });
};

// Calculate road distance using Google Maps Distance Matrix Service
export async function calculateRoadDistance(
  start: google.maps.LatLng,
  end: google.maps.LatLng
): Promise<number> {
  const service = new google.maps.DistanceMatrixService();

  return new Promise((resolve, reject) => {
    service.getDistanceMatrix(
      {
        origins: [start],
        destinations: [end],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response: any, status: string) => {
        if (status !== "OK") {
          console.error("Distance Matrix Service error:", status);
          // Fallback to straight-line distance if service fails
          const straightLineDistance =
            google.maps.geometry.spherical.computeDistanceBetween(start, end);
          resolve(straightLineDistance / 1000); // Convert to km
          return;
        }

        try {
          if (!response?.rows?.[0]?.elements?.[0]) {
            throw new Error("Invalid response format");
          }

          const element = response.rows[0].elements[0];

          if (element.status === "OK" && element.distance) {
            resolve(element.distance.value / 1000); // Convert to km
          } else {
            // Fallback to straight-line distance if no route found
            const straightLineDistance =
              google.maps.geometry.spherical.computeDistanceBetween(start, end);
            resolve(straightLineDistance / 1000); // Convert to km
          }
        } catch (error) {
          console.error("Error processing distance:", error);
          // Fallback to straight-line distance on error
          const straightLineDistance =
            google.maps.geometry.spherical.computeDistanceBetween(start, end);
          resolve(straightLineDistance / 1000); // Convert to km
        }
      }
    );
  });
}

// Helper to get road distance using Google Distance Matrix API
// export async function getGoogleRoadDistance(origin: google.maps.LatLng, destination: google.maps.LatLng): Promise<{ text: string, value: number } | null> {
//   return new Promise((resolve) => {
//     const service = new google.maps.DistanceMatrixService();
//     service.getDistanceMatrix({
//       origins: [origin],
//       destinations: [destination],
//       travelMode: google.maps.TravelMode.DRIVING,
//       unitSystem: google.maps.UnitSystem.METRIC,
//     }, (response, status) => {
//       if (status === 'OK' && response && response.rows[0] && response.rows[0].elements[0].status === 'OK') {
//         const element = response.rows[0].elements[0];
//         resolve({ text: element.distance.text, value: element.distance.value });
//       } else {
//         resolve(null);
//       }
//     });
//   });
// }

export async function getGoogleRoadDistance(
  origin: google.maps.LatLng,
  destination: google.maps.LatLng
): Promise<{ text: string; value: number } | null> {
  const apiKey = ENV.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const response = await fetch(
    "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey!,
        "X-Goog-FieldMask": "distanceMeters,duration",
      },
      body: JSON.stringify({
        origins: [
          {
            waypoint: {
              location: {
                latLng: {
                  latitude: origin.lat(),
                  longitude: origin.lng(),
                },
              },
            },
          },
        ],
        destinations: [
          {
            waypoint: {
              location: {
                latLng: {
                  latitude: destination.lat(),
                  longitude: destination.lng(),
                },
              },
            },
          },
        ],
        travelMode: "DRIVE",
      }),
    }
  );

  const data = await response.json();
  if (data && data.length > 0 && data[0].distanceMeters != null) {
    const meters = data[0].distanceMeters;
    return {
      value: meters,
      text: meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`,
    };
  }

  return null;
}

// Map our category IDs to Google Maps place types
const PLACE_TYPE_MAPPING: { [key: string]: string[] } = {
  famous_place: [
    "tourist_attraction",
    "natural_feature",
    "point_of_interest",
    "museum",
    "historical_landmark",
    "park",
    "zoo",
    "aquarium",
    "church",
    "mosque",
    "hindu_temple",
    "synagogue",
    "art_gallery",
  ],
  hospital: ["hospital"],
  shopping_mall: ["shopping_mall", "department_store", "store", "supermarket"],
  movie_theater: ["movie_theater"],
  school: ["school", "secondary_school"],
  university: ["university"],
  airport: ["airport", "heliport"],
  bus_station: ["bus_station"],
  train_station: ["train_station"],
  subway_station: ["subway_station", "transit_station"],
  hotel: ["lodging", "resort", "restaurant"],
  cafe: ["cafe", "coffee_shop"],
  bank: ["bank", "atm"],
  park: ["park"],
  library: ["library"],
  police: ["police"],
  fire_station: ["fire_station"],
  gym: ["gym", "fitness_center", "sporting_goods_store"],
  place_of_worship: [
    "hindu_temple",
    "mosque",
    "church",
    "synagogue",
    "place_of_worship",
  ],
};

// Fetch nearby places using Google Places API with strict filtering, sorting, and real road distance
export async function fetchNearbyPlaces(
  map: google.maps.Map,
  location: google.maps.LatLng,
  radius: number,
  categoryId: string
) {
  return new Promise<any[]>(async (resolve) => {
    const service = new google.maps.places.PlacesService(map);
    const placeTypes = PLACE_TYPE_MAPPING[categoryId] || [categoryId];

    // Fetch places for each type in the category
    const allResults = await Promise.all(
      placeTypes.map(
        (type) =>
          new Promise<any[]>((resolveType) => {
            const request = {
              location,
              radius,
              type,
            };
            service.nearbySearch(request, (results, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                results
              ) {
                resolveType(results);
              } else {
                resolveType([]);
              }
            });
          })
      )
    );

    // Combine and deduplicate results
    const combinedResults = allResults.flat();
    const uniqueResults = Array.from(
      new Map(combinedResults.map((place) => [place.place_id, place])).values()
    );

    // Sort by user_ratings_total, then rating
    uniqueResults.sort((a, b) => {
      const aRatings = a.user_ratings_total || 0;
      const bRatings = b.user_ratings_total || 0;
      if (bRatings !== aRatings) return bRatings - aRatings;
      return (b.rating || 0) - (a.rating || 0);
    });

    // Limit results
    const limit = radius <= 2000 ? 8 : 15;
    const limited = uniqueResults.slice(0, limit);

    // For each, get real road distance
    const withDistance = await Promise.all(
      limited.map(async (place) => {
        let roadDistance = "";
        let roadDistanceValue = 0;
        if (place.geometry && place.geometry.location) {
          try {
            const dist = await getGoogleRoadDistance(
              location,
              place.geometry.location
            );
            if (dist) {
              roadDistance = dist.text;
              roadDistanceValue = dist.value;
            }
          } catch {
            roadDistance = "";
          }
        }
        return { ...place, roadDistance, roadDistanceValue };
      })
    );

    // Sort again by road distance (closest first)
    withDistance.sort((a, b) => a.roadDistanceValue - b.roadDistanceValue);
    resolve(withDistance);
  });
}
export async function fetchNearbyPlacesFromMapMyIndia(
  location: any,
  radius: number,
  categoryId: string
) {
  console.log(categoryId)
  try {
    const res:any = await fetch(
          `/api/nearby?lat=${location?.lat}&lng=${location?.lng}&keywords=${categoryId}&radius=${radius}`
        );
    const data = await res.json();
    // Add markers for each nearby location
    return data;
  } catch (error) {
    console.error("Nearby search failed", error);
  }
}

// Get user's current location
export function getCurrentLocation(): Promise<google.maps.LatLng> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(
          new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          )
        );
      },
      (error) => {
        reject(error);
      }
    );
  });
}

// Estimate travel time
export function estimateTravelTime(
  distanceKm: number,
  mode: "driving" | "walking" | "cycling" = "driving"
): string {
  // Base average speeds in km/h for different modes
  let speed = 30; // Default speed

  if (mode === "driving") {
    if (distanceKm < 3) speed = 18;
    else if (distanceKm < 7) speed = 25;
    else if (distanceKm < 15) speed = 35;
    else speed = 45;
  } else if (mode === "walking") {
    speed = distanceKm < 1 ? 4.2 : 5;
  } else if (mode === "cycling") {
    if (distanceKm < 2) speed = 12;
    else if (distanceKm < 5) speed = 15;
    else speed = 18;
  }

  const timeHours = distanceKm / speed;
  const timeMinutes = timeHours * 60;
  const overheadMinutes = mode === "driving" ? 2 : mode === "cycling" ? 1 : 0;
  const totalMinutes = timeMinutes + overheadMinutes;

  if (totalMinutes < 1) return "Less than 1 min";
  if (totalMinutes < 60) return `${Math.round(totalMinutes)} min`;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return `${hours} hr${hours > 1 ? "s" : ""} ${
    minutes > 0 ? `${minutes} min` : ""
  }`;
}
