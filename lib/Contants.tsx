import { ENV } from "@/config/env";

export const REUSABLE_CLASS_NAMES = {
    ACTIVE_PROPERTY: 'active-property'
}
export const REUSABLE_CONSTANT = {
    GOOGLE_MAPS_API_KEY:ENV.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
}
export const icons: { [key: string]: string } = {
    school: "🏫",
    hospital: "🏥",
    restaurant: "🍽️",
    shopping_mall: "🛍️",
    park: "🌳",
    gym: "💪",
    pharmacy: "💊",
    bank: "🏦",
    atm: "🏧",
    bus_station: "🚌",
    train_station: "🚉",
    airport: "✈️",
    college: "🎓",
    university: "🎓",
    subway_station: "🚇",
    library: "📚",
    police: "👮",
    fire_station: "🚒",
    post_office: "🏤",
    hotel: "🏨",
    community_centre: "🏢",
    sports_complex: "🏟️",
    movie_theater: "🎬",
    place_of_worship: "🕌",
    government_office: "🏛️",
    apartment: "🏢",
    commercial_complex: "🏬",
    industrial: "🏭",
    parking: "🅿️",
    cafe: "☕",
};


export const JSON_CONSTANT:any = {
    school: {
        suggestedLocations: [
            {
                distance: 735,
                eLoc: 'YZEXDC',
                keywords: [Array],
                orderIndex: 1,
                placeAddress: 'Nawabganj, Barabanki District, Uttar Pradesh, 225003',
                placeName: 'Adi Shankar Vaidik Vidya Sansthan',
                type: 'POI'
            },
            {
                distance: 1748,
                eLoc: 'L9DXFN',
                keywords: [Array],
                orderIndex: 2,
                placeAddress: 'Nawabganj, Barabanki District, Uttar Pradesh, 225301',
                placeName: 'Gadhi School',
                type: 'POI'
            },
            {
                distance: 1748,
                eLoc: 'BDOSFW',
                keywords: [Array],
                orderIndex: 3,
                placeAddress: 'Nawabganj, Barabanki District, Uttar Pradesh, 225301',
                placeName: 'Primary School Rendua Palhari',
                type: 'POI'
            },
            {
                distance: 1766,
                eLoc: '8XJLA0',
                keywords: [Array],
                orderIndex: 4,
                placeAddress: 'Deva Road, Ram Vihar Colony, Nawabganj, Barabanki District, Uttar Pradesh, 225301',
                placeName: 'Kids The School',
                type: 'POI'
            },
            {
                distance: 1795,
                eLoc: 'YZBKET',
                keywords: [Array],
                orderIndex: 5,
                placeAddress: 'Sadar, Lucknow District, Uttar Pradesh, 226028',
                placeName: 'Aarsh Vidya Gurukulam',
                type: 'POI'
            },
            {
                distance: 1839,
                eLoc: 'YKMDR5',
                keywords: [Array],
                orderIndex: 6,
                placeAddress: 'Anora Kala, Chinhat, Ayodhya Road, Sadar, Lucknow District, Uttar Pradesh, 226028',
                placeName: 'Sanfort Preschool, Anaura Kalan Chinhat',
                type: 'POI'
            },
            {
                distance: 1875,
                eLoc: 'Z794UX',
                keywords: [Array],
                orderIndex: 7,
                placeAddress: 'Nawabganj, Barabanki District, Uttar Pradesh, 225301',
                placeName: 'St Mathew School',
                type: 'POI'
            },
            {
                distance: 1885,
                eLoc: 'R280AP',
                keywords: [Array],
                orderIndex: 8,
                placeAddress: 'Anaura Kalan, Faizabad Road, Sadar, Lucknow District, Uttar Pradesh, 226028',
                placeName: 'RBN Global School',
                type: 'POI'
            },
            {
                distance: 1960,
                eLoc: 'XLHFMB',
                keywords: [Array],
                orderIndex: 9,
                placeAddress: 'Faizabad Road, Sadar, Lucknow District, Uttar Pradesh, 226028',
                placeName: 'Birla Open Minds International School, Faizabad Road',
                type: 'POI'
            },
            {
                distance: 2063,
                eLoc: 'Z0UJ7V',
                keywords: [Array],
                orderIndex: 10,
                placeAddress: 'H 503 Spring Greens Apartment, Faizabad Road, Sadar, Lucknow District, Uttar Pradesh, 226028',
                placeName: 'DPS Champs Pvt Ltd',
                type: 'POI'
            }
        ],
        pageInfo: { pageCount: 1, totalHits: 804, totalPages: 81, pageSize: 10 }
    },
    hospital: {
        suggestedLocations: [
            {
                distance: 1580,
                eLoc: "WQBG74",
                keywords: [Array],
                orderIndex: 1,
                placeAddress: "Nawabganj, Barabanki District, Uttar Pradesh, 225301",
                placeName: "Vijay Laxmi Eye Hospital",
                type: "POI",
            },
            {
                distance: 1641,
                eLoc: "IW77MW",
                keywords: [Array],
                orderIndex: 2,
                placeAddress:
                    "Rendua Palhari, Banki, District Barabanki, Nawabganj, Barabanki District, Uttar Pradesh, 225301",
                placeName: "Primary Health Centre",
                type: "POI",
            },
            {
                distance: 1795,
                eLoc: "Z8GV98",
                keywords: [Array],
                orderIndex: 3,
                placeAddress:
                    "Makan No-3 Anora Kala, Near Techno College, Sadar, Lucknow District, Uttar Pradesh, 226028",
                placeName: "Swami Dayanand Hospital",
                type: "POI",
            },
            {
                distance: 1896,
                eLoc: "DT218B",
                keywords: [Array],
                orderIndex: 4,
                placeAddress: "Nawabganj, Barabanki District, Uttar Pradesh, 225301",
                placeName: "Charm Hospital",
                type: "POI",
            },
            {
                distance: 2066,
                eLoc: "F3EY3U",
                keywords: [Array],
                orderIndex: 5,
                placeAddress:
                    "Jainabad Goila, Deva Road, Bakshi Ka Talab, Lucknow District, Uttar Pradesh, 226028",
                placeName: "Dewa Hospital",
                type: "POI",
            },
            {
                distance: 2160,
                eLoc: "XJV9MR",
                keywords: [Array],
                orderIndex: 6,
                placeAddress: "Sadar, Lucknow District, Uttar Pradesh, 226028",
                placeName: "Lekhraj Diabetes Hospital",
                type: "POI",
            },
            {
                distance: 2177,
                eLoc: "Z1MMGX",
                keywords: [Array],
                orderIndex: 7,
                placeAddress:
                    "697, Anaura Kala, Chinhat, Sadar, Lucknow District, Uttar Pradesh, 226028",
                placeName: "Goel Superspeciality Hospital",
                type: "POI",
            },
            {
                distance: 2215,
                eLoc: "IWDEJQ",
                keywords: [Array],
                orderIndex: 8,
                placeAddress:
                    "Anaurakaka, Chinhat, District Lucknow, Sadar, Lucknow District, Uttar Pradesh, 226028",
                placeName: "LD Hospital",
                type: "POI",
            },
            {
                distance: 2291,
                eLoc: "XJV500",
                keywords: [Array],
                orderIndex: 9,
                placeAddress: "Sadar, Lucknow District, Uttar Pradesh, 226028",
                placeName: "Goel AMB & Hospital",
                type: "POI",
            },
            {
                distance: 2295,
                eLoc: "9CRX62",
                keywords: [Array],
                orderIndex: 10,
                placeAddress:
                    "NH 230, Sadar, Lucknow District, Uttar Pradesh, 226028",
                placeName: "Goel Ayurvedic Medical College and Hospital",
                type: "POI",
            },
        ],
        //pageInfo: { pageCount: 1, totalHits: 270, totalPages: 27, pageSize: 10 },
    }
}
