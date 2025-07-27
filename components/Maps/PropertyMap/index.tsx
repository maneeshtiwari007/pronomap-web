// PropertyGoogleMap.tsx
'use client'
import React, { useMemo, useRef, useState } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { REUSABLE_CONSTANT } from '@/lib/Contants';
import { debounce } from '@/lib/utils';
import { MarkerHoverCard } from './HoverCardOverlay';
import { CustomMarker } from './CustomMarker';

interface PropertyMapProps {
  properties?: any;
  selectedProperty?: any;
  onPropertySelect?: (property: any) => void;
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  onMapTypeChange?: (type: 'roadmap' | 'satellite' | 'hybrid' | 'terrain') => void;
  isLoading?: boolean;
  isError?: boolean;
  onBoundChange?: (visible: any) => void;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

export const PropertyGoogleMap: React.FC<PropertyMapProps> = ({
  properties = [],
  selectedProperty,
  onPropertySelect,
  mapType,
  onMapTypeChange,
  isLoading,
  isError,
  onBoundChange,
}) => {
  const [center, setCenter] = useState({ lat: 26.8467, lng: 80.9462 });
  const [hoveredProperty, setHoveredProperty]:any = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REUSABLE_CONSTANT.GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  const handleOnBoundChange = () => {
    const bounds = mapRef.current?.getBounds();
    if (!bounds) return;

    const visible = properties.filter((p:any) =>
      bounds.contains({ lat: p.latitude, lng: p.longitude })
    );

    onBoundChange?.(visible);
  };

  const debouncedBoundChange = useMemo(
    () => debounce(handleOnBoundChange, 300),
    [properties]
  );

  if (loadError) return <div>Map failed to load.</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        mapTypeId={mapType}
        onLoad={(map:any) => (mapRef.current = map)}
        onIdle={debouncedBoundChange}
        onDragEnd={() => {
          const newCenter = mapRef.current?.getCenter();
          if (newCenter) {
            setCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
          }
        }}
        onClick={() => onPropertySelect?.(null)}
      >
        {properties.map((property:any) => (
          <CustomMarker
            key={property.id}
            map={mapRef.current}
            property={property}
            isActive={selectedProperty?.id === property.id}
            onClick={() => onPropertySelect?.(property)}
            onHover={(pos, prop) => {
              setHoverPosition(pos);
              setHoveredProperty(prop);
            }}
            onHoverOut={() => setHoveredProperty(null)}
          />
        ))}
      </GoogleMap>

      {hoveredProperty && (
        <MarkerHoverCard
          propsHover={hoveredProperty}
          position={hoverPosition}
          onPropertySelect={onPropertySelect}
        />
      )}
    </>
  );
};
