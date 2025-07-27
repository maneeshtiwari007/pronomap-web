// app/context/navigation-context.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const NavigationContext = createContext<{
    lastPath: string | null;
    setLastPath: (path: string) => void;
}>({
    lastPath: null,
    setLastPath: () => { },
});

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [lastPath, setLastPath] = useState<string | null>(null);

    useEffect(() => {
        // Only store the previous URL if it's not the detail page
        const isDetailPage = pathname?.startsWith('/property/');
        if (!isDetailPage) {
            const fullUrl = `${pathname}${searchParams?.toString() ? '?' + searchParams.toString() : ''}`;
            setLastPath(fullUrl);
        }
    }, [pathname, searchParams]);

    return (
        <NavigationContext.Provider value={{ lastPath, setLastPath }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => useContext(NavigationContext);
