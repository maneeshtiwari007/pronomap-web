import React, { useEffect, useRef } from "react";
import "@/styles/PropertyPriceOverlay.css";
import { addClassInElement, removeClassFromElement } from "@/lib/utils";
import { REUSABLE_CLASS_NAMES } from "@/lib/Contants";

interface Props {
  map: google.maps.Map;
  position: google.maps.LatLngLiteral;
  price: string;
  onHover?: () => void;
  onLeave?: () => void;
  onClickMarker?: (e: any) => void;
  id?: any;
}

const PropertyPriceOverlay: React.FC<Props> = ({
  map,
  position,
  price,
  onHover,
  onLeave,
  onClickMarker,
  id
}) => {
  const overlayRef = useRef<any>(null);

  useEffect(() => {
    const overlay: any = new google.maps.OverlayView();

    overlay.onAdd = function () {
      const div = document.createElement("div");
      div.style.position = "absolute";

      const marker = document.createElement("div");
      marker.className = "custom-marker animate-in";
      marker.id = `marker-${id}`;
      marker.textContent = price;

      const arrow = document.createElement("div");
      arrow.className = "marker-arrow";
      marker.appendChild(arrow);

      marker.addEventListener("mousemove", () => {
        marker.classList.add("hovered");
        onHover?.();
      });

      marker.addEventListener("mouseout", () => {
        marker.classList.remove("hovered");
        onLeave?.();
      });

      marker.addEventListener("click", (e: any) => {
        removeClassFromElement(REUSABLE_CLASS_NAMES.ACTIVE_PROPERTY);
        addClassInElement(REUSABLE_CLASS_NAMES.ACTIVE_PROPERTY, e);
        onClickMarker?.(e);
      });

      marker.addEventListener("touchstart", (e: any) => {
        e.stopPropagation();
      });
      marker.addEventListener("touchend", (e: any) => {
        e.stopPropagation();
        onClickMarker?.(e);
      });

      // Remove bounce animation after it's done
      marker.addEventListener("animationend", () => {
        marker.classList.remove("animate-in");
      });

      div.appendChild(marker);
      overlay.div = div;
      overlay.getPanes().overlayMouseTarget.appendChild(div);
    };

    overlay.draw = function () {
      const projection = overlay.getProjection();
      const point = projection.fromLatLngToDivPixel(
        new google.maps.LatLng(position.lat, position.lng)
      );
      if (overlay.div && point) {
        overlay.div.style.left = `${point.x}px`;
        overlay.div.style.top = `${point.y}px`;
      }
    };

    overlay.onRemove = function () {
      if (overlay.div) {
        overlay.div.remove();
        overlay.div = null;
      }
    };

    overlay.setMap(map);
    overlayRef.current = overlay;

    return () => {
      overlay.setMap(null);
    };
  }, [map]); // Add `id` here in case of rerenders

  return null;
};

export default PropertyPriceOverlay;
