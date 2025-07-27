'use client'
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from '@/assets/Logo.png';
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [rentOpen, setRentOpen] = useState(false);

  // Categories for Buy/Sell/Rent
  const propertyCategories = [
    'Flat/Apartment',
    'Residential Land',
    'Service Apartment',
    'Independent/Builder Floor',
    'Studio Apartment',
    'Farm House',
    'Independent House/Villa',
    'Commercial Plot',
    'Commercial Shops',
    'Offices',
    'Hotels/Resort',
    'Warehouse',
  ];

  return (
    <header style={{
      background: '#0A3C7D',
      boxShadow: '0 4px 24px rgba(10,60,125,0.13)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '1.5px solid rgba(255,255,255,0.13)'
    }}>
      <div className="container mx-auto px-4 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center mr-8">
          <Image src={logo} alt="PropronMap Logo" style={{ height: 48, width: 48, objectFit: 'contain' }} />
          <span className="ml-3 font-poppins font-bold text-2xl tracking-tight text-white">Propron<span className="text-[#BFD8F7]">MAP</span></span>
        </Link>
        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex items-center space-x-3">
            <Link href="/admin">
              <Button variant="header" className="rounded-full px-5 py-2 font-medium">Admin Panel</Button>
            </Link>
            {/* Buy Popup */}
            <div className="relative">
              <Button variant="header" className="rounded-full px-5 py-2 font-medium" onClick={() => setBuyOpen(v => !v)} onBlur={() => setTimeout(() => setBuyOpen(false), 200)}>
                Buy
              </Button>
              {buyOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 flex flex-col divide-y divide-gray-200">
                  {propertyCategories.map(cat => (
                    <div key={cat} className="px-4 py-3 hover:bg-[#F0F6FF] cursor-pointer text-[#0A3C7D] font-medium transition-colors">{cat}</div>
                  ))}
                </div>
              )}
            </div>
            {/* Sell Popup */}
            <div className="relative">
              <Button variant="header" className="rounded-full px-5 py-2 font-medium" onClick={() => setSellOpen(v => !v)} onBlur={() => setTimeout(() => setSellOpen(false), 200)}>
                Sell
              </Button>
              {sellOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 flex flex-col divide-y divide-gray-200">
                  {propertyCategories.map(cat => (
                    <div key={cat} className="px-4 py-3 hover:bg-[#F0F6FF] cursor-pointer text-[#0A3C7D] font-medium transition-colors">{cat}</div>
                  ))}
                </div>
              )}
            </div>
            {/* Rent Popup */}
            <div className="relative">
              <Button variant="header" className="rounded-full px-5 py-2 font-medium" onClick={() => setRentOpen(v => !v)} onBlur={() => setTimeout(() => setRentOpen(false), 200)}>
                Rent
              </Button>
              {rentOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 flex flex-col divide-y divide-gray-200">
                  {propertyCategories.map(cat => (
                    <div key={cat} className="px-4 py-3 hover:bg-[#F0F6FF] cursor-pointer text-[#0A3C7D] font-medium transition-colors">{cat}</div>
                  ))}
                </div>
              )}
            </div>
            <Link href="/post-property">
              <Button variant="header" className="rounded-full px-5 py-2 font-medium">Post Property</Button>
            </Link>
            <Link href="/contact">
              <Button variant="header" className="rounded-full px-5 py-2 font-medium">Contact Us</Button>
            </Link>
            <Link href="/login">
              <Button variant="header" className="rounded-full px-5 py-2 font-medium">Login / Register</Button>
            </Link>
            <Link href="/blog">
              <Button variant="header" className="rounded-full px-5 py-2 font-medium">Articles and News</Button>
            </Link>
          </nav>
        )}
        {/* Mobile Menu Button */}
        {isMobile && (
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
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
                  className="h-6 w-6"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/admin" className="font-medium text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
                <Link href="/post-property" className="font-medium text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Post Property</Link>
                <Link href="/contact" className="font-medium text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
                <Link href="/login" className="font-medium text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Login / Register</Link>
                <Link href="/blog" className="font-medium text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Articles and News</Link>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
}
