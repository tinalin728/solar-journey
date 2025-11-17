import { useState, useEffect } from "react";

export default function useSolarFlare() {
  const [groupedFlares, setGroupedFlares] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_NASA_API_KEY;

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

        const url = `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`;
        const res = await fetch(url);

        if (!res.ok) throw new Error("Failed to fetch solar flare data");

        const data = await res.json();

        if (!data || data.length === 0) {
          setGroupedFlares({});
          return;
        }

        const grouped = {};
        data.forEach((flare) => {
          const date = flare.beginTime.split("T")[0];
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(flare);
        });

        setGroupedFlares(grouped);

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
    groupedFlares,
    isLoading,
    error,
  };
}