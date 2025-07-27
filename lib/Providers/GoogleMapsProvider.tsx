'use client';
import React, { createContext, useContext } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { CONST_API_KEY } from '@/lib/Constant';

const GoogleMapsContext = createContext({
  isLoaded: false,
  loadError: null as null | Error,
});

export const GoogleMapsProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, loadError }:any = useJsApiLoader({
    googleMapsApiKey: CONST_API_KEY.GOOGLE_MAPS_KEY,
    libraries: ['places'],
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => useContext(GoogleMapsContext);