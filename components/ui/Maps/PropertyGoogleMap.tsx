// components/PropertyMap.tsx
'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    GoogleMap,
    Marker,
    InfoWindow,
    useLoadScript,
    OverlayView,
    LoadScript,
    GroundOverlay,
} from '@react-google-maps/api';
import { REUSABLE_CLASS_NAMES, REUSABLE_CONSTANT } from '@/lib/Contants';
import { Property } from '@shared/schema';
import PropertyPriceOverlay from './PropertyPriceOverlay';
import { formatPrice } from '@/lib/data';
import "@/styles/PropertyPriceOverlay.css";
import { Badge } from '../badge';
import { MarkerHoverCard } from './MarkerHoverCard';
import { addClassInElement, debounce, removeClassFromElement } from '@/lib/utils';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocationStore } from '@/hooks/useLocationStore';
import { reverseGeocode } from '@/lib/mapUtils';

interface PropertyMapProps {
    properties?: Property[];
    selectedProperty?: any;
    onPropertySelect?: (property: Property | null) => void;
    mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
    onMapTypeChange?: (type: 'roadmap' | 'satellite' | 'hybrid' | 'terrain') => void;
    isLoading?: boolean;
    isError?: boolean;
    onBoundChange?: (data: any) => void;
}

const containerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Delhi default

