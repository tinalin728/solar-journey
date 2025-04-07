import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadQueue } from "preload-js";
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import PlanetInfoModal from '../components/PlanetInfoModal';
import planetsData from "../data/planets"
import LoadingScreen from '../components/LoadingScreen';
import { SoundContext } from '../components/SoundProvider';


import on from '../../public/icons/sound-on.svg'
import off from '../../public/icons/sound-off.svg'
import home from '../../public/icons/home.svg'
import loadingSound from '/sound/loading.mp3';

export default function Planets() {
    const planets = planetsData || [];
    const [isLoaded, setIsLoaded] = useState(false);
    const [index, setIndex] = useState(0);
    const [displayedIndex, setDisplayedIndex] = useState(0);
    const [isSunReady, setIsSunReady] = useState(false);
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [speed, setSpeed] = useState(10500);


    const containerRef = useRef();
    const cardsRef = useRef([]);
    const borderRef = useRef(null);
    const textRef = useRef([]);
    const preloaderRef = useRef(null);
    const contentRef = useRef(null);

    const totalItems = planets.length;
    const isAnimating = useRef(false);

    const [modalOpen, setModalOpen] = useState(false);
    const modalOpenRef = useRef(false);
    const currentPlanet = planets[index] || {};
    const hasAnimatedOnce = useRef(false);

    const { isSoundOn, setIsSoundOn, playClickSound, playScrollSound, playHoverSound } = useContext(SoundContext);
    const navigate = useNavigate();

    const playLoadingSound = () => {
        if (!isSoundOn) return;

        const loadingSound = new Audio('/sound/loading.mp3');
        loadingSound.volume = 0.4;
        loadingSound.playbackRate = 1.3;
        loadingSound.play();
    };
    // preloader
    useEffect(() => {
        const queue = new LoadQueue(true);
        playLoadingSound();

        const sun = planets.find(p => p.name === "Sun");
        if (sun) {
            const modelUrl = sun.model.startsWith('/')
                ? `${window.location.origin}${sun.model}`
                : sun.model;

            // console.log(`Preloading Sun model: ${modelUrl}`);
            planets.forEach((planet) => {
                const modelUrl = planet.model.startsWith('/')
                    ? `${window.location.origin}${planet.model}`
                    : planet.model;

                queue.loadFile({ id: planet.name, src: modelUrl });
            });
        }

        queue.on('complete', () => {
            if (preloaderRef.current) {
                preloaderRef.current.classList.add('fade-out');

                setTimeout(() => {

                    if (contentRef.current) {
                        contentRef.current.classList.add('fade-in');
                    }

                    setIsSunReady(true);
                    setIsLoaded(true);
                }, 1000);
            };
        });

        queue.on('error', e => {
            console.error(`Failed to load ${e.item.id}`, e);
            setIsLoaded(true);
        });

        return () => {
            queue.removeAllEventListeners();
        };
    }, [planets]);

    // planet position
    function getTransformForOffset(offset, planet) {
        let x = 0, y = 0, z = 0, scale = 1.4, opacity = 1;

        if (offset === 0) {
            x = 0;
            y = (planet.name === 'Saturn' || planet.name === 'Uranus') ? -20 : 120;
            z = 0;
            scale = (planet.name === 'Saturn' || planet.name === 'Uranus') ? 3.2 : 2.5;
        } else if (offset === 1) {
            x = 550; y = -280; z = -300; scale = 0.5; opacity = 0.8;
        } else if (offset === 2) {
            x = -450; y = -480; z = -300; scale = 0.2; opacity = 0.3;
        } else if (offset === 3) {
            x = 450; y = -480; z = -300; scale = 0.2; opacity = 0;
        } else {
            x = -100; y = 80; z = 800; scale = 0.1; opacity = 0;
        }

        return { x, y, z, scale, opacity };
    }

    useEffect(() => {
        if (!isLoaded || hasAnimatedOnce.current) return;

        hasAnimatedOnce.current = true;

        const tl = gsap.timeline();

        tl.fromTo(borderRef.current, {
            scaleX: 0,
            transformOrigin: "center",
        }, {
            scaleX: 1,
            duration: 1,
            ease: "power4.out"
        });

        // Set initial planet positions
        cardsRef.current.forEach((card, i) => {
            const offset = i - index;
            const transform = getTransformForOffset(offset, planets[i]);
            gsap.set(card, {
                ...transform,
                transformPerspective: 2000,
                transformOrigin: "center",
                zIndex: i === index ? 10 : 0,
            });
        });

        // 3. Animate cards after border
        cardsRef.current.forEach((card, i) => {
            const offset = i - index;
            const transform = getTransformForOffset(offset, planets[i]);
            tl.to(card, {
                ...transform,
                duration: 1,
                ease: "sine.inOut",
                transformPerspective: 2000,
                transformOrigin: "center",
                immediateRender: false,
                zIndex: i === index ? 10 : 0,
            }, "-=0.6");
        });

        // 4. Animate textRef
        tl.fromTo(textRef.current, {
            opacity: 0,
            y: 20,
        }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "sine.out",
        });

    }, [isLoaded]);

    useEffect(() => {
        if (!isLoaded || !hasAnimatedOnce.current || !textRef.current) return;

        playScrollSound();

        const tl = gsap.timeline();

        // Card animations (simultaneous)
        cardsRef.current.forEach((card, i) => {
            const offset = i - index;
            const transform = getTransformForOffset(offset, planets[i]);

            tl.to(card, {
                ...transform,
                duration: 1,
                ease: 'sine.inOut',
                transformPerspective: 2000,
                transformOrigin: 'center',
                immediateRender: false,
                zIndex: i === index ? 10 : 0,
                onComplete: () => {
                    if (planets[i].name === "Sun") {
                        card.classList.add('glow-wrapper');
                    }
                    isAnimating.current = false;
                },
            }, 0);
        });

        tl.to(textRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: 'sine.in',
            onComplete: () => {
                setDisplayedIndex(index);
            }
        }, "<");

        tl.to(textRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'sine.out',
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
            window.addEventListener('wheel', handleScroll, { passive: false });
        }

        return () => {
            window.removeEventListener('wheel', handleScroll);
        };

    }, [index, modalOpen, isLoaded]);


    const handleHomeClick = () => {
        playClickSound();
        setTimeout(() => navigate('/'), 100);
    };

    const handleSoundToggle = () => {

        const nextState = !isSoundOn;

        if (nextState) {
            const clickSound = new Audio('/sound/click.mp3');
            clickSound.volume = 0.5;
            clickSound.play();
        }

        setIsSoundOn(nextState);
    }

    // time date
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();

            const formattedTime = now.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false, // 24-hour
            });

            const formattedDate = now.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
            });

            setTime(formattedTime);
            setDate(formattedDate);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const fluctuation = Math.floor(Math.random() * 6) - 3;
            setSpeed(prev => Math.max(10200, prev + fluctuation));
        }, 500); // update every 1 second

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="h-screen overflow-hidden relative bg-black" ref={containerRef}>
            {!isLoaded || !isSunReady ? (
                <div ref={preloaderRef} id='preloader'>
                    <LoadingScreen />
                </div>
            ) :
                (
                    <>
                        <div ref={contentRef} id='content' className='relative h-full z-20 w-full'>
                            <div className='absolute w-full h-screen p-4 md:p-10 lg:p-14 z-30'>
                                <div ref={borderRef} className='absolute top-0 primary-border w-full h-full z-30'>
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 items-center justify-between max-w-[90rem] w-full mx-auto px-4 md:top-6 md:px-6">
                                        <button onClick={handleHomeClick} >
                                            <img src={home} alt="home" className='w-[40px]' />
                                        </button>
                                        <button onClick={handleSoundToggle}>
                                            <img src={isSoundOn ? on : off}
                                                alt="sound" width={40} />
                                        </button>
                                    </div>

                                    <div className='w-full flex justify-between items-center px-4 absolute bottom-4 md:px-6'>
                                        <div className='font-nebula text-2xl text-white/90 glow-text md:text-3xl lg:text-4xl'>
                                            <p> {time}</p>
                                            <p className='text-lg md:text-xl'> {date}</p>
                                        </div>
                                        <div className="flex flex-col justify-center items-end text-white/90 glow-text">
                                            <p className="font-nebula text-2xl font-bold text-center md:text-3xl lg:text-4xl">{speed.toLocaleString()}</p>
                                            <p className="font-nebula text-lg tracking-widest text-center md:text-xl">KM/M</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div ref={textRef} className="absolute top-20 left-1/2 -translate-x-1/2 w-full px-3 text-center opacity-0 z-40 md:w-fit">
                                <h2 className="mt-10"> {planets[displayedIndex]?.name}</h2>
                                <p className="max-w-2xl mx-auto mt-4 mb-6 text-base font-light px-4 lg:mb-8">{planets[displayedIndex]?.description}</p>

                                <PlanetInfoModal
                                    setModalOpen={setModalOpen}
                                    modalOpenRef={modalOpenRef}
                                    planet={currentPlanet}
                                />

                            </div>

                            <ul className="perspective-wrapper w-full h-full">
                                {planets.map((planet, i) => (
                                    <li
                                        key={planet.name}
                                        ref={(el) => (cardsRef.current[i] = el)}
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center text-2xl font-bold rounded-full"
                                    >
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className={`${planet.glowClass} transition-all duration-500`} style={{ filter: planet.blur }}>
                                                <model-viewer
                                                    key={planet.name}
                                                    className="w-[230px] h-[230px] md:w-[280px] md:h-[280px] lg:w-[320px] lg:h-[320px]"
                                                    src={planet.model}
                                                    loading="eager"
                                                    auto-rotate
                                                    interaction-prompt="none"
                                                    camera-controls
                                                    disable-zoom
                                                    disable-pan
                                                    disable-tap
                                                    {...(planet.modelScale && { 'model-scale': planet.modelScale })}
                                                    tone-mapping="reinhard"
                                                    {...(planet.needsEnv && { 'environment-image': '/space.hdr' })}
                                                ></model-viewer>
                                            </div>
                                        </div>
                                    </li>
                                ))}

                            </ul>
                        </div>
                    </>
                )}
        </section>
    );
}
