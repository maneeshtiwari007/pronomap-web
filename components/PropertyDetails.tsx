'use client'
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import BackButton from "./BackButton";

export default function PropertyDetailsComponent({data}:any) {
  // Get property ID from URL
  const propertyId = (data?.slug)?data?.slug : null;
  const [isError,setIsError] = useState();
  const [isLoading,setIsLoading] = useState(false);
  // Fetch property details
  const property = data;

  if (isLoading) {
    return <PropertyDetailsLoading />;
  }

  if (isError || !property) {
    return <PropertyDetailsError />;
  }

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else {
      return `₹${(price / 100000).toFixed(0)} Lakh`;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Property title and basic info */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
              <div>
                <div className="px-2 py-3">
                <BackButton />
                {/* Your detail layout below */}
              </div>
                <h1 className="text-3xl font-bold font-poppins text-primary">{property.title}</h1>
                <div className="flex items-center mt-2 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{property.address}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-3xl font-bold text-primary">{formatPrice(property.price)}</span>
                <span className="text-gray-600">₹{property.pricePerSqFt.toLocaleString()}/sq.ft</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {property.tags?.map((tag:any, index:number) => (
                <Badge key={index} variant="outline" className="bg-accent text-primary font-semibold">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Property image gallery */}
          <div className="mb-8">
            <Carousel className="w-full">
              <CarouselContent>
                {property.images.map((image:any, index:number) => (
                  <CarouselItem key={index}>
                    <AspectRatio ratio={16/9} className="bg-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={image} 
                        alt={`${property.title} - Image ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          
          {/* Property details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <Tabs defaultValue="overview">
                    <TabsList className="mb-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="amenities">Amenities</TabsTrigger>
                      <TabsTrigger value="nearby">Nearby Places</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-gray-100 rounded-lg text-center">
                          <div className="text-gray-600 text-sm mb-1">Property Type</div>
                          <div className="font-medium">{property.propertyType}</div>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-lg text-center">
                          <div className="text-gray-600 text-sm mb-1">Area</div>
                          <div className="font-medium">{property.area} sq.ft</div>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-lg text-center">
                          <div className="text-gray-600 text-sm mb-1">Bedrooms</div>
                          <div className="font-medium">{property.bedrooms}</div>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-lg text-center">
                          <div className="text-gray-600 text-sm mb-1">Bathrooms</div>
                          <div className="font-medium">{property.bathrooms}</div>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-lg text-center">
                          <div className="text-gray-600 text-sm mb-1">Floor</div>
                          <div className="font-medium">{property.floors} of 12</div>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-lg text-center">
                          <div className="text-gray-600 text-sm mb-1">Possession</div>
                          <div className="font-medium">{property.possessionDate}</div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-3">Description</h3>
                        <p className="text-gray-700">{property.description}</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1H6z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">Builder: {property.builder}</span>
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">Possession: {property.possessionDate}</span>
                        </div>
                        {property.isVerified && (
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">RERA Registered</span>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="amenities">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {property.amenities?.map((amenity:any, index:number) => (
                          <div key={index} className="flex items-center p-3 bg-gray-100 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="nearby">
                      <div className="space-y-6">
                        {property.nearbyPlaces && (
                          <>
                            {property.nearbyPlaces.schools && (
                              <div>
                                <h3 className="text-lg font-medium mb-3">Schools & Colleges</h3>
                                <div className="space-y-2">
                                  {property.nearbyPlaces.schools.map((school:any, index:number) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                                      <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                        </svg>
                                        <span>{school.name}</span>
                                      </div>
                                      <Badge variant="outline">{school.distance} km</Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {property.nearbyPlaces.hospitals && (
                              <div>
                                <h3 className="text-lg font-medium mb-3">Hospitals & Clinics</h3>
                                <div className="space-y-2">
                                  {property.nearbyPlaces.hospitals.map((hospital:any, index:number) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                                      <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                                        </svg>
                                        <span>{hospital.name}</span>
                                      </div>
                                      <Badge variant="outline">{hospital.distance} km</Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {property.nearbyPlaces.malls && (
                              <div>
                                <h3 className="text-lg font-medium mb-3">Shopping Malls</h3>
                                <div className="space-y-2">
                                  {property.nearbyPlaces.malls.map((mall:any, index:number) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                                      <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                        </svg>
                                        <span>{mall.name}</span>
                                      </div>
                                      <Badge variant="outline">{mall.distance} km</Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Contact Agent</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="name" className="text-sm font-medium">Name</label>
                      <input
                        id="name"
                        placeholder="Your name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <input
                        id="email"
                        placeholder="Your email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                      <input
                        id="phone"
                        placeholder="Your phone number"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="message" className="text-sm font-medium">Message</label>
                      <textarea
                        id="message"
                        placeholder="I'm interested in this property..."
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <Button className="w-full bg-accent hover:bg-yellow-600 text-primary">
                      Send Message
                    </Button>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="text-center space-y-2">
                    <Button variant="outline" className="w-full border-primary text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      Save to Favorites
                    </Button>
                    <Button variant="outline" className="w-full border-primary text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                      Share Property
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}

function PropertyDetailsLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Skeleton className="h-8 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          
          <Skeleton className="w-full h-[400px] rounded-lg mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-32" />
                    <div className="grid grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-lg" />
                      ))}
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}

function PropertyDetailsError() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
              <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => window.location.href = "/"}>
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
    </div>
  );
}
