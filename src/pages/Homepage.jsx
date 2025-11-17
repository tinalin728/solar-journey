import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState, useRef } from "react";
import Dashboard from "../components/dashboard/Dashboard";
import LoadingScreen from "../components/loaders/LoadingScreen";
import PrimaryButton from "../components/buttons/PrimaryButton";
import { SoundContext } from "../context/SoundProvider";
import useSolarFlare from "../hooks/useSolarFlare";

export default function Homepage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const { playClickSound, playLoadingSound, isSoundOn } =
    useContext(SoundContext);
  const { flareCount, maxIntensity, latestFlare, isLoading } = useSolarFlare();

  const handleExploreClick = () => {
    playClickSound();
    setTimeout(() => navigate("/planets"), 500);
  };

  useEffect(() => {
    setIsLoaded(false);

    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {!isLoaded ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <LoadingScreen playSound={isSoundOn ? playLoadingSound : null} />
        </div>
      ) : (
        <Dashboard>
          

          <h1 className="font-nebula font-bold uppercase text-center glow-text -mt-14 md:-mt-10">
            To <br /> Infinity & beyond
          </h1>

          <h3 className="mt-5 text-primary text-center mb-10">
            Through the Solar System
          </h3>

          <PrimaryButton label="Explore Now" onClick={handleExploreClick} />
        </Dashboard>
      )}
    </>
  );
}
