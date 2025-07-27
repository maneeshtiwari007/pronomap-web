import './styles/main.scss';
import type { Metadata } from 'next';
import { Instrument_Sans } from 'next/font/google';
import { Suspense } from 'react';
import ChatboatImg from '@/assets/images/chatboat-img.png';
import Image from "next/image";
import { getSession } from '@/lib/session';
import { SessionProviders } from '@/lib/Providers/SessionProviders';
import StoreProvider from '@/lib/Providers/StoreProvider';
import { GoogleMapsProvider } from '@/lib/Providers/GoogleMapsProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import MainLayout from '@/components/MainLayout';
const instrumentSans = Instrument_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Lucknow Property Navigator',
    template: '%s | Buy, Sell & Rent Properties in Lucknow',
  },

  description: 'Discover your dream home with Lucknow Property Navigator – your trusted platform to buy, sell, and rent residential and commercial properties in Lucknow. Explore verified listings, property trends, and expert insights today.',
  keywords: ["Lucknow property", "property in Lucknow", "buy house Lucknow", "rent flat Lucknow", "real estate Lucknow", "commercial property Lucknow", "Lucknow property listings",
    "land for sale Lucknow",
    "property dealers Lucknow",
    "house for sale Lucknow"],
  authors: [{ name: 'Trustamaster' }],
  creator: 'Codeyiizen software services',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Lucknow Property Navigator | Buy, Sell & Rent Properties in Lucknow',
    description: 'Explore verified properties for sale and rent in Lucknow. Residential, commercial, and land listings with expert guidance and market trends.',
    siteName: 'Lucknow Property Navigator',
    images: ['/assets/images/logo.svg']
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Lucknow Property Navigator | Buy, Sell & Rent Properties in Lucknow',
    description: 'Explore verified properties for sale and rent in Lucknow. Residential, commercial, and land listings with expert guidance and market trends.',
    creator: '@yourusername',
    images: ['/assets/images/logo.svg']
  },

  robots: {
    index: true,
    follow: true,
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  async function getUserSession() {
    return await getSession()
  }
  let sessionUser = await getUserSession();

  return (
    <html>
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}