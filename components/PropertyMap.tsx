import React, { useEffect, useRef, useState } from 'react';
import { Property } from '@shared/schema';
import { ENV } from '../config/env';
import {
  initGoogleMaps,
  createPropertyMarker,
  createNearbyPlaceMarker,
  createAnimatedLine,
  createRadiusCircle,
  calculateRoadDistance,
  fetchNearbyPlaces,
  getGoogleRoadDistance,
  fetchNearbyPlacesFromMapMyIndia
} from '../lib/googleMapUtils';
import './PropertyMapPanels.css';
import { formatPrice } from '@/lib/data';
import { Badge } from './ui/badge';
import PropertyPriceOverlay from './ui/Maps/PropertyPriceOverlay';
import { removeClassFromElement } from '@/lib/utils';
import { REUSABLE_CLASS_NAMES } from '@/lib/Contants';
import MapmyIndiaClusterMap from './Maps/MapmyIndiaClusterMap';

interface PropertyMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onPropertySelect: (property: Property | null) => void;
  mapType: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  onMapTypeChange: (type: 'roadmap' | 'satellite' | 'hybrid' | 'terrain') => void;
  isLoading?: boolean;
  isError?: boolean;
  onBoundChange?:(data:any)=>void;
}

const LAYER_OPTIONS = [
  { id: 'roadmap', label: 'Map' },
  { id: 'satellite', label: 'Satellite' },
  { id: 'hybrid', label: 'Hybrid' }
];

const NEARBY_TYPES = [
  { id: 'famous_place', label: 'Famous Places' },
  { id: 'hospital', label: 'Hospitals' },
  { id: 'shopping_mall', label: 'Shopping' },
  { id: 'movie_theater', label: 'Movie Theatres' },
  { id: 'school', label: 'Schools/Colleges' },
  { id: 'university', label: 'Universities' },
  { id: 'airport', label: 'Airport/Helipads' },
  { id: 'bus_station', label: 'Bus Stops' },
  { id: 'train_station', label: 'Railway Stations' },
  { id: 'subway_station', label: 'Metro Stations' },
  { id: 'hotel', label: 'Hotel and Restaurants' },
  { id: 'cafe', label: 'Cafe' },
  { id: 'bank', label: 'Banks' },
  { id: 'park', label: 'Parks' },
  { id: 'library', label: 'Library' },
  { id: 'police', label: 'Police Stations' },
  { id: 'gym', label: 'Fitness' },
  { id: 'place_of_worship', label: 'Religious Places' },
];

