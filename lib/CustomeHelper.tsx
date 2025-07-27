import { Check, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { PAGE_NAME_WITH_PATH, SECRET_KEY_CONSTANT, USER_SESSION } from "./Constant";
import CryptoJS from "crypto-js";
export const CustomHelper: any = {
    queryToObject(objData: any = {}) {
        var str = [];
        for (var p in objData)
            if (objData.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(objData[p]));
            }
        return str.join("&");
    }
}
export async function convertArrayObjToString(array: any) {
    if (array?.length > 0) {
        let returnData = '';
        array?.map((item: any) => {
            returnData += item + ', ';
        })
        return returnData?.trim();
    } else {
        return "";
    }
}
export async function metaTagParser(value: string = '', type: string = '') {
    if (type === 'title') {
        return value + " | " + process?.env?.SITE_MAIN_TITLE;
    } else if (type === 'description') {
        return value?.replace(/<[^>]*>/g, '')?.replaceAll('&nbsp;', ' ');
    }
}
export async function showToastMessage(message: string, type: string = 'success') {
    if (type === 'success') {
        toast.success("Success",
            {
                description: message,
                duration: 3000,
                icon: <Check />
            }
        );
    } else {
        toast.error("Error",
            {
                description: message,
                duration: 3000,
                icon: <ShieldAlert />
            }
        );
    }
}
export function convertObjectToQueryString(objectData: any, deletePage: boolean = false) {
    if (deletePage) {
        delete objectData?.page
    }
    let query = new URLSearchParams(objectData);
    let queryString = query.toString();
    return (queryString) ? "?" + queryString : undefined;
}
export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export async function isJson(str: any) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
export function getIntegerFromString(stringData: string) {
    // Input string
    let str = stringData;
    // Using match with regEx
    let matches = (str) ? str.match(/(\d+)/) : '';
    // Display output if number extracted
    return matches?.[0];
}
export function getClientCookieData(cname: any) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Encryption and Decryption start

export const encryptData = (data: unknown): string => {
    const strData:any = data;
    return CryptoJS.AES.encrypt(strData, SECRET_KEY_CONSTANT.SECRET_KEY_STORAGE).toString();
};

export const decryptData = (ciphertext: string) => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY_CONSTANT.SECRET_KEY_STORAGE);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData);
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
};

// Encryption and Decryption end

export function createUserStorage(key: any, value: any) {
    const encrypted = encryptData(value);
    localStorage.setItem(key, encrypted);
}
export function deleteUserStorage(key: any) {
    localStorage.removeItem(key);
}
export function getUserStorage() {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem(USER_SESSION.KEY);
        if (data) {
            return decryptData(data);
        }
    }
}
const getPageDetails = (pathname: any) => {
    const pageList = PAGE_NAME_WITH_PATH;
    return (pageList?.find(item => item?.path === pathname));
}
export function activityPayloadFormatter(data: any = {}) {

    const constPageDetail: any = getPageDetails(data?.path);
    const payload: any = {
        activity_user_type: data?.userType,
        activity_type: data?.activityType,
        device_type: data?.deviceType,
        activity_user_id: data?.userId,
        from: 'website',
        current_page: {
            name: constPageDetail?.title,
            path_url: document.URL
        },
        last_activity: new Date().toISOString(),
        extra_data: {
            location: data?.location,
            userAgent: data?.userAgent
        }
    }
    if (data?.time) {
        payload.time = data?.time
    }
    if (data?.activityId) {
        payload.activityId = data?.activityId
    }
    return payload
}
export function getUserAgent(data: any = {}) {
    return navigator.userAgent;
}
export function getDeviceType(data: any = {}) {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const deviceType = isMobile ? 'Mobile' : 'Desktop';
    return deviceType;
}
export function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    resolve({ latitude, longitude });
                },
                (error) => {
                    reject(error);
                }
            );
        }
    });
}
export function getDifferenceBetweenDates(startDate: any, endDate: any) {
    return (startDate && endDate) ? (endDate.getTime() - startDate.getTime()) / 1000 : undefined;
}
export function filterDataByNumber(arr: any, number: number) {
    return arr?.filter((element: any, index: number) => index < number)
}
export function makeId(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

