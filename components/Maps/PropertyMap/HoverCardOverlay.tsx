// PropertyGoogleMap/MarkerHoverCard.tsx
'use client'
import React from 'react';

interface MarkerHoverCardProps {
    propsHover: any;
    position: { x: number; y: number };
    onPropertySelect?: (property: any) => void;
}

export const MarkerHoverCard: React.FC<MarkerHoverCardProps> = ({
    propsHover,
    position,
    onPropertySelect
}) => {
    return (
        <div
            className="absolute z-[999] bg-white rounded shadow-md p-2 text-sm w-64"
            style={{ top: position.y + 10, left: position.x + 10 }}
            onClick={() => onPropertySelect?.(propsHover)}
        >
            <div className="font-bold">{propsHover?.title}</div>
            <div className="text-gray-500">{propsHover?.location}</div>
            <div className="mt-1 text-green-600 font-semibold">
                ₹{propsHover?.price?.toLocaleString()}
            </div>
        </div>
    );
};