// Use the environment configuration
const GOOGLE_MAPS_API_KEY = ENV.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Google Maps style presets
const MAP_STYLES = [
  { id: 'default', label: 'Default', style: null },
  {
    id: 'silver', label: 'Silver', style: [
      { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
      { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
      { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
      { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
      { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
      { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
      { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
      { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
      { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
      { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
      { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] }
    ]
  },
  {
    id: 'retro', label: 'Retro', style: [
      { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
      { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#c9b2a6' }] },
      { featureType: 'administrative.land_parcel', elementType: 'geometry.stroke', stylers: [{ color: '#dcd2be' }] },
      { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#ae9e90' }] },
      { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
      { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#93817c' }] },
      { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#a5b076' }] },
      { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#447530' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f5f1e6' }] },
      { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#fdfcf8' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#f8c967' }] },
      { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#e9bc62' }] },
      { featureType: 'road.highway.controlled_access', elementType: 'geometry', stylers: [{ color: '#e98d58' }] },
      { featureType: 'road.highway.controlled_access', elementType: 'geometry.stroke', stylers: [{ color: '#db8555' }] },
      { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#806b63' }] },
      { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
      { featureType: 'transit.line', elementType: 'labels.text.fill', stylers: [{ color: '#8f7d77' }] },
      { featureType: 'transit.line', elementType: 'labels.text.stroke', stylers: [{ color: '#ebe3cd' }] },
      { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
      { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#b9d3c2' }] },
      { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#92998d' }] }
    ]
  },
  {
    id: 'night', label: 'Night', style: [
      { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
      { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
      { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
      { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
      { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
      { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
      { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
      { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
      { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
      { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
      { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] }
    ]
  },
  {
    id: 'dark', label: 'Dark', style: [
      { elementType: 'geometry', stylers: [{ color: '#212121' }] },
      { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
      { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#757575' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#212121' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#181818' }] },
      { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#2c2c2c' }] },
      { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212121' }] },
      { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
      { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2c2c2c' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
      { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d3d3d' }] }
    ]
  },
  {
    id: 'aubergine', label: 'Aubergine', style: [
      { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
      { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
      { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#64779e' }] },
      { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
      { featureType: 'landscape.man_made', elementType: 'geometry.stroke', stylers: [{ color: '#334e87' }] },
      { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#023e58' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283d6a' }] },
      { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6f9ba5' }] },
      { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#023e58' }] },
      { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#3C7680' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
      { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
      { featureType: 'road', elementType: 'labels.text.stroke', stylers: [{ color: '#1d2c4d' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2c6675' }] },
      { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#255763' }] },
      { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#b0d5ce' }] },
      { featureType: 'road.highway', elementType: 'labels.text.stroke', stylers: [{ color: '#023e58' }] },
      { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
      { featureType: 'transit', elementType: 'labels.text.stroke', stylers: [{ color: '#1d2c4d' }] },
      { featureType: 'transit.line', elementType: 'geometry.fill', stylers: [{ color: '#283d6a' }] },
      { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#3a4762' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
      { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4e6d70' }] }
    ]
  },
];

export default function PropertyMap({ properties, selectedProperty, onPropertySelect, mapType, onMapTypeChange, isLoading, isError,onBoundChange }: PropertyMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const nearbyMarkersRef = useRef<google.maps.Marker[]>([]);
  const linesRef = useRef<google.maps.Polyline[]>([]);
  const radiusCircleRef = useRef<google.maps.Circle | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>(mapType);
  const [radius, setRadius] = useState<number>(5000);
  const [activeNearbyType, setActiveNearbyType] = useState<string>('');
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [selectedMapStyle, setSelectedMapStyle] = useState('default');
  // Collapsible state
  const [layersOpen, setLayersOpen] = useState(false);
  const [nearbyOpen, setNearbyOpen] = useState(false);
  // Selected nearby marker
  const [selectedNearbyPlaceId, setSelectedNearbyPlaceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedSearchPlace, setSelectedSearchPlace] = useState<any>(null);
  const searchMarkerRef = useRef<google.maps.Marker | null>(null);
  const searchLineRef = useRef<google.maps.Polyline | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const markerClickedRef = useRef(false);
  const [propsHover, setPropsHover]: any = useState(undefined);
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        if (!GOOGLE_MAPS_API_KEY) {
          return;
        }

        await initGoogleMaps(GOOGLE_MAPS_API_KEY);

        if (mapContainerRef.current && !mapRef.current) {
          mapRef.current = new google.maps.Map(mapContainerRef.current, {
            center: { lat: 26.8467, lng: 80.9462 }, // Lucknow coordinates
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            gestureHandling: 'greedy',
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });
          setMap(mapRef.current);
          // Add click listener to deselect property when clicking on empty map space
          mapRef.current.addListener('click', (e: google.maps.MapMouseEvent) => {
            console.log('map-clicked')
            setTimeout(() => {
              if (markerClickedRef.current) {
                markerClickedRef.current = false;
                return;
              }
              onPropertySelect(null);
              removeClassFromElement(REUSABLE_CLASS_NAMES.ACTIVE_PROPERTY);
            }, 0);
          });


          // Create initial markers for properties
          if (properties.length > 0) {
            //createPropertyMarkers();
          }
        }
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
      }
    };

    initMap();
  }, []);

  // Function to create property markers
  const createPropertyMarkers = () => {
    if (!mapRef.current) return;
    console.log('Creating markers for properties:', properties);

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Create new markers
    properties.forEach(property => {
      console.log('Creating marker for property:', property);
      const marker = createPropertyMarker(
        mapRef.current!,
        property,
        selectedProperty?.id === property.id,
        (objdata: any) => {
          setPropsHover(undefined)
          console.log('Hover', objdata?.latLng?.lat())
          markerClickedRef.current = true;
          //onPropertySelect(property);
          setTimeout(() => {
            handleMouseOver(new google.maps.LatLng(objdata?.latLng?.lat(), objdata?.latLng?.lng()));
            setPropsHover(property);
          }, 100)
        },
        () => {
          handleMouseOut()
        }
      );
      //markersRef.current.push(marker);
    });
  };

  // Update markers when properties change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.addListener('idle', () => {
        const bounds = mapRef?.current?.getBounds();

        if (!bounds) return;

        // Filter only properties that are currently visible in the map bounds
        const visibleProperties = properties.filter((property) =>
          bounds.contains(new google.maps.LatLng(property.latitude, property.longitude))
        );
        onBoundChange?.(visibleProperties);
        // Update sidebar (call your update function or use state)
        //updateSidebarList(visibleProperties);
      });
    }
    //console.log('Properties changed:', properties);
    //createPropertyMarkers();
  }, [properties]);

  // Update map type when it changes
  useEffect(() => {
    if (mapRef.current) {
      const mapTypeId = {
        roadmap: google.maps.MapTypeId.ROADMAP,
        satellite: google.maps.MapTypeId.SATELLITE,
        hybrid: google.maps.MapTypeId.HYBRID,
        terrain: google.maps.MapTypeId.TERRAIN
      }[selectedLayer];

      mapRef.current.setMapTypeId(mapTypeId);
    }
  }, [selectedLayer]);

  // Fetch and show nearby places
  useEffect(() => {
    if (!selectedProperty || !activeNearbyType) {
      nearbyMarkersRef.current.forEach(marker => marker.setMap(null));
      nearbyMarkersRef.current = [];
      setNearbyPlaces([]);
      return;
    }
    setLoadingNearby(true);
    const location = new window.google.maps.LatLng(selectedProperty.latitude, selectedProperty.longitude);
    // fetchNearbyPlacesFromMapMyIndia({lat:selectedProperty?.latitude, lng:selectedProperty?.longitude},radius,activeNearbyType).then((response:any)=>{
    //   console.log('response');
    //   console.log(response);
    //   setNearbyPlaces(response);
    // })
    fetchNearbyPlaces(mapRef.current as google.maps.Map, location, radius, activeNearbyType).then(places => {
      setNearbyPlaces(places);
      nearbyMarkersRef.current.forEach(marker => marker.setMap(null));
      nearbyMarkersRef.current = [];
      console.log('places')
      console.log(places)
      console.log(radius)
      places.forEach(place => {
        if (mapRef.current) {
          const marker = createNearbyPlaceMarker(
            mapRef.current,
            place,
            activeNearbyType,
            place.roadDistanceValue,
            () => setSelectedNearbyPlaceId(place.place_id),
            selectedNearbyPlaceId === place.place_id
          );
          nearbyMarkersRef.current.push(marker);
        }
      });
      setLoadingNearby(false);
    });
  }, [selectedProperty, activeNearbyType, radius, selectedNearbyPlaceId]);

  // Update map style when selectedMapStyle changes
  useEffect(() => {
    if (mapRef.current) {
      const styleObj = MAP_STYLES.find(s => s.id === selectedMapStyle);
      mapRef.current.setOptions({ styles: styleObj?.style || null });
    }
  }, [selectedMapStyle]);

  // Add map click listener to deselect nearby marker
  useEffect(() => {
    if (!mapRef.current) return;
    const listener = mapRef.current.addListener('click', () => {
      setSelectedNearbyPlaceId(null);
    });
    return () => {
      if (listener) listener.remove();
    };
  }, [mapRef.current]);

  // Function to handle place search
  const handlePlaceSearch = async (query: string) => {
    if (!mapRef.current || !query.trim()) {
      setSearchResults([]);
      return;
    }

    const service = new google.maps.places.PlacesService(mapRef.current);
    const request = {
      query,
      fields: ['name', 'geometry', 'place_id', 'formatted_address']
    };

    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    });
  };

  // Function to handle search result selection
  const handleSearchResultSelect = async (place: any) => {
    if (!mapRef.current || !selectedProperty) return;

    // Clear previous search marker and line
    if (searchMarkerRef.current) {
      searchMarkerRef.current.setMap(null);
    }
    if (searchLineRef.current) {
      searchLineRef.current.setMap(null);
    }

    // Ensure location is a google.maps.LatLng object
    let placeLocation = place.geometry.location;
    if (!(placeLocation instanceof google.maps.LatLng)) {
      placeLocation = new google.maps.LatLng(placeLocation.lat, placeLocation.lng);
    }
    console.log('placeLocation')
    console.log(placeLocation)
    // Create new marker for selected place
    const marker = new google.maps.Marker({
      position: placeLocation,
      map: mapRef.current,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="70" height="62" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="20" r="18" fill="#4CAF50" stroke="#fff" stroke-width="2"/>
            <text x="35" y="26" font-family="Arial" font-size="22" fill="#fff" text-anchor="middle" dominant-baseline="middle">🔍</text>
            <rect x="0" y="42" rx="5" ry="5" width="70" height="20" fill="#4CAF50" opacity="1" />
            <text x="35" y="55" font-family="Arial" font-size="12" fill="#fff" text-anchor="middle" dominant-baseline="middle" font-weight="bold">Search</text>
          </svg>
        `),
        scaledSize: new google.maps.Size(70, 62),
        anchor: new google.maps.Point(35, 31),
      }
    });

    // Calculate and display distance
    const propertyLocation = new google.maps.LatLng(selectedProperty.latitude, selectedProperty.longitude);
    let distance = await getGoogleRoadDistance(propertyLocation, placeLocation);
    console.log('Distance Matrix API result:', distance);

    // Fallback to straight-line distance if API fails
    let distanceText = 'N/A';
    if (distance && distance.text) {
      distanceText = distance.text;
    } else {
      try {
        if (window.google && window.google.maps && window.google.maps.geometry && window.google.maps.geometry.spherical) {
          const straightLine = window.google.maps.geometry.spherical.computeDistanceBetween(propertyLocation, placeLocation);
          distanceText = (straightLine / 1000).toFixed(2) + ' km';
          console.log('Fallback straight-line distance:', distanceText);
        }
      } catch (e) {
        console.warn('Could not compute straight-line distance', e);
      }
    }

    // Draw line if possible
    const line = new google.maps.Polyline({
      path: [propertyLocation, placeLocation],
      strokeColor: '#4CAF50',
      strokeOpacity: 0.7,
      strokeWeight: 3,
      icons: [{
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 3,
          strokeColor: '#4CAF50',
        },
        offset: '50%',
      }],
    });
    line.setMap(mapRef.current);
    searchLineRef.current = line;

    // Update marker with distance (or fallback)
    marker.setIcon({
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="70" height="62" xmlns="http://www.w3.org/2000/svg">
          <circle cx="35" cy="20" r="18" fill="#4CAF50" stroke="#fff" stroke-width="2"/>
          <text x="35" y="26" font-family="Arial" font-size="22" fill="#fff" text-anchor="middle" dominant-baseline="middle">🔍</text>
          <rect x="0" y="42" rx="5" ry="5" width="70" height="20" fill="#4CAF50" opacity="1" />
          <text x="35" y="55" font-family="Arial" font-size="12" fill="#fff" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${distanceText}</text>
        </svg>
      `),
      scaledSize: new google.maps.Size(70, 62),
      anchor: new google.maps.Point(35, 31),
    });

    searchMarkerRef.current = marker;
    setSelectedSearchPlace(place);
    setSearchResults([]);
    setSearchQuery(place.name);
  };

  // Handle search input changes with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handlePlaceSearch(query);
    }, 300);
  };
  const handleMouseOver = (latLng: google.maps.LatLng,item:any) => {
    if (!mapRef.current) return;

    const scale = Math.pow(2, mapRef.current.getZoom()!);
    const bounds = mapRef.current.getBounds();
    const projection = mapRef.current.getProjection();
    if (!bounds || !projection) return;

    const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
    const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
    const point = projection.fromLatLngToPoint(latLng);

    const x = (point!.x - bottomLeft!.x) * scale;
    const y = (point!.y - topRight!.y) * scale;

    setPosition({ x, y });
    setHovered(true);
    document.getElementById("property-"+item?.id)?.classList?.remove('hovered')
    document.getElementById("property-"+item?.id)?.classList?.remove('shadow-xl')
    document.getElementById("property-"+item?.id)?.classList?.add('hovered')
    document.getElementById("property-"+item?.id)?.classList?.add('shadow-xl')
    //onPropertySelect(propsHover);
  };

  const handleMouseOut = () => {
    console.log('mouseOut')
    setHovered(false);
    document.getElementsByClassName("hovered")?.[0]?.classList?.remove('shadow-xl');
    document.getElementsByClassName("hovered")?.[0]?.classList?.remove('hovered');
  };
  // Clear search when selected property changes
  useEffect(() => {
    if (searchMarkerRef.current) {
      searchMarkerRef.current.setMap(null);
    }
    if (searchLineRef.current) {
      searchLineRef.current.setMap(null);
    }
    setSearchQuery('');
    setSearchResults([]);
    setSelectedSearchPlace(null);
  }, [selectedProperty]);

  if (isError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Map Error</h3>
          <p className="text-gray-700">{'An error occurred while loading the map'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full h-full">
        {/* Top Controls Row: Nearby Places | Search | Layers */}
        <div className="absolute top-4 left-0 right-0 z-20 flex flex-row items-start justify-center w-full px-4 gap-4"
          style={{ pointerEvents: 'none', zIndex: 999 }}
        >
          {/* Nearby Places Panel (Left) */}
          {selectedProperty &&
            <div
              className={`map-nearby-panel panel-card${nearbyOpen ? ' open' : ''}`}
              style={{ pointerEvents: 'auto', minWidth: 260, maxWidth: 360, zIndex: 9999 }}
            >
              <button
                onClick={e => { e.stopPropagation(); setNearbyOpen(v => !v); if (!nearbyOpen) setLayersOpen(false); }}
                className="panel-toggle-btn"
                aria-expanded={nearbyOpen}
                aria-controls="nearby-panel"
              >
                <span>Nearby Places</span>
                <span className="panel-arrow">{nearbyOpen ? '▾' : '▸'}</span>
              </button>
              <div
                id="nearby-panel"
                className="panel-content p-3"
                style={{
                  maxHeight: nearbyOpen ? 1000 : 0,
                  opacity: nearbyOpen ? 1 : 0,
                  pointerEvents: nearbyOpen ? 'auto' : 'none',
                  transition: 'max-height 0.35s cubic-bezier(.4,0,.2,1), opacity 0.25s cubic-bezier(.4,0,.2,1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {/* Radius Meter */}
                <div className="space-y-1 mb-2">
                  <label className="text-xs font-medium text-gray-700">Search Radius</label>
                  <input
                    type="range"
                    min={500}
                    max={20000}
                    step={100}
                    value={radius}
                    onChange={e => setRadius(Number(e.target.value))}
                    className="radius-slider w-full"
                    aria-label="Nearby search radius"
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>0.5 km</span>
                    <span>{(radius / 1000).toFixed(1)} km</span>
                    <span>20 km</span>
                  </div>
                </div>
                {/* Nearby Types Grid */}
                <div className="grid grid-cols-3 gap-2" style={{ width: '100%' }}>
                  {NEARBY_TYPES.map(type => (
                    <button
                      key={type.id}
                      className={`nearby-type-btn${activeNearbyType === type.id ? ' active' : ''}`}
                      onClick={() => { setActiveNearbyType(activeNearbyType === type.id ? '' : type.id) }}
                      aria-label={type.label}
                      title={type.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 8px',
                        borderRadius: 8,
                        background: activeNearbyType === type.id ? '#2563eb' : '#f3f4f6',
                        color: activeNearbyType === type.id ? '#fff' : '#374151',
                        border: 'none',
                        transition: 'background 0.18s, color 0.18s',
                        cursor: 'pointer',
                        fontSize: 11,
                        width: '100%',
                        textAlign: 'left',
                        margin: 0,
                        minHeight: 36,
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        maxWidth: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      <span style={{ fontSize: 20 }}>
                        {({
                          famous_place: '🏙️',
                          hospital: '🏥',
                          shopping_mall: '🛍️',
                          movie_theater: '🎬',
                          school: '🏫',
                          university: '🎓',
                          airport: '✈️',
                          bus_station: '🚌',
                          train_station: '🚉',
                          subway_station: '🚇',
                          hotel: '🏨',
                          cafe: '☕',
                          bank: '🏦',
                          park: '🏞️',
                          library: '📚',
                          police: '👮',
                          gym: '🏋️',
                          place_of_worship: '🕌',
                        } as Record<string, string>)[type.id] || '📍'}
                      </span>
                      <span style={{ fontSize: 11 }}>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          }
          {/* Search Bar (center) */}
          {selectedProperty &&
            <div className="flex-1 flex flex-col items-center min-w-[220px] max-w-md" style={{ pointerEvents: 'auto', zIndex: 9999 }}>
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search place to show it from preferred property"
                  className="main-search-bar w-full px-4 py-2 rounded-lg shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  style={{ height: 48, minWidth: 220, maxWidth: 480 }}
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((place) => (
                      <button
                        key={place.place_id}
                        onClick={() => { handleSearchResultSelect(place) }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      >
                        <div className="font-medium">{place.name}</div>
                        <div className="text-sm text-gray-600">{place.formatted_address}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          }
          {/* Layers Panel (Right) */}
          <div
            className={`map-layers-panel panel-card${layersOpen ? ' open' : ''}`}
            style={{ pointerEvents: 'auto', minWidth: 120, maxWidth: 160 }}
          >
            <button
              onClick={e => { e.stopPropagation(); setLayersOpen(v => !v); if (!layersOpen) setNearbyOpen(false); }}
              className="panel-toggle-btn"
              aria-expanded={layersOpen}
              aria-controls="maptype-panel"
            >
              <span>Map Type</span>
              <span className="panel-arrow">{layersOpen ? '▾' : '▸'}</span>
            </button>
            <div
              id="maptype-panel"
              className="panel-content"
              style={{
                maxHeight: layersOpen ? 400 : 0,
                opacity: layersOpen ? 1 : 0,
                pointerEvents: layersOpen ? 'auto' : 'none',
                transition: 'max-height 0.35s cubic-bezier(.4,0,.2,1), opacity 0.25s cubic-bezier(.4,0,.2,1)',
                padding: layersOpen ? '12px 0 8px 0' : '0',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {LAYER_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  className={`layer-btn${selectedLayer === opt.id ? ' active' : ''}`}
                  onClick={() => { setSelectedLayer(opt.id as 'roadmap' | 'satellite' | 'hybrid' | 'terrain'); onMapTypeChange(opt.id as 'roadmap' | 'satellite' | 'hybrid' | 'terrain'); }}
                  aria-label={opt.label}
                  title={opt.label}
                  style={{
                    fontSize: 11,
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: selectedLayer === opt.id ? '#2563eb' : '#f3f4f6',
                    color: selectedLayer === opt.id ? '#fff' : '#374151',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'background 0.18s, color 0.18s',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    margin: 0,
                  }}
                >
                  {opt.id === 'roadmap' && <span role="img" aria-label="Map">🗺️</span>}
                  {opt.id === 'satellite' && <span role="img" aria-label="Satellite">🛰️</span>}
                  {opt.id === 'hybrid' && <span role="img" aria-label="Hybrid">🌐</span>}
                  <span style={{ fontSize: 11, fontWeight: 500 }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div
          ref={mapContainerRef}
          className="map-container w-full h-full"
          style={{ minHeight: '400px' }}
        >
          {map && (
            <>
              {properties && properties?.map((item: any, index: any) => {
                return <PropertyPriceOverlay
                  key={index}
                  map={map}
                  position={{ lat: item?.latitude, lng: item?.longitude }}
                  price={formatPrice(item?.price)}
                  onHover={() => { setPropsHover(item);; handleMouseOver(new google.maps.LatLng(item?.latitude, item?.longitude),item) }}
                  onLeave={() => { handleMouseOut() }}
                  onClickMarker={(e: any) => {
                    e?.stopPropagation();     // Prevent map click
                    e?.preventDefault();
                    onPropertySelect(item)
                  }}
                  id={item?.id}
                />
              })}
            </>
          )}
        </div>
        {/* {properties?.length > 0 &&
          <MapmyIndiaClusterMap
            onLeave={() => { handleMouseOut() }}
            onHover={(item: any) => { handleMouseOver(new google.maps.LatLng(item?.latitude, item?.longitude)) }}
            onClickMarker={(e: any,item:any) => {
              //e?.stopPropagation();     // Prevent map click
              //e?.preventDefault();
              onPropertySelect(item)
            }}
            properties={properties} 
            activeNearbyType={activeNearbyType}
            selectedProperty={selectedProperty}
            nearByPlaces={(selectedProperty && nearbyPlaces)?nearbyPlaces:[]}/>
        } */}
        {/* Loading Nearby */}
        {loadingNearby && (
          <div className="loading-indicator">
            <div className="loading-spinner" />
            <span>Loading nearby places...</span>
          </div>
        )}

      </div>
      {hovered && propsHover &&
        <div
          style={{
            position: 'absolute',
            top: position.y,
            left: position.x,
            background: '#fff',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'auto',
            transition: 'opacity 0.3s ease-in-out',
            zIndex: 1000,
          }}
          className='property-hover'>
          <div
            key={propsHover.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onPropertySelect && onPropertySelect(propsHover)}
          >
            <div className="relative">
              <div className="h-32 bg-gray-200">
                {propsHover.featuredImage ? (
                  <img
                    src={propsHover.featuredImage}
                    alt={propsHover.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                )}
                {propsHover.isFeatured && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Featured
                  </div>
                )}
                <Badge
                  className="absolute top-2 right-2 bg-primary text-white"
                  variant="default"
                >
                  {propsHover.propertyType}
                </Badge>
              </div>
            </div>

            <div className="p-3">
              <h3 className="font-semibold text-primary truncate">{propsHover.title}</h3>
              <p className="text-gray-600 text-xs flex items-center mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {propsHover.location}
              </p>

              <div className="mt-2 flex justify-between items-center border-t pt-2">
                <span className="font-bold text-primary">{formatPrice(propsHover.price)}</span>
                <div className="text-xs text-gray-600">
                  <span>{propsHover.area} sq.ft</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}
