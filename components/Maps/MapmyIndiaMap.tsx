// MapmyIndiaMap.tsx
import React, { useEffect } from 'react';

const MapmyIndiaMap = () => {
    useEffect(() => {
        // Ensure MapmyIndia SDK is loaded
        if (!window.L) return;

        // Initialize map
        const map = window.L.map('map', {
            center: [28.61, 77.23], // New Delhi
            zoom: 13,
        });

        window.L.tileLayer(`https://apis.mapmyindia.com/advancedmaps/v1/{YOUR_API_KEY}/maptiles/{z}/{x}/{y}.png`, {
            maxZoom: 18,
            attribution: 'MapmyIndia',
        }).addTo(map);

        // Create Custom Icon
        const customIcon = window.L.divIcon({
            html: '<div class="marker-icon">🏠</div>',
            className: 'custom-marker',
            iconSize: [30, 42],
            iconAnchor: [15, 42],
        });

        // Add Marker
        const marker = window.L.marker([28.61, 77.23], { icon: customIcon }).addTo(map);

        // Hover popup using custom div
        const hoverPopup = window.L.popup({
            closeButton: false,
            autoClose: false,
            className: 'hover-popup',
        });

        marker.on('mouseover', (e:any) => {
            hoverPopup
                .setLatLng(e.latlng)
                .setContent('<div class="popup-content">This is a custom popup on hover!</div>')
                .openOn(map);
        });

        marker.on('mouseout', () => {
            map.closePopup(hoverPopup);
        });
    }, []);

    return (
        <div id="map" style={{ height: '500px', width: '100%' }}></div>
    );
};

export default MapmyIndiaMap;
