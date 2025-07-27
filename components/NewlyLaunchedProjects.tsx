'use client'
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ApiServices } from "@/lib/apiServices";
import Link from "next/link";
import { formatPrice } from "@/lib/data";
import { PropertyListCard } from "./PropertyListCard";


export default function NewlyLaunchedProjects() {
  const [projects, setProjects]: any = useState();
  const getProperty = async () => {
    const response = await ApiServices.getNewLunchedProperty();
    console.log(response)
    setProjects(response);
  }
  useEffect(() => {
    getProperty()
  }, [])
  return (
    <div className="py-10 bg-[#F6FAFF]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-poppins font-bold text-[#0A3C7D] flex items-center">
            <span className="mr-2">🆕</span> Newly Launched Projects
          </h2>
          <button className="text-primary font-medium hover:underline">View All</button>
        </div>
        <Carousel className="w-full">
          <CarouselContent>
            {projects && projects.map((property: any) => (
              <CarouselItem key={property.id} className="md:basis-1/5 p-0 m-0 pl-4">
                <PropertyListCard property={property}/>
              </CarouselItem>
            ))}
          </CarouselContent>
          {projects && projects?.length > 5 &&
            <div className="flex justify-center mt-4">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          }
        </Carousel>
      </div>
    </div>
  );
} 