import { useState, useEffect } from "react";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    // Initialize to mobile size
    wWidth: 750,
    wHeight: 750,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        wWidth: window.innerWidth,
        wHeight: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []); 
  return windowSize;
}