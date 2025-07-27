'use client'
import { SessionStorageInteface } from "./Interfaces/AllInterfaces";

export const SessionStorage: SessionStorageInteface = {
    get(key: any = '') {
        return (typeof window !== 'undefined')?sessionStorage.getItem(key):{};
    },
    create(key: any = '', value: any) {
        return (typeof window !== 'undefined')?sessionStorage.setItem(key, value):{};
    },
    remove(key: any) {
        return (typeof window !== 'undefined')?sessionStorage.removeItem(key):{};
    }
}