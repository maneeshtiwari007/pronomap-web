import { formatPrice } from "@/lib/data";
import { Badge } from "../ui/badge";

export default function  PerpetyHoverCard({propsHover}:any){
    return (
        <div
          style={{
            background: '#fff',
            pointerEvents: 'auto',
            zIndex: 1000,
          }}
          className='property-hover'>
          <div
            key={propsHover.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            
          >
            <div className="relative">
              <div className="h-32 bg-gray-200">
                {propsHover.featuredImage ? (
                  <img
                    src={propsHover.featuredImage}
                    alt={propsHover.title}
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
                {propsHover.isFeatured && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Featured
                  </div>
                )}
                <Badge
                  className="absolute top-2 right-2 bg-primary text-white"
                  variant="default"
                >
                  {propsHover.propertyType}
                </Badge>
              </div>
            </div>

            <div className="p-3">
              <h3 className="font-semibold text-primary truncate">{propsHover.title}</h3>
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
                {propsHover.location}
              </p>

              <div className="mt-2 flex justify-between items-center border-t pt-2">
                <span className="font-bold text-primary">{formatPrice(propsHover.price)}</span>
                <div className="text-xs text-gray-600">
                  <span>{propsHover.area} sq.ft</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
}