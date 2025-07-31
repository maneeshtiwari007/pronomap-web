import { useEffect, useState } from "react";

// Returns true if the screen width is between 640px and 1024px (Tailwind's sm to lg breakpoints)
export function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isTablet;
}
