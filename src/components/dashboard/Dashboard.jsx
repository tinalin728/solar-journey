import React, { useEffect, useRef, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import gsap from "gsap";
import useSolarFlare from "../../hooks/useSolarFlare";
import SolarFlareReport from "../api-modal/SolarFlareReport";
import SolarWind from "./SolarWind";
import { SoundContext } from "../../context/SoundProvider";
import on from "../../../public/icons/sound-on.svg";
import off from "../../../public/icons/sound-off.svg";
import home from "../../../public/icons/home.svg";
import TextButton from "../buttons/TextButton";

export default function Dashboard({
  children,
  homeMode = false,
  showArrows = false,
  onPrev,
  onNext,
  setModalOpen = null,
  modalOpenRef = null,
}) {
  const borderRef = useRef();
  const contentRef = useRef();
  const hudRef = useRef();
  const topHudRef = useRef();
  const navigate = useNavigate();

  const { isSoundOn, setIsSoundOn, playScrollSound, playClickSound } =
    useContext(SoundContext);
  const { groupedFlares, isLoading, error } = useSolarFlare();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (setModalOpen) setModalOpen(showModal);        
    if (modalOpenRef) modalOpenRef.current = showModal;
  }, [showModal]);

  // global time
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  // global speed
  const [speed, setSpeed] = useState(10500);

  const handleSoundToggle = () => {
    const next = !isSoundOn;

    if (next) {
      const audio = new Audio("/sound/click.mp3");
      audio.volume = 0.5;
      audio.play();
    }

    setIsSoundOn(next);
  };

  // GSAP animations shared across pages
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      borderRef.current,
      { scaleX: 0, transformOrigin: "center" },
      { scaleX: 1, duration: 1, ease: "power4.out", onStart: () => playScrollSound(), }
    );

    tl.fromTo(
      topHudRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );

    tl.fromTo(
      hudRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
      "<"
    );

    tl.fromTo(
      contentRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="relative w-full h-screen p-[6px] md:p-10 z-20">
      <div
        ref={borderRef}
        className="absolute top-0 primary-border w-full h-full z-20"
      >
        {/* top HUD */}
        <div
          ref={topHudRef}
          className="w-full flex justify-between items-start absolute top-4 px-4 md:px-6 z-10"
        >
          {homeMode ? (
            <button
              onClick={() => {
                if (isSoundOn) playClickSound();
                setTimeout(() => navigate("/"), 500);
              }}
              className="opacity-85"
            >
              <img src={home} width={35} alt="home" />
            </button>
          ) : (
            <p className="!text-sm uppercase tracking-widest text-primary/80 py-2">
              SYSTEM: Online
            </p>
          )}
          <button onClick={handleSoundToggle} className="h-10">
            <img
              src={isSoundOn ? on : off}
              alt="sound"
              width={35}
              className="opacity-80"
            />
          </button>
        </div>

        {/* bottom HUD */}
        <div
          ref={hudRef}
          className="w-full flex flex-col justify-center items-center md:flex-row md:justify-between md:items-end px-4 absolute bottom-4 md:px-6"
        >
          <div>
            <SolarWind />
          </div>

          <div className="flex flex-col justify-center items-end text-primary/90">
            <TextButton
              onClick={() => setShowModal(true)}
              label="check flare report"
            />
            {showModal &&
              createPortal(
                <SolarFlareReport
                  groupedFlares={groupedFlares}
                  isLoading={isLoading}
                  error={error}
                  onClose={() => {
                    if (setModalOpen) setModalOpen(false);           
                    if (modalOpenRef) modalOpenRef.current = false; 
                    setShowModal(false);   
                  }}
                />,
                document.body
              )}
          </div>
        </div>
        {showArrows && (
          <>
            <div
              onClick={onPrev}
              className="cursor-pointer absolute top-1/2 left-0 -translate-y-1/2 p-[5px] md:p-2 flex justify-center items-center bg-primary/50 h-1/3 md:h-1/2"
              style={{ clipPath: "polygon(0% 0%, 100% 5%, 100% 95%, 0% 100%)" }}
            >
              <button
                style={{ clipPath: "polygon(100% 0, 0 50%, 100% 100%)" }}
                className="w-3 h-4 bg-white cursor-pointer"
                aria-label="previous"
              ></button>
            </div>

            <div
              onClick={onNext}
              className="cursor-pointer absolute top-1/2 right-0 -translate-y-1/2 p-[5px] md:p-2 flex justify-center items-center bg-primary/50 h-1/3 md:h-1/2"
              style={{ clipPath: "polygon(0% 5%, 100% 0%, 100% 100%, 0% 95%)" }}
            >
              <button
                style={{ clipPath: "polygon(100% 0, 0 50%, 100% 100%)" }}
                className="rotate-180 w-3 h-4 bg-white cursor-pointer"
                aria-label="next"
              ></button>
            </div>
          </>
        )}
      </div>

      {/* Page content */}
      <div
        ref={contentRef}
        className="w-full h-full flex flex-col justify-center items-center p-1 absolute top-0 left-0"
      >
        {children}
      </div>
    </div>
  );
}
