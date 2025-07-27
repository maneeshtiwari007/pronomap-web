import { Property } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { formatPrice } from "@/lib/data";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden property-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <img 
          src={property.featuredImage} 
          alt={property.title} 
          className="w-full h-56 object-cover"
        />
        {property.tags && property.tags.length > 0 && (
          <div className="absolute top-2 right-2 bg-accent text-primary px-2 py-1 rounded text-xs font-bold">
            {property.tags[0]}
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-poppins font-bold text-lg text-gray-900 mb-1">{property.title}</h3>
        <p className="text-gray-600 text-sm mb-2">
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
        <div className="flex justify-between items-center mb-3">
          <div className="text-xl font-bold text-primary">{formatPrice(property.price)}</div>
          <div className="text-sm text-gray-600">₹{property.pricePerSqFt}/sq.ft</div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 inline text-accent mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {property.bedrooms} Beds
          </span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 inline text-accent mr-1"
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
            {property.bathrooms} Baths
          </span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 inline text-accent mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
            {property.area} sq.ft
          </span>
        </div>
        <div className="flex justify-between">
          <Link href={`/property/${property.id}`}>
            <Button className="bg-primary text-white hover:bg-primary/90">
              View Details
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className={`border-accent ${isFavorite ? 'bg-accent/10 text-accent' : 'text-accent'}`}
            onClick={toggleFavorite}
          >
            {isFavorite ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
