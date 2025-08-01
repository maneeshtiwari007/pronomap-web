'use client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./ui/tooltip";
import { Toaster } from "./ui/toaster";
import Header from "./Header";
import SearchBar from "./SearchBar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";
import { HIDE_SEARCHBAR_PREFIXES } from "@/lib/Constant";
import { NavigationProvider } from "@/context/navigation-context";
import { Provider } from "react-redux";
import { store } from '@/lib/store/store';

export default function MainLayout({ children }: any) {
    const pathname = usePathname();
    const hideSearchBar = HIDE_SEARCHBAR_PREFIXES.some(prefix =>
        pathname.startsWith(prefix)
    );
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store()}>
                <TooltipProvider>
                    <Toaster />
                    <div className="flex flex-col min-h-screen overflow-x-hidden">
                        <Header />
                        {!hideSearchBar && <SearchBar />}
                        <NavigationProvider>
                            {children}
                        </NavigationProvider>
                        <Footer />
                    </div>
                </TooltipProvider>
            </Provider>
        </QueryClientProvider>
    );
}