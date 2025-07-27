import SearchPageComponent from "@/components/SearchPageComponent";
import { Metadata } from "next";
export async function generateMetadata({ searchParams }: any): Promise<Metadata> {
    const {
        location = '',
        propertyType = '',
        minPrice = '',
        maxPrice = '',
    } = await searchParams;

    const formattedLocation = location || 'Lucknow';
    const formattedType = propertyType || 'properties';
    const title = `Search ${formattedType} in ${formattedLocation} | Lucknow Property Navigator`;
    const description = `Find ${formattedType} in ${formattedLocation} with Lucknow Property Navigator. Browse listings from ₹${minPrice || '0'} to ₹${maxPrice || 'Any'}.`;

    return {
        title,
        description,
        keywords: [formattedLocation, propertyType, "real estate", "property", "Lucknow", "buy", "rent"].filter(Boolean),
        openGraph: {
            title,
            description,
            url: `https://www.lucknowpropertynavigator.com/search?location=${location}&propertyType=${propertyType}`,
            type: "website",
            siteName: "Lucknow Property Navigator",
            images: [
                {
                    url: "/og-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: "Lucknow Property Navigator",
                },
            ],
        },
    };
}
export default async function SearchPage({ searchParams }: any) {
    const paramsData = await searchParams;
    return (
        <>
            <SearchPageComponent params={paramsData}/>
        </>
    )
}