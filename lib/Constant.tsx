import { Headphones, Settings } from "lucide-react";

export const HEADER_CONSTANT = {
    TOP_MENUS: [
        { title: 'Business Profile', href: '/profile/business', icon: <Settings className="w-6 h-6 text-primary mr-2"></Settings> },
        { title: 'Support', href: '/', icon: <Headphones className="w-6 h-6 text-primary mr-2" /> }
    ],
    TOP_MENUS_USER: [
        { title: 'Profile', href: '/profile/user', icon: <Settings className="w-6 h-6 text-primary mr-2"></Settings> },
        { title: 'Support', href: '/', icon: <Headphones className="w-6 h-6 text-primary mr-2" /> }
    ]
}

export const USER_SESSION = {
    KEY: 'user_session'
}

export const ROUTE_PATH = {
    BUSINESS: '/business',
    SERVICES: '/services',
    CATEGORY: 'categories',
    ABOUT: '/about',
    HOME: '/',
    SUPPORT: '/support',
    BUSINESS_PROFILE: {
        DASHBOARD: '/profile/business',
        EDIT: '/profile/business/edit',
        MANAGE_SERVICES: '/profile/business/manage-services',
        MANAGE_GALLERY: '/profile/business/manage-gallery',
        CUSTOMER_ENQUIRY: '/profile/business/enquiry',
        BILLING: '/profile/business/billing',
        PAYMENT_HISTORY: '/profile/business/payment-history',
        ANALYTICS: '/profile/business/analytics',
        MEMBERSHIP_PLAN: '/profile/business/membership-plan',
    },
    USER_PROFILE: {
        DASHBOARD: '/profile/user',
        EDIT: '/profile/user/edit',
        ENQUIRY: '/profile/user/enquiries',
    },
    BLOG: {
        LISTING: '/blog',
        DETAIL: '/blog/'
    },
    AUTH: {
        BUSINESS_LOGIN: '/login/business',
        USER_LOGIN: '/login'
    }
}

export const BUSINESS_PROFILE_LINKS = [
    { title: 'Overview', path: ROUTE_PATH.BUSINESS_PROFILE.DASHBOARD },
    { title: 'Profile Information', path: ROUTE_PATH.BUSINESS_PROFILE.EDIT },
    { title: 'Manage Services', path: ROUTE_PATH.BUSINESS_PROFILE.MANAGE_SERVICES },
    { title: 'Show Cases', path: ROUTE_PATH.BUSINESS_PROFILE.MANAGE_GALLERY },
    { title: 'Customer Inquiries', path: ROUTE_PATH.BUSINESS_PROFILE.CUSTOMER_ENQUIRY },
    { title: 'Analytics', path: ROUTE_PATH.BUSINESS_PROFILE.ANALYTICS },
    { title: 'Payment History', path: ROUTE_PATH.BUSINESS_PROFILE.PAYMENT_HISTORY },
    { title: 'Membership Plan', path: ROUTE_PATH.BUSINESS_PROFILE.MEMBERSHIP_PLAN },
    { title: 'Billing Details', path: ROUTE_PATH.BUSINESS_PROFILE.BILLING },
    { title: 'Support Ticket', path: ROUTE_PATH.SUPPORT }
]

export const USER_PROFILE_LINKS = [
    { title: 'Overview', path: ROUTE_PATH.USER_PROFILE.DASHBOARD },
    { title: 'Profile Information', path: ROUTE_PATH.USER_PROFILE.EDIT },
    { title: 'Customer Inquiries', path: ROUTE_PATH.USER_PROFILE.ENQUIRY },
]

export const PAGE_NAME_WITH_PATH = [
    { title: 'Business Dashboard', path: '/profile/business' },
    { title: 'Business Profile Information', path: '/profile/business/edit' },
    { title: 'Business Manage Services', path: '/profile/business/manage-services' },
    { title: 'Business Customer Inquiries', path: '/profile/business/enquiry' },
    { title: 'Home Page', path: '/' },
    { title: 'About Us', path: '/about' },
    { title: 'All Categories', path: '/categories' },
    { title: 'All Business Listing', path: '/categories' },
    { title: 'Business Detail', path: '/business/*' },
    { title: 'Login', path: '/login' },
    { title: 'Business Login', path: '/login/business' },
    { title: 'Business Registration', path: '/register/business' },
    { title: 'Setup Business Step-1', path: '/profile/business/business-details' },
    { title: 'Setup Business Step-2', path: '/profile/business/services' },
    { title: 'Setup Business Step-3', path: '/profile/business/gallery' },
];

export const REVIEW_CONST_ARRAY = [1, 2, 3, 4, 5];



export const FILTER_CONSTANT = {
    SHOW_MORE_CONSTANT: 4
}

export const CONST_API_KEY = {
    GOOGLE_MAPS_KEY: 'AIzaSyCV69lU2YUuXEiFb7f2LJvYgBZ8yX8qjYs'
}

export const LOCAL_SESSION_STORAGE = {
    KEY: 'id',
    VALUE_LENGTH: 10
}

export const ERROR_MESSAGES = {
    OTP_INVALID_MESSAGE: 'Please enter valid OTP'
}

export const SECRET_KEY_CONSTANT = {
    SECRET_KEY_STORAGE: 'ABCDERFDhsdfgsudg78687568756SGGSGGGDF768686344dtSSD'
}

export const COMMON_VARIABLES = {
    ACCEPT_IMAGE: "image/png, image/jpg, image/jpeg, image/webp, image/bmp"
}

export const COMMON_META_DATA = {
    COMMON: {
        CREATOR: 'Codeyiizen',
        AUTHORS: [{ name: "Codeyiizen Team", url: "https://codeyiizen.com" }]
    },
    BLOG: {
        title: "Expert Business & Service Insights | TrustaMaster Blog",
        description:
            "Explore expert tips, industry insights, and trusted advice from professionals. Stay informed with the latest trends across business, marketing, tech, and more on the TrustaMaster blog.",
        keywords: [
            "TrustaMaster blog",
            "business insights",
            "marketing tips",
            "service trends",
            "expert advice",
            "trusted professionals",
            "business blog",
            "B2B services",
            "entrepreneur guides"
        ],
        openGraph: {
            title: "TrustaMaster Blog | Trusted Insights from Professionals",
            description:
                "Stay ahead with industry tips, marketing strategies, and business ideas shared by top professionals.",
            url: "/blog",
            siteName: "TrustaMaster",
            images: [
                {
                    url: "/assets/images/blog-preview.png",
                    width: 1200,
                    height: 630,
                    alt: "TrustaMaster Blog - Trusted Tips and Insights",
                },
            ],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "TrustaMaster Blog | Trusted Business Insights",
            description:
                "Discover useful articles, expert opinions, and actionable advice from industry leaders.",
            images: ["/assets/images/blog-preview.png"],
            creator: "@trustamaster", // Optional if you have a Twitter handle
        },
    }
}
export const HIDE_SEARCHBAR_PREFIXES = [
  '/login',
  '/register',
  '/admin',
  '/dashboard',
  '/property/', // <-- Dynamic route match
];
