import { useEffect, useState } from "react";

export default function SolarWind() {
  const [speed, setSpeed] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchSolarWind() {
      try {
        const res = await fetch(
          "https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json"
        );

        if (!res.ok) throw new Error("API unavailable");

        const data = await res.json();

        // Last row = newest reading
        const latest = data[data.length - 1];
        const windSpeed = latest[2]; 

        if (windSpeed === undefined) throw new Error();

        setSpeed(Math.round(windSpeed));
      } catch (err) {
        console.error("Solar wind fetch failed");
        setError(true);
      }
    }

    fetchSolarWind();
    const interval = setInterval(fetchSolarWind, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (error) return <div>[ SOLAR WIND: N/A ]</div>;

  if (speed === null) return <div>[ LOADING... ]</div>;

  return (
    <p className="!text-sm uppercase tracking-widest text-primary/80">
      SOLAR WIND: {speed} km/s
    </p>
  );
}
