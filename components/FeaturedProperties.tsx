'use client'
import { Skeleton } from "@/components/ui/skeleton";
import fetured from '@/lib/api/properties/featured.json';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatPrice } from "@/lib/data";
import { useEffect, useState } from "react";
import { ApiServices } from "@/lib/apiServices";
import Link from "next/link";
import { PropertyListCard } from "./PropertyListCard";

export default function FeaturedProperties() {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties]: any = useState();
  const isError: any = undefined;
  // Fetch featured properties
  const getListing = async () => {
    const list: any = await ApiServices.getFeaturedPropertyList()
    setProperties(list)
  }
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      getListing();
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-24" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[350px] rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-poppins font-bold text-primary">Featured Properties</h2>
        </div>
        {!properties &&
          <div className="text-center py-8">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load featured properties</h3>
            <p className="text-gray-600 mb-4">There was a problem loading the featured properties. Please try again later.</p>
          </div>
        }
        {isMobile &&
          <Carousel className="w-full">
            <CarouselContent>
              {properties && properties.map((property: any) => (
                <CarouselItem key={property.id} className="md:basis-1/5 md:p-0 m-0 p-2">
                  <PropertyListCard property={property}/>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* <div className="flex justify-center mt-4">
              <CarouselPrevious />
              <CarouselNext />
            </div> */}
          </Carousel>
        }
        {!isMobile &&
          <Carousel className="w-full px-3">
            <CarouselContent>
              {properties && properties.map((property: any) => (
                <CarouselItem key={property.id} className="basis-1/5">
                  <PropertyListCard property={property}/>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        }
      </div>
    </div>
  );


}
