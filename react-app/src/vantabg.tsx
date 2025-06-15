import { useEffect, useRef } from "react";
import * as THREE from "three";

const VantaNetBackground = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    // ✅ Use dynamic import in ESM environments (Vite, Next.js, etc.)
    import("vanta/dist/vanta.net.min")
      .then((VANTA) => {
        if (mounted && !effectRef.current && vantaRef.current) {
          effectRef.current = VANTA.default({
            el: vantaRef.current,
            THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0x3fbbff,
            backgroundColor: 0x1011e,
            points: 9.0,
            maxDistance: 22.0,
            spacing: 17.0,
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load Vanta.NET", err);
      });

    return () => {
      mounted = false;
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
        position: "absolute",
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    />
  );
};

export default VantaNetBackground;
