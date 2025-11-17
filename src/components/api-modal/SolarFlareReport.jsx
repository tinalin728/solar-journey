import React, { useRef, useEffect, useState, useContext } from "react";
import TextButton from "../buttons/TextButton";
import gsap from "gsap";
import { SoundContext } from "../../context/SoundProvider";

export default function SolarFlareReport({ onClose, groupedFlares, isLoading, error }) {
  const reportRef = useRef(null);
  const contentRef = useRef(null);
  const buttonRef = useRef(null);
  const backdropRef = useRef(null);
  const { playClickSound, playScrollSound, playLoadingSound } = useContext(SoundContext);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    if (reportRef.current && contentRef.current) {
      // Scale the panel
      const tl = gsap.timeline();
      tl.fromTo(
        reportRef.current,
        { scaleY: 0, transformOrigin: "center" },
        {
          scaleY: 1,
          duration: 0.6,
          ease: "power2.out",
          onStart: () => playScrollSound(),
        }
      );

      // Clip path the content
      tl.fromTo(
        contentRef.current,
        { clipPath: "inset(0 0 100% 0)", opacity: 0 },
        {
          clipPath: "inset(0 0 0% 0)",
          opacity: 1,
          duration: 0.8,
        onStart: () => playLoadingSound(),
        }
      );

      tl.fromTo(
        buttonRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      );
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleClose = () => {
    playClickSound();
    const tl = gsap.timeline({
      onComplete: () => {
        onClose();
      },
    });

    tl.to(buttonRef.current, {
      opacity: 0,
      duration: 0.3,
    });

    // Clip and fade out content
    tl.to(
      contentRef.current,
      {
        clipPath: "inset(0 0 100% 0)",
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      },
      "<"
    );

    tl.to(reportRef.current, {
      scaleY: 0,
      transformOrigin: "center",
      duration: 0.6,
      ease: "power2.in",
      onStart: () => playScrollSound(),
    });

    tl.to(backdropRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
    });
  };
  
  return (
   <div
      ref={backdropRef}
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-[5px] flex items-center justify-center h-screen"
    >
      <div
        ref={reportRef}
        className="bg-[#0a1414]/50 primary-border h-[98vh] md:h-[95vh] 
      max-w-[1000px] w-[97vw] text-primary overflow-hidden relative p-2 md:p-6 lg:p-10"
      >
        <div
          data-lenis-prevent
          ref={contentRef}
          className="bg-white/10 backdrop-blur-[5px] p-4 h-[91vh] md:h-[85vh] lg:p-10 overflow-y-auto relative
          [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar-track]:w-1
            [&::-webkit-scrollbar-track]:bg-white/10
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-primary
        "
        >
          <div className="flex justify-center items-center gap-6 md:gap-10 mt-4 mb-10">
            <div className="hidden md:block h-[1px] w-full bg-primary/50"></div>
            <h3 className="md:text-nowrap text-white text-center">Solar Flare Report</h3>
            <div className="hidden md:block h-[1px] w-full bg-primary/50"></div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <p className="text-primary text-center text-lg">Loading solar flare data...</p>
          )}

          {/* Error state */}
          {error && (
            <p className="text-red-400 text-center">Error: Failed to fetch data</p>
          )}

          {/* No data */}
          {!isLoading && !error && (!groupedFlares || Object.keys(groupedFlares).length === 0) && (
            <p className="text-white text-center opacity-70">
              No solar flare data available for the past 30 days.
            </p>
          )}

          {/* Loop each date */}
          {!isLoading && !error && Object.entries(groupedFlares)
            .reverse()
            .map(([date, flares]) => (
              <div key={date} className="mb-10" id="flare-report">
                <div className="relative">
                  <h5 className="text-nowrap text-white uppercase tracking-widest mb-2">
                    {new Date(date + "T00:00:00Z").toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </h5>

                  {flares.map(flare => {
                    const flareFacts = [
                      ["Flare Class", flare.classType],
                      ["Start Time", flare.beginTime.replace("Z", "")],
                      ["Peak Time", flare.peakTime.replace("Z", "")],
                      ["End Time", flare.endTime.replace("Z", "")],
                      ["Active Region", flare.activeRegionNum],
                      ["Source Location", flare.sourceLocation],
                    ];
                    return (
                      <div
                        key={flare.flrID}
                        className="mb-6 w-full grid grid-cols-2 border border-primary/50 text-tiny md:text-sm"
                      >
                        {flareFacts.map(([label, value], i) => (
                          <React.Fragment key={i}>
                            <p
                              className={`p-4 border-r-[.5px] border-dashed border-primary/50 font-bold uppercase tracking-widest text-white glow-text ${
                                i % 2 === 0 ? "bg-primary/15" : ""
                              }`}
                            >
                              {label}
                            </p>

                            <p
                              className={`p-4 ${
                                i % 2 === 0 ? "bg-primary/15" : ""
                              }`}
                            >
                              {String(value)}
                            </p>
                          </React.Fragment>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>

        <div
          ref={buttonRef}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 "
        >
          <TextButton onClick={handleClose} label="Close" />
        </div>
      </div>
    </div>

  );
}
