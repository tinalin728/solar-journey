import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoadQueue } from "preload-js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import Dashboard from "../components/dashboard/Dashboard";
import PlanetInfoModal from "../components/planets/PlanetInfoModal";
import planetsData from "../data/planets";
import LoadingScreen from "../components/loaders/LoadingScreen";
import { SoundContext } from "../context/SoundProvider";

export default function Planets() {
  const planets = planetsData || [];
  const [isLoaded, setIsLoaded] = useState(false);
  const [index, setIndex] = useState(0);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [isSunReady, setIsSunReady] = useState(false);

  const containerRef = useRef();
  const cardsRef = useRef([]);
  const textRef = useRef([]);
  const preloaderRef = useRef(null);
  const contentRef = useRef(null);
  const planetsRef = useRef(null);

  const totalItems = planets.length;
  const isAnimating = useRef(false);

  const [modalOpen, setModalOpen] = useState(false);
  const modalOpenRef = useRef(false);
  const currentPlanet = planets[index] || {};
  const hasAnimatedOnce = useRef(false);

  const { playClickSound, playScrollSound, playLoadingSound, isSoundOn } =
    useContext(SoundContext);
  const navigate = useNavigate();

   useEffect(() => {
      setIsLoaded(false);
  
      const timeout = setTimeout(() => {
        setIsLoaded(true);
      }, 1500); 
  
      return () => clearTimeout(timeout);
    }, []);

  // preloader
  useEffect(() => {
    const queue = new LoadQueue(true);
    playLoadingSound();

    const sun = planets.find((p) => p.name === "Sun");
    if (sun) {
      const modelUrl = sun.model.startsWith("/")
        ? `${window.location.origin}${sun.model}`
        : sun.model;

      // console.log(`Preloading Sun model: ${modelUrl}`);
      planets.forEach((planet) => {
        const modelUrl = planet.model.startsWith("/")
          ? `${window.location.origin}${planet.model}`
          : planet.model;

        queue.loadFile({ id: planet.name, src: modelUrl });
      });
    }

    queue.on("complete", () => {
      if (preloaderRef.current) {
        // preloaderRef.current.classList.add('fade-out');

        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.classList.add("fade-in");
          }

          setIsSunReady(true);
          setIsLoaded(true);
        }, 1500);
      }
    });

    queue.on("error", (e) => {
      console.error(`Failed to load ${e.item.id}`, e);
      setIsLoaded(true);
    });

    return () => {
      queue.removeAllEventListeners();
    };
  }, [planets]);

  // planet position
  function getTransformForOffset(offset, planet) {
    let x = 0,
      y = 0,
      z = 0,
      scale = 1.4,
      opacity = 1;

    if (offset === 0) {
      x = 0;
      y = planet.name === "Saturn" || planet.name === "Uranus" ? -20 : 120;
      z = 0;
      scale = planet.name === "Saturn" || planet.name === "Uranus" ? 3.2 : 2.5;
    } else if (offset === 1) {
      x = 550;
      y = -280;
      z = -300;
      scale = 0.5;
      opacity = 0.8;
    } else if (offset === 2) {
      x = -450;
      y = -480;
      z = -300;
      scale = 0.2;
      opacity = 0.3;
    } else if (offset === 3) {
      x = 450;
      y = -480;
      z = -300;
      scale = 0.2;
      opacity = 0;
    } else {
      x = -100;
      y = 80;
      z = 800;
      scale = 0.1;
      opacity = 0;
    }

    return { x, y, z, scale, opacity };
  }
  

  useEffect(() => {
    if (!isLoaded || hasAnimatedOnce.current) return;

    hasAnimatedOnce.current = true;

    // Set initial planet positions
    cardsRef.current.forEach((card, i) => {
      const offset = i - index;
      const transform = getTransformForOffset(offset, planets[i]);
      gsap.set(
        card,
        {
          ...transform,
          transformPerspective: 2000,
          transformOrigin: "center",
          zIndex: i === index ? 10 : 0,
        },
        "-=0.3"
      );
    });
  }, [isLoaded]);

  // animation after page loads
  useEffect(() => {
    if (!isLoaded || !hasAnimatedOnce.current || !textRef.current) return;

    playScrollSound();

    const tl = gsap.timeline();

    // Card animations (simultaneous)
    cardsRef.current.forEach((card, i) => {
      const offset = i - index;
      const transform = getTransformForOffset(offset, planets[i]);

      tl.to(
        card,
        {
          ...transform,
          duration: 1,
          ease: "sine.inOut",
          transformPerspective: 2000,
          transformOrigin: "center",
          immediateRender: false,
          zIndex: i === index ? 10 : 0,
          onComplete: () => {
            if (planets[i].name === "Sun") {
              card.classList.add("glow-wrapper");
            }
            isAnimating.current = false;
          },
        },
        0
      );
    });

    tl.to(
      textRef.current,
      {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "sine.in",
        onComplete: () => {
          setDisplayedIndex(index);
        },
      },
      "<"
    );

    tl.to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "sine.out",
    });
  }, [index, isLoaded]);

  // scroll, modal control
  useEffect(() => {
    if (!isLoaded || modalOpen) return;

    const handleScroll = (e) => {
      e.preventDefault();

      const rect = containerRef.current.getBoundingClientRect();
      const fullyInView = rect.top <= 0 && rect.bottom >= window.innerHeight;

      if (!fullyInView) return;

      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      const delta = e.deltaY;
      let nextIndex = index;

      // Up scroll when already on Sun → let it scroll out
      if (index === 0 && delta < 0) return;

      e.preventDefault();

      if (delta > 20 && index < totalItems - 1) {
        nextIndex = index + 1;
      } else if (delta < -20 && index > 0) {
        nextIndex = index - 1;
      }

      if (nextIndex !== index) {
        isAnimating.current = true;
        setIndex(nextIndex);
      }
    };

    if (!modalOpen) {
      window.addEventListener("wheel", handleScroll, { passive: false });
    }

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [index, modalOpen, isLoaded]);

  // buttons
  const handlePrev = () => {
    if (index > 0 && !isAnimating.current) {
      isAnimating.current = true;
      setIndex(index - 1);
      playScrollSound();
      playClickSound();
    }
  };

  const handleNext = () => {
    if (index < totalItems - 1 && !isAnimating.current) {
      isAnimating.current = true;
      setIndex(index + 1);
      playScrollSound();
      playClickSound();
    }
  };

  return (
    <section
      className="h-screen overflow-hidden relative bg-black"
      ref={containerRef}
    >
      {!isLoaded ? (
          <div className="fixed inset-0 flex items-center justify-center z-50">
                    <LoadingScreen playSound={isSoundOn ? playLoadingSound : null} />
                </div>
      ) : (
        <>
          <div
            ref={textRef}
            className="absolute z-[30] top-[18%] left-1/2 -translate-x-1/2 w-full px-3 text-center md:w-fit pointer-events-auto opacity-0 "
          >
            <h2 className="">{planets[displayedIndex]?.name}</h2>
            <p className="max-w-2xl mx-auto mt-4 mb-8 font-light">
              {planets[displayedIndex]?.description}
            </p>
            <PlanetInfoModal
              setModalOpen={setModalOpen}
              modalOpenRef={modalOpenRef}
              planet={currentPlanet}
            />
          </div>

          <Dashboard
            homeMode={true}
            showArrows={true}
            onPrev={handlePrev}
            onNext={handleNext}
            setModalOpen={setModalOpen}
          modalOpenRef={modalOpenRef}
          >
            <div
              ref={contentRef}
              id="content"
              className="relative h-full w-full z-0"
            >
              <ul
                ref={planetsRef}
                className=" perspective-wrapper w-full h-full"
              >
                {planets.map((planet, i) => (
                  <li
                    key={planet.name}
                    ref={(el) => (cardsRef.current[i] = el)}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center text-2xl font-bold rounded-full"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <div
                        className={`${planet.glowClass} transition-all duration-500`}
                        style={{ filter: planet.blur }}
                      >
                        <model-viewer
                          key={planet.name}
                          className="w-[230px] h-[230px] md:w-[280px] md:h-[280px] lg:w-[320px] lg:h-[320px] xl:w-[340px] xl:h-[340px]"
                          src={planet.model}
                          loading="eager"
                          auto-rotate
                          interaction-prompt="none"
                          camera-controls
                          disable-zoom
                          disable-pan
                          disable-tap
                          {...(planet.modelScale && {
                            "model-scale": planet.modelScale,
                          })}
                          tone-mapping="reinhard"
                          {...(planet.needsEnv && {
                            "environment-image": "/space.hdr",
                          })}
                        ></model-viewer>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Dashboard>
        </>
      )}
    </section>
  );
}
