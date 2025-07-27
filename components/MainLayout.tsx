'use client'
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./ui/tooltip";
import { Toaster } from "./ui/toaster";
import Header from "./Header";
import SearchBar from "./SearchBar";
import Footer from "./Footer";
import { queryClient } from "@/lib/queryClient";
import { usePathname } from "next/navigation";
import { HIDE_SEARCHBAR_PREFIXES } from "@/lib/Constant";
import { NavigationProvider } from "@/context/navigation-context";


export default function MainLayout({ children }: any) {
    const pathname = usePathname();
    const hideSearchBar = HIDE_SEARCHBAR_PREFIXES.some(prefix =>
        pathname.startsWith(prefix)
    );
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <div className="flex flex-col min-h-screen">
                    <Header />
                    {!hideSearchBar && <SearchBar />}
                    <NavigationProvider>
                        {children}
                    </NavigationProvider>
                    <Footer />
                </div>
            </TooltipProvider>
        </QueryClientProvider>
    );
}