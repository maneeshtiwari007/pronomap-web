'use client'
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const projects = [
  {
    id: 1,
    name: "Lavish Floors By Surya ...",
    location: "Sector 8 Dwarka, Delhi",
    price: "₹ 85 L - 3.25 Cr",
    details: "2, 3, 4 BHK Independent Floors",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    badge: "NEW ARRIVAL",
    growth: "+7.2% price increase in last 1 year in locality"
  },
  {
    id: 2,
    name: "Sky High Luxury Homes",
    location: "Sector 8 Dwarka, Delhi",
    price: "₹ 85 L - 4 Cr",
    details: "2, 3, 4 BHK Independent Floors",
    image: "https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=400&q=80",
    badge: "NEW ARRIVAL",
    growth: "+7.2% price increase in last 1 year in locality"
  },
  // Add more placeholder projects as needed
];

export default function NewlyLaunchedProjects() {
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
            {projects.map((project) => (
              <CarouselItem key={project.id} className="basis-1/5 p-0 m-0">
                <div
                  className="w-full bg-white rounded-lg shadow-md flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute top-3 left-3 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-full text-white shadow">
                    {project.badge}
                  </div>
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <h3 className="font-semibold text-base text-[#0A3C7D] mb-1 truncate">{project.name}</h3>
                    <div className="text-xs text-gray-600 mb-1 truncate">{project.location}</div>
                    <div className="text-primary font-bold text-sm mb-1">{project.price}</div>
                    <div className="text-xs text-gray-500 mb-2">{project.details}</div>
                    <div className="text-xs text-green-600 font-medium mb-2">{project.growth}</div>
                    <div className="flex-1" />
                    <button className="bg-primary text-white rounded-lg px-3 py-1 font-semibold hover:bg-[#2563eb] transition-colors mt-2 text-xs">View Number</button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </div>
  );
} 