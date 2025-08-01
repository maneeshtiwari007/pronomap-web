// hooks/usePollingQuery.ts
'use client'
import { useQuery, QueryFunction } from "@tanstack/react-query";
interface UsePollingQueryProps<T> {
    key: string;
    queryFn: QueryFunction<T>;
    interval?: number; // default to 20s
}

export function usePollingQuery<T>({
    key,
    queryFn,
    interval = 20000,
}: UsePollingQueryProps<T>) {
    return useQuery<T>({
        queryKey: [key],
        queryFn,
        refetchInterval: interval,
        refetchOnWindowFocus: true,
    });
}
