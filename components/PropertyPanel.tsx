'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlaceCategory, CATEGORY_NAMES, CATEGORY_ICONS } from "@/lib/osmApi";
import { useToast } from "@/hooks/use-toast";
import { addClassBasedOnId } from "@/lib/utils";
import { REUSABLE_CLASS_NAMES } from "@/lib/Contants";
import Link from "next/link";

interface PropertyPanelProps {
  property: any | null;
  onClose: () => void;
  onPropertySelect?: (property: []) => void;
  properties: any
}

export default function PropertyPanel({ properties, property, onClose, onPropertySelect }: PropertyPanelProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [activeNearbyFilter, setActiveNearbyFilter] = useState<PlaceCategory | null>(null);
  const [nearbyRadius, setNearbyRadius] = useState<number>(3); // Default 3 KM
  const [isLoadingNearby, setIsLoadingNearby] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all properties to display in the list when no property is selected
  // const { data: properties, isLoading } = useQuery<Property[]>({
  //   queryKey: ['/api/properties'],
  //   enabled: !property,
  // });

  // If no property is selected, show property listing
  useEffect(() => {
    console.log('property')
    console.log(property)
  }, [property])
  if (!property) {
    return (
      <div className="bg-white shadow-lg w-full overflow-y-auto z-10 h-auto md:h-auto max-h-screen">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-primary">Properties</h3>
          <p className="text-sm text-gray-600">{properties?.length || 0} properties available</p>
        </div>

        {isLoading ? (
          <div className="p-4 grid grid-cols-1 gap-4">
            {/* <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4"> */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-lg p-3 animate-pulse">
                <div className="w-full h-24 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="flex justify-between">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="p-4 grid grid-cols-2 gap-4 overflow-auto">
            {properties.map((prop: any) => (
              <div
                key={prop.id}
                id={"property-" + prop.id}
                className="border rounded-lg overflow-hidden shadow-sm  transition-shadow cursor-pointer hover:shadow-xl duration-300 transform hover:scale-[1.03]"
                onClick={() => onPropertySelect && onPropertySelect(prop)}
                onMouseEnter={() => { addClassBasedOnId('marker-' + prop.id, REUSABLE_CLASS_NAMES.ACTIVE_PROPERTY, 'add') }}
                onMouseLeave={() => { addClassBasedOnId('marker-' + prop.id, REUSABLE_CLASS_NAMES.ACTIVE_PROPERTY, 'remove') }}
              >
                <div className="relative">
                  <div className="h-32 bg-gray-200">
                    {prop.featuredImage ? (
                      <img
                        src={prop.featuredImage}
                        alt={prop.title}
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
                    {prop.isFeatured && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Featured
                      </div>
                    )}
                    <Badge
                      className="absolute top-2 right-2 bg-primary text-white"
                      variant="default"
                    >
                      {prop.propertyType}
                    </Badge>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="font-semibold text-primary truncate">{prop.title}</h3>
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
                    {prop.location}
                  </p>

                  <div className="mt-2 flex justify-between items-center border-t pt-2">
                    <span className="font-bold text-primary">{formatPrice(prop.price)}</span>
                    <div className="text-xs text-gray-600">
                      <span>{prop.area} sq.ft</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-600 mb-4">No properties are available at the moment.</p>
          </div>
        )}
      </div>
    );
  }

  // Toggle nearby places filter and notify parent component
  const toggleNearbyFilter = (filter: PlaceCategory) => {
    // Get previous state to determine if we're turning on or off
    const wasActive = activeNearbyFilter === filter;

    // Update local state
    if (wasActive) {
      setActiveNearbyFilter(null);
    } else {
      setActiveNearbyFilter(filter);
    }

    // If property is available, notify the map component via parent to show nearby places
    if (property) {
      // Create a custom event that the PropertyMap component can listen for
      const event = new CustomEvent('nearbyFilterChanged', {
        detail: {
          filter: wasActive ? null : filter,
          propertyId: property?.id,
          radius: nearbyRadius
        }
      });
      document.dispatchEvent(event);
    }
  };

  return (
    <div className="bg-white shadow-lg w-full overflow-y-auto z-10 h-auto md:h-auto" id="property-panel">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-primary">Selected Property</h3>
        {/* {isMobile && ( */}
          <Button variant="ghost" size="sm" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
        {/* )} */}
      </div>

      {/* Property Details */}
      <div className="p-4 animate-fadeIn">
        <div className="relative mb-4">
          <img
            src={property.featuredImage}
            alt={property.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          {property.tags && property.tags.length > 0 && (
            <div className="absolute top-2 right-2 bg-accent text-primary px-2 py-1 rounded text-xs font-bold">
              {property.tags[0]}
            </div>
          )}
        </div>

        <h4 className="font-poppins font-bold text-gray-900 text-xl mb-1">{property.title}</h4>
        <p className="text-gray-600 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 inline text-red-500 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {property.location}, Lucknow
        </p>

        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold text-primary">{formatPrice(property.price)}</div>
          <div className="text-sm text-gray-600">₹{property.pricePerSqFt}/sq.ft</div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-gray-100 rounded">
            <div className="text-sm text-gray-600">Type</div>
            <div className="font-medium">{property.propertyType}</div>
          </div>
          <div className="text-center p-2 bg-gray-100 rounded">
            <div className="text-sm text-gray-600">Area</div>
            <div className="font-medium">{property.area} sq.ft</div>
          </div>
          <div className="text-center p-2 bg-gray-100 rounded">
            <div className="text-sm text-gray-600">Floor</div>
            <div className="font-medium">{property.floors} of 12</div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="text-gray-700">{property.builder}</span>
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-gray-700">Possession: {property.possessionDate}</span>
          </div>
          {property.isVerified && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="text-gray-700">RERA Registered</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h5 className="font-medium text-gray-800">Project Details</h5>
          <div className="text-gray-700 text-sm whitespace-pre-line">
            {property.description || 'No additional details available.'}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Link href={`/property/${property.id}`}>
            <Button className="w-full bg-accent hover:bg-yellow-600 text-primary font-medium transition-colors">
              View Details
            </Button>
          </Link>
          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5">
            Contact Agent
          </Button>
        </div>
      </div>
    </div>
  );
}
