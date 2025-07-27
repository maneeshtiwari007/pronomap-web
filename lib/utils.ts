import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeClassFromElement(className: any, type: string = "") {
  if (document.getElementsByClassName(className)?.length > 0) {
    console.log(document.getElementsByClassName(className)?.[0].classList);
    document.getElementsByClassName(className)?.[0].classList.remove(className);
  }
}

export function addClassInElement(className: any, e: any) {
  e?.target?.classList?.add(className);
}

export function addClassBasedOnId(
  id: string = "",
  className: string = "",
  type: string = "add"
) {
  if (document.getElementById(id)) {
    if (type === "add") {
      removeClassFromElement(className);
      document.getElementById(id)?.classList?.add(className);
    } else {
      removeClassFromElement(className);
    }
  }
}

export function objectToQueryString(params: Record<string, any>): string {
  const query = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        encodeURIComponent(key) + "=" + encodeURIComponent(String(value))
    )
    .join("&");

  return query ? `?${query}` : "";
}
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function convertFromStringToObj(queryString: string) {
  const params:any = new URLSearchParams(queryString);

  const result: Record<string, string | string[]> = {};

  for (const [key, value] of params.entries()) {
    if (result[key]) {
      // Already exists: convert to array or push to existing array
      result[key] = Array.isArray(result[key])
        ? [...(result[key] as string[]), value]
        : [result[key] as string, value];
    } else {
      result[key] = value;
    }
  }
  return result;
}
