'use client'
import NewlyLaunchedProjects from "@/components/NewlyLaunchedProjects";
import PropertyPanel from "@/components/PropertyPanel";
//import { PropertyGoogleMap } from "@/components/ui/Maps/PropertyGoogleMap";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import propertiesApiData from '@/lib/api/properties.json';
import { PropertyGoogleMap } from "./ui/Maps/PropertyGoogleMap";
import { useSearchParams } from "next/navigation";
import { convertFromStringToObj } from "@/lib/utils";

export default function SearchPageComponent({ params }: any) {
    const { toast } = useToast();
    const isMobile = useIsMobile();
    const searchParams: any = useSearchParams()
    // State for map and property selection
    const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
    const [selectedProperty, setSelectedProperty] = useState<[] | null>(null);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(!isMobile);
    const [visibleProperties, setVisibleProperties] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const isError = undefined
    // State for filter
    const [filter, setFilter]: any = useState({
        location: [],
        propertyType: [],
        minPrice: undefined,
        maxPrice: undefined,
        builder: [],
        possessionDate: undefined
    });
    const [properties, setProperties]: any = useState();
    // Apply filters to properties client-side
    const filterProperties = (properties: any | undefined, filter: any) => {
        if (!properties) return [];

        return properties.filter((property: any) => {
            // Filter by location if selected
            // if (filter.location && filter.location.length > 0) {
            //     const locationMatch = filter?.location?.some((loc: any) =>
            //         property.location?.toLowerCase().includes(loc.toLowerCase())
            //     );
            //     if (!locationMatch) return false;
            // }
            if (filter.location && filter.location.length > 0) {
                const locationMatch = property.location?.toLowerCase().includes(filter?.location?.toLowerCase())
                if (!locationMatch) return false;
            }

            // Filter by property type
            if (filter.propertyType && filter.propertyType.length > 0) {
                if (!filter.propertyType.includes(property.propertyType)) return false;
            }

            // Filter by price range
            if (filter.minPrice && property.price < filter.minPrice) return false;
            if (filter.maxPrice && property.price > filter.maxPrice) return false;

            // Filter by bedrooms - ensure it's a string array for comparison
            if (filter.bedrooms && filter.bedrooms.length > 0) {
                // Convert property bedrooms to string for comparison
                const bedroomStr = property.bedrooms?.toString();
                if (!bedroomStr || !filter.bedrooms.includes(bedroomStr)) return false;
            }

            // Filter by floor
            if (filter.floor !== undefined && property.floors !== filter.floor) return false;

            // Filter by area range
            if (filter.minArea && property.area < filter.minArea) return false;
            if (filter.maxArea && property.area > filter.maxArea) return false;

            // Filter by builder
            if (filter.builder && filter.builder.length > 0) {
                if (!property.builder || !filter.builder.includes(property.builder)) return false;
            }

            // Filter by possession date (handle as prefix match to support formats like "Q2 2024" or "Dec 2024")
            if (filter.possessionDate && property.possessionDate) {
                if (!property.possessionDate.includes(filter.possessionDate)) return false;
            }

            // Filter by property status if specified
            if (filter.propertyStatus && filter.propertyStatus.length > 0) {
                if (!property.propertyStatus || !filter.propertyStatus.includes(property.propertyStatus as string)) return false;
            }

            return true;
        });
    };
    // const allProperties: any = filterProperties(propertiesApiData, filterObj);
    // console.log(allProperties);
    // const properties = filterProperties(allProperties, filter);
    // Handle search filter submission
    const handleFilterSubmit = (newFilter: any) => {

        setFilter(newFilter);
        setSelectedProperty(null); // Reset selected property when filters change

        toast({
            title: "Filters Applied",
            description: `Showing ${newFilter} matching properties`,
        });
    };

    const handlePropertySelect = (property: any | null) => {
        setSelectedProperty(property);
    };
    useEffect(() => {
        setHasMounted(true);
    }, []);
    useEffect(() => {
         if (!hasMounted) return;
        setProperties(undefined);
        const filterObj: any = convertFromStringToObj(searchParams?.toString())
        console.log(filterObj);
        const allProperties: any = filterProperties(propertiesApiData, filterObj);
        setProperties(allProperties);
        if (isMobile) {
            setVisibleProperties(allProperties);
        }
        handleFilterSubmit(allProperties?.length);
    }, [searchParams,hasMounted,isMobile])
    return (
        <>
            {/* Main Content: Map + Property List Two-Column Layout  max-w-[1400px]*/}
            <div className="mt-4 relative flex-1 w-full w-full mx-auto px-2 md:px-4 flex flex-col md:flex-row gap-0 md:gap-6" style={{ minHeight: '520px' }}>
                {/* Map Area */}
                <div className="w-full md:w-2/3 lg:w-3/4 flex-shrink-0 flex-grow-0 pl-4" style={{ maxHeight: 720, minHeight: 480 }}>
                    {/* <PropertyMap
                            properties={properties || []}
                            selectedProperty={selectedProperty}
                            onPropertySelect={(pr: any) => handlePropertySelect(pr)}
                            mapType={mapType}
                            onMapTypeChange={setMapType}
                            isLoading={isLoading}
                            isError={isError}
                            onBoundChange={(e:any)=>{setVisibleProperties(e)}}
                        /> */}
                    <PropertyGoogleMap
                        properties={properties || []}
                        selectedProperty={selectedProperty}
                        onPropertySelect={(pr: any) => handlePropertySelect(pr)}
                        mapType={mapType}
                        onMapTypeChange={setMapType}
                        isLoading={isLoading}
                        isError={isError}
                        onBoundChange={(e: any) => { setVisibleProperties(e) }}
                    />
                </div>
                {/* Property List/Panel - improved sizing and scroll */}
                <div
                    className="w-full md:w-[370px] lg:w-[400px] flex-shrink-0 flex-grow-0 md:h-[calc(100vh-160px)] max-h-[calc(100vh-160px)] overflow-y-auto bg-white rounded-lg shadow-md p-0 md:p-2"
                    style={{ minWidth: 320 }}
                >
                    {properties &&
                        <PropertyPanel
                            properties={(visibleProperties) ? visibleProperties : properties}
                            property={selectedProperty}
                            onClose={() => setSelectedProperty(null)}
                            onPropertySelect={handlePropertySelect}
                        />
                    }
                </div>
            </div>
            <NewlyLaunchedProjects />
        </>
    );
}