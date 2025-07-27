// components/PropertyPriceMarker.tsx
import React from "react";
import { OverlayView } from "@react-google-maps/api";

type Props = {
  lat: number;
  lng: number;
  price: string; // e.g., ₹92L, ₹1.2Cr
};

const PropertyPriceMarker: React.FC<Props> = ({ lat, lng, price }) => {
  return (
    <OverlayView
      position={{ lat, lng }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        style={{
          background: "#0a3d91", // Deep Blue
          color: "white",
          padding: "6px 14px",
          borderRadius: "8px",
          fontWeight: 600,
          fontSize: "14px",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          position: "relative",
        }}
      >
        {price}
        <div
          style={{
            position: "absolute",
            bottom: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "8px solid #0a3d91",
          }}
        />
      </div>
    </OverlayView>
  );
};

export default PropertyPriceMarker;
