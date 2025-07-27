// CustomMarker.tsx
'use client'
import React from 'react';
import { OverlayView } from '@react-google-maps/api';
import { formatPrice } from '@/lib/data';
import '@/styles/PropertyPriceOverlay.css';

interface CustomMarkerProps {
  map: google.maps.Map | null;
  property: any;
  isActive: boolean;
  onClick: () => void;
  onHover: (pos: { x: number; y: number }, prop: any) => void;
  onHoverOut: () => void;
}

export const CustomMarker: React.FC<CustomMarkerProps> = ({
  map,
  property,
  isActive,
  onClick,
  onHover,
  onHoverOut,
}) => {
  const getPositionOnMap = (lat: number, lng: number): { x: number; y: number } => {
    const projection = map?.getProjection();
    const bounds = map?.getBounds();
    const scale = Math.pow(2, map?.getZoom() || 12);

    if (!projection || !bounds) return { x: 0, y: 0 };

    const point:any = projection.fromLatLngToPoint({ lat, lng } as any);
    const topRight:any = projection.fromLatLngToPoint(bounds.getNorthEast());
    const bottomLeft:any = projection.fromLatLngToPoint(bounds.getSouthWest());

    return {
      x: (point.x - bottomLeft.x) * scale,
      y: (point.y - topRight.y) * scale,
    };
  };

  const handleMouseEnter = () => {
    if (!map) return;
    const pos = getPositionOnMap(property.latitude, property.longitude);
    onHover(pos, property);
  };

  return (
    <OverlayView
      position={{ lat: property.latitude, lng: property.longitude }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={onHoverOut}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
        className={`custom-marker ${isActive ? 'hovered' : ''} animate-in`}
      >
        {formatPrice(property.price)}
        <div className="marker-arrow" />
      </div>
    </OverlayView>
  );
};
