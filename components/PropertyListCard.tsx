'use client'

import { formatPrice } from "@/lib/data"
import Link from "next/link"

export function PropertyListCard({ property }: any) {
    return (
        <div className="basis-1/5 p-0 m-0">
            <div
                className="w-full bg-white rounded-lg shadow-md flex flex-col justify-between relative overflow-hidden"
            >
                <div className="relative">
                    <img
                        src={property.featuredImage}
                        alt={property.title}
                        className="w-full h-32 object-cover rounded-t-lg"
                    />
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                    <h3 className="font-semibold text-base text-[#0A3C7D] mb-1 truncate">{property.title}</h3>
                    <div className="text-xs text-gray-600 mb-1 truncate">{property.location}</div>
                    <div className="text-primary font-bold text-sm mb-1">{property.price ? formatPrice(property.price) : ''}</div>
                    <div className="flex-1" />
                    <Link href={'/property/' + property?.slug} className="text-center bg-primary text-white rounded-lg p-3 font-semibold hover:bg-[#2563eb] transition-colors mt-2 text-xs">View Details</Link>
                </div>
            </div>
        </div>
    )
}