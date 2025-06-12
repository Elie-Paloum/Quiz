// VantaNetBackground.tsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const VantaNetBackground = () => {
  const vantaRef = useRef(null);
  const effectRef = useRef<any>(null); // Use ref instead of state to avoid race conditions

  useEffect(() => {
    // Make sure this only runs in the browser
    if (typeof window !== "undefined") {
      const NET = require("vanta/dist/vanta.net.min");

      if (!effectRef.current && vantaRef.current) {
        effectRef.current = NET({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xffffff,
          backgroundColor: 0x111111,
        });
      }
    }

    return () => {
      if (effectRef.current) {
        effectRef.current.destroy();
        effectRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    />
  );
};

export default VantaNetBackground;
