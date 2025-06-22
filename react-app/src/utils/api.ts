export const getApiBase = () => {
  if (import.meta.env.DEV) {
    // Check if we're accessing from a mobile device
    const isMobile =
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1";
    return isMobile ? "http://172.20.10.3:8085" : "http://localhost:8085";
  }
  // Use your InfinityFree backend URL in production
  return "https://logicalquiz.free.nf";
};
