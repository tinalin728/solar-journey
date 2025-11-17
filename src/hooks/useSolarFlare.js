import { useState, useEffect } from "react";

export default function useSolarFlare() {
  const [flareCount, setFlareCount] = useState(0);
  const [maxIntensity, setMaxIntensity] = useState(null);
  const [latestFlare, setLatestFlare] = useState(null);
  const [groupedFlares, setGroupedFlares] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_NASA_API_KEY;

  useEffect(() => {
    console.log("NASA KEY:", apiKey);
  }, []);

  // Convert flare class C/M/X → number
  const parseIntensity = (value) => {
    if (!value) return 0;
    const scale = value[0];
    const num = parseFloat(value.slice(1));
    if (scale === "C") return num * 1;
    if (scale === "M") return num * 10;
    if (scale === "X") return num * 100;
    return num;
  };

  // Format yyyy-mm-dd
  const formatDate = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);

        const startDate = formatDate(start);
        const endDate = formatDate(end);

        console.log("Fetching flare data from:", startDate, "to", endDate);

        const url = `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`;
        const res = await fetch(url);

        if (!res.ok) throw new Error("Failed to fetch solar flare data");

        const data = await res.json();

        console.log("Fetched flare records:", data.length);

        if (!data || data.length === 0) {
          setFlareCount(0);
          setMaxIntensity(null);
          setLatestFlare(null);
          setGroupedFlares({});
          return;
        }

        // Group flares by date
        const grouped = {};
        data.forEach((flare) => {
          const date = flare.beginTime.split("T")[0];
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(flare);
        });

        setGroupedFlares(grouped);
        setFlareCount(data.length);

        // Sort by intensity to find strongest
        const sortedByIntensity = [...data].sort(
          (a, b) => parseIntensity(b.classType) - parseIntensity(a.classType)
        );

        setMaxIntensity(sortedByIntensity[0].classType);
        setLatestFlare(sortedByIntensity[0]);

      } catch (err) {
        console.error("Solar flare error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    flareCount,
    maxIntensity,
    latestFlare,
    groupedFlares,
    isLoading,
    error,
  };
}