export const PropertyGoogleMap: React.FC<PropertyMapProps> = ({
    properties,
    selectedProperty,
    onPropertySelect,
    mapType,
    onMapTypeChange,
    isLoading,
    isError,
    onBoundChange
}) => {
    const [center, setCenter] = useState({ lat: 26.8467, lng: 80.9462 });
    const isMobile = useIsMobile();
    const { location,updateLocationData } = useLocationStore();
    // useState({
    //     lat: 35.1107,
    //     lng: -106.6100,
    // });
    //useState({ lat: 26.8467, lng: 80.9462 });
    // const bounds = {
    //     north: 35.1110,
    //     south: 35.1104,
    //     east: -106.6095,
    //     west: -106.6105,
    // };
    const mapRef = useRef<google.maps.Map | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: REUSABLE_CONSTANT.GOOGLE_MAPS_API_KEY || '',
        libraries: ['places'],
    });
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
    const [hovered, setHovered] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [propsHover, setPropsHover]: any = useState(undefined);
    const [clickedPropertyId, setClickedPropertyId] = useState<string | null>(null);



    const handleMouseOver = (latLng: any, item: any) => {
        if (!mapRef.current) return;
        if (item?.id) {
            const marker: any = document.getElementById("marker-" + item?.id);
            marker.classList.add("hovered");
        }
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
        document.getElementById("property-" + item?.id)?.classList?.remove('hovered')
        document.getElementById("property-" + item?.id)?.classList?.remove('shadow-xl')
        document.getElementById("property-" + item?.id)?.classList?.add('hovered')
        document.getElementById("property-" + item?.id)?.classList?.add('shadow-xl');
        setPropsHover(item)
        //onPropertySelect(propsHover);
    };
    const handleMouseLeave = (item: any) => {
        if (item?.id === clickedPropertyId) return;
        setPropsHover(undefined);
        if (!mapRef.current) return;
        if (item?.id) {
            const marker: any = document.getElementById("marker-" + item?.id);
            marker.classList.remove("hovered");
        }
        setHovered(false);
        document.getElementById("property-" + item?.id)?.classList?.remove('hovered')
        document.getElementById("property-" + item?.id)?.classList?.remove('shadow-xl');
        removeClassFromElement(REUSABLE_CLASS_NAMES.ACTIVE_PROPERTY);
        //onPropertySelect(propsHover);
    };
    const handleOnChangeBound = () => {
        if (!mapRef.current) return;

        const bounds = mapRef.current.getBounds();
        if (!bounds) return;

        const visibleProperties = properties?.filter((property) =>
            bounds.contains({ lat: property.latitude, lng: property.longitude })
        );
        onBoundChange?.(visibleProperties);
    }
    const getLocationData = async () => {
        console.log('location')
        console.log(location);
        console.log(isLoaded)
        setCenter({ lat: location?.lat, lng: location?.lng });
        const geoCode: any = await reverseGeocode(location?.lat, location?.lng);
        updateLocationData(geoCode)
        console.log(geoCode);
    }
    useEffect(() => {

        if (location?.lat) {
            getLocationData()
        }
    }, [location]);

    if (loadError) return <div>Map failed to load.</div>;
    if (!isLoaded) return <div>Loading map...</div>;
    return (
        <>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={(isMobile) ? 13 : 15}
                onClick={() => {
                    console.log('Map Clicked');
                    removeClassFromElement(REUSABLE_CLASS_NAMES.ACTIVE_PROPERTY);
                    setSelectedPropertyId(null)
                    setClickedPropertyId(null); // clear clicked marker
                    setHovered(false);
                    setPropsHover(undefined);
                }
                } // Close InfoWindow on map click
                onLoad={(map) => {
                    mapRef.current = map;
                }}
                onIdle={() => { handleOnChangeBound() }}
                onDragEnd={() => {
                    const newCenter = mapRef.current?.getCenter();
                    if (newCenter) {
                        setCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
                    }
                }}
                options={{
                    maxZoom: 18,
                    streetViewControl: true,
                    mapTypeControl: true,
                    fullscreenControl: true,
                    gestureHandling: 'greedy'
                }}
            >
                {/* <GroundOverlay
                    url="https://www.zillowstatic.com/floor_map/6ed2c5e0-9934-490d-b420-70bc605123bf/floor_shape/dd12d6fc57/compressed.svg" // Use public folder or remote URL
                    bounds={bounds}
                    opacity={0.7}
                    onLoad={() => {  }}
                    visible={true}
                /> */}
                {properties && properties?.map((item: any, index: any) => {
                    return <OverlayView
                        key={item?.id}
                        position={{ lat: item?.latitude, lng: item?.longitude }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}

                    >
                        <div
                            onMouseEnter={() => {
                                handleMouseOver({ lat: item?.latitude, lng: item?.longitude }, item);
                            }}
                            style={{
                                whiteSpace: 'nowrap',
                                minWidth: '80px',
                                maxWidth: '100px',
                                textAlign: 'center'
                            }}
                            onMouseLeave={() => {
                                handleMouseLeave(item)
                            }}
                            onClick={(e: any) => {
                                e?.stopPropagation();     // Prevent map click
                                e?.preventDefault();
                                removeClassFromElement(REUSABLE_CLASS_NAMES.ACTIVE_PROPERTY);
                                addClassInElement(REUSABLE_CLASS_NAMES.ACTIVE_PROPERTY, e);
                                onPropertySelect?.(item);
                                setClickedPropertyId(item?.id);
                                setHovered(true);
                                if (isMobile) {
                                    setPropsHover(item);
                                    const scale = Math.pow(2, mapRef?.current?.getZoom()!);
                                    const bounds = mapRef?.current?.getBounds();
                                    const projection = mapRef?.current?.getProjection();
                                    if (!bounds || !projection) return;

                                    const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
                                    const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
                                    const point = projection.fromLatLngToPoint({ lat: item?.latitude, lng: item?.longitude });

                                    const x = (point!.x - bottomLeft!.x) * scale;
                                    const y = (point!.y - topRight!.y) * scale;
                                    setPosition({ x, y });
                                }
                            }}
                            className='custom-marker animate-in' id={'marker-' + item?.id}>
                            {formatPrice(item?.price)}
                            <div className='marker-arrow'></div>
                        </div>
                    </OverlayView>
                })}
            </GoogleMap>
            {hovered && propsHover &&
                <Link href={`/property/${propsHover.id}`}><MarkerHoverCard propsHover={propsHover} position={position} onPropertySelect={(propsHover: any) => { console.log(propsHover); onPropertySelect?.(propsHover) }} /></Link>
            }
        </>
    );
};
