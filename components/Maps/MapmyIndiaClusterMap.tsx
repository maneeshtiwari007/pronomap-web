// components/MapmyIndiaClusterMap.tsx
import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "@/components/Maps/MapmyIndiaMap.css";
import { formatPrice } from "@/lib/data";
import ReactDOM from "react-dom/client";
import PerpetyHoverCard from "./PerpetyHoverCard";
import { icons, REUSABLE_CLASS_NAMES } from "@/lib/Contants";
declare global {
    interface Window {
        L: any;
    }
}

const API_KEY = "d408967dc438621fef941e1e274da74e"; // Replace with your API key

declare global {
    interface Window {
        L: any;
    }
}
interface Props {
    properties: any;
    onHover?: (e: any) => void;
    onLeave?: () => void;
    onClickMarker?: (e: any, item: any) => void;
    id?: any;
    nearByPlaces?: any;
    activeNearbyType?: any;
    selectedProperty?: any;
}

const MapmyIndiaClusterMap = ({
    properties,
    nearByPlaces,
    activeNearbyType,
    selectedProperty,
    onHover,
    onLeave,
    onClickMarker,
}: Props) => {
    const [map, setMap]: any = useState();
    useEffect(() => {
        // Load Leaflet from window
        const mapContainer: any = document.getElementById("map");
        if (mapContainer && mapContainer._leaflet_id != null) {
            mapContainer._leaflet_id = null; // reset if already initialized
        }
        const L = window.L;
        const map = L.map("map").setView([26.8467, 80.9462], 12); // Delhi
        setMap(map);
        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        // Create cluster group
        const markerClusterGroup = L.markerClusterGroup();
        if (properties) {
            properties?.forEach((element: any, i: number) => {
                const lat = element?.latitude;
                const lng = element?.longitude;

                const divIcon = L.divIcon({
                    html: `<div class="custom-marker animate-in" id='marker-${element?.id
                        }'>${formatPrice(
                            element?.price
                        )} <div class='marker-arrow'></div></div>`,
                    className: "",
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                });

                const marker = L.marker([lat, lng], { icon: divIcon }); // ✅ fixed here
                marker.on("mouseover", () => {
                    const popupDiv = document.createElement("div");
                    const elemtClass: any = document.getElementsByClassName(
                        REUSABLE_CLASS_NAMES.ACTIVE_PROPERTY
                    );
                    if (elemtClass?.length > 0) {
                        elemtClass?.[0]?.classList?.remove(
                            REUSABLE_CLASS_NAMES.ACTIVE_PROPERTY
                        );
                    }
                    document
                        .getElementById("marker-" + element?.id)
                        ?.classList.add(REUSABLE_CLASS_NAMES.ACTIVE_PROPERTY);
                    // Render your React component into popupDiv
                    ReactDOM.createRoot(popupDiv).render(
                        <PerpetyHoverCard propsHover={element} />
                    );
                    const popup = L.popup({
                        closeButton: false,
                        className: "hover-popup",
                    })
                        .setLatLng([lat, lng])
                        .setContent(popupDiv)
                        .openOn(map);
                    onHover?.(element);
                    const tiles: any = document.querySelector(".leaflet-zoom-animated");
                    if (tiles) {
                        tiles.style.left = "20px"; // Example value
                        tiles.style.bottom = "10px"; // Example value
                    }
                });

                marker.on("mouseleave", () => {
                    console.log("Leave");
                    const elemtClass: any = document.getElementsByClassName(
                        REUSABLE_CLASS_NAMES.ACTIVE_PROPERTY
                    );
                    if (elemtClass?.length > 0) {
                        elemtClass?.[0]?.classList?.remove(
                            REUSABLE_CLASS_NAMES.ACTIVE_PROPERTY
                        );
                    }
                    map.closePopup();
                    onLeave?.();
                });
                marker.on("click", (e: any) => {
                    console.log("Click");
                    console.log(e);
                    console.log(element);
                    onClickMarker?.(e, element);
                });

                markerClusterGroup.addLayer(marker);
            });
        }
        // Generate 100 random markers
        // for (let i = 0; i < 100; i++) {
        //     const lat = 28.61 + Math.random() * 0.1;
        //     const lng = 77.23 + Math.random() * 0.1;
        //     const marker = L.marker([lat, lng]);

        //     // Custom popup on hover
        //     marker.on('mouseover', () => {
        //         const popup = L.popup({
        //             closeButton: false,
        //             className: 'hover-popup',
        //         })
        //             .setLatLng([lat, lng])
        //             .setContent(`<div class="popup-content">Location ${i + 1}</div>`)
        //             .openOn(map);
        //     });

        //     marker.on('mouseout', () => {
        //         map.closePopup();
        //     });

        //     markerClusterGroup.addLayer(marker);
        // }

        map.addLayer(markerClusterGroup);
    }, []);
    useEffect(() => {
        console.log("nearByPlaces");
        console.log(selectedProperty)
        console.log(nearByPlaces);
        console.log(activeNearbyType);
        const L = window.L;
        const mainWindow: any = window;
        if (selectedProperty && map && mainWindow?.MapmyIndia) {
            mainWindow?.mappls?.nearby(
                {
                    map: map,
                    keywords: "restaurant", // Can be 'ATM', 'hospital', etc.
                    refLocation: selectedProperty?.latitude + "," + selectedProperty?.longitude,
                    icon: "https://maps.mapmyindia.com/images/2.png", // Optional custom icon
                    popupHtml: function (poi: any) {
                        return `<strong>${poi.placeName}</strong><br/>${poi.placeAddress}`;
                    },
                },
                function (result: any) {
                    const restultData:any = result;
                    console.log(restultData);
                    if (Array.isArray(restultData?.data)) {
                        restultData?.data?.forEach((place:any) => {
                            console.log(place)
                            if (place.marker && place.marker._latlng) {
                                console.log("Name:", place.poi.placeName);
                                console.log("Lat:", place.marker._latlng.lat);
                                console.log("Lng:", place.marker._latlng.lng);
                            }
                        });
                    }
                }
            );
        }
        if (nearByPlaces?.length > 0) {
            const isSelected = false;
            nearByPlaces?.forEach((place: any) => {
                const lat = parseFloat(place.latitude);
                const lng = parseFloat(place.longitude);
                const name = place.name || place.poi;
                const boxColor = isSelected ? "#43A047" : "#ffd700";
                const icon = activeNearbyType ? icons[activeNearbyType] || "📍" : "📍";
                const markerIcon = L.divIcon({
                    html: `<div class='custom-near-by'>
      <svg width="74" height="62" xmlns="http://www.w3.org/2000/svg">
        <circle cx="34" cy="20" r="18" fill="#ffd700" stroke="#003c8f" stroke-width="2"/>
        <text x="34" y="26" font-family="Arial" font-size="22" fill="#003c8f" text-anchor="middle" dominant-baseline="middle">${icon}</text>
        <rect x="0" y="42" rx="5" ry="5" width="74" height="20" fill="${boxColor}" opacity="1" />
        <text x="34" y="55" font-family="Arial" font-size="12" fill="#003c8f" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${place?.distance}</text>
      </svg>
    </div>`,
                    className: '',
                    iconSize: [100, 40],
                    iconAnchor: [50, 40],
                });

                const marker = L.marker([lat, lng], { icon: markerIcon }); // ✅ FIXED

                marker.on('mouseover', () => {
                    L.popup({ closeButton: false })
                        .setLatLng([lat, lng])
                        .setContent(`<strong>${name}</strong>`)
                        .openOn(map);
                });

                marker.on('mouseout', () => {
                    map.closePopup();
                });

                marker.addTo(map); // or add to markerClusterGroup if using clusters
            });

        }
    }, [nearByPlaces]);
    return (
        <div
            id="map"
            style={{
                height: "600px",
                width: "100%",
                borderRadius: "10px",
                overflow: "hidden",
            }}
        />
    );
};

export default MapmyIndiaClusterMap;
