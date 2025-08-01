'use client'
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIsTablet } from "@/hooks/use-tablet";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import logo from '@/assets/Logo.png';
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ChevronDown } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function Header() {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [rentOpen, setRentOpen] = useState(false);

  const isTablet = useIsTablet();
  console.log('isTablet')
  console.log(isTablet)
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
        {(!isMobile && !isTablet) && (
          <nav className="flex items-center space-x-3">
            <ul className="flex items-center space-x-3 text-white font-medium">
              <li><Link className="px-5 py-2 text-yellow" href="/admin">Admin Panel</Link></li>
              {/* Buy Popup */}
              <li className="relative">
                <Link href="/" className="rounded-lg px-5 py-2 font-medium" onClick={() => setBuyOpen(v => !v)} onBlur={() => setTimeout(() => setBuyOpen(false), 200)}>
                  Buy<ChevronDown className="inline ml-1 h-4 w-4" />
                </Link>
                {buyOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 flex flex-col divide-y divide-gray-50">
                    {propertyCategories.map(cat => (
                      <div key={cat} className="px-4 py-3 cursor-pointer text-[#0A3C7D] font-medium transition-colors hover:bg-primary hover:text-white">{cat}</div>
                    ))}
                  </div>
                )}
              </li>
              {/* Sell Popup */}
              <li className="relative">
                <Link href="/" className="rounded-lg px-5 py-2 font-medium" onClick={() => setSellOpen(v => !v)} onBlur={() => setTimeout(() => setSellOpen(false), 200)}>
                  Sell<ChevronDown className="inline ml-1 h-4 w-4" />
                </Link>
                {sellOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 flex flex-col divide-y divide-gray-50">
                    {propertyCategories.map(cat => (
                      <div key={cat} className="px-4 py-3 cursor-pointer text-[#0A3C7D] font-medium transition-colors hover:bg-primary hover:text-white">{cat}</div>
                    ))}
                  </div>
                )}
              </li>
              {/* Rent Popup */}
              <li className="relative">
                <Link href="/" className="rounded-lg px-5 py-2 font-medium" onClick={() => setRentOpen(v => !v)} onBlur={() => setTimeout(() => setRentOpen(false), 200)}>
                  Rent<ChevronDown className="inline ml-1 h-4 w-4" />
                </Link>
                {rentOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 flex flex-col divide-y divide-gray-50">
                    {propertyCategories.map(cat => (
                      <div key={cat} className="px-4 py-3 cursor-pointer text-[#0A3C7D] font-medium transition-colors hover:bg-primary hover:text-white">{cat}</div>
                    ))}
                  </div>
                )}
              </li>
              <li><Link href="/post-property">Post Property </Link></li>
              <li><Link href="/blog">Articles and News</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
            <Button variant="outline" className="px-2 py-2 w-[100px] hover:border-primary hover:text-white" asChild><Link href="/login">Log In</Link></Button>
          </nav>
        )}
        {/* Mobile Menu Button */}
        {(isMobile || isTablet)  && (
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu" className="text-white">
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
              <SheetTitle asChild>
                    <VisuallyHidden>Property Filter</VisuallyHidden>
                </SheetTitle>
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
