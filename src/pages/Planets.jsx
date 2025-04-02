import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import PlanetInfoModal from '../components/PlanetInfoModal';
import planets from "../data/planets"

export default function Planets() {
    const containerRef = useRef();
    const cardsRef = useRef([]);
    const textRef = useRef([]);
    const [index, setIndex] = useState(0);
    const totalItems = planets.length;
    const isAnimating = useRef(false);

    const [modalOpen, setModalOpen] = useState(false);
    const modalOpenRef = useRef(false);

    const currentPlanet = planets[index]

    useEffect(() => {
        const handleScroll = (e) => {
            // if (modalOpenRef.current) {
            //     e.preventDefault();
            //     return;
            // }
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

                // Debounce scroll for 800ms (match animation)
                // setTimeout(() => {
                //     isAnimating.current = false;
                // }, 800);
            }
        };

        if (!modalOpen) {
            window.addEventListener('wheel', handleScroll, { passive: false });
        }

        return () => {
            window.removeEventListener('wheel', handleScroll);
        };

    }, [index, modalOpen]);

    useEffect(() => {
        cardsRef.current.forEach((card, i) => {
            const offset = i - index;

            let x = 0;
            let y = 0;
            let z = 0;
            let scale = 1.4;
            let opacity = 1;
            let filter = 'blur(0px)';

            if (offset === 0) {
                // Main planet in front
                x = 0;
                y = (planets[i].name === 'Saturn' || planets[i].name === 'Uranus') ? -20 : 120;
                z = 0;
                scale = (planets[i].name === 'Saturn' || planets[i].name === 'Uranus') ? 3.2 : 2.5;
                filter = 'blur(0px)';

            } else if (offset === 1) {
                // Next planet, to the right, behind
                x = 550;
                y = -280;
                z = -300;
                scale = 0.5;
                opacity = .8;
                filter = 'blur(4px)';


            } else if (offset === 2) {
                // Previous planet, to the left, behind
                x = -450;
                y = -480;
                z = -300;
                scale = 0.2;
                opacity = .3;
                filter = 'blur(8px)';

            } else if (offset === 3) {
                x = 450;
                y = -480;
                z = -300;
                scale = 0.2;
                opacity = 0;
            } else {
                // Hide far planets
                opacity = 0;
                scale = 0.1;
                x = -100;
                y = 80;
                z = 800;
            }

            gsap.to(card, {
                x,
                y,
                z,
                scale,
                opacity,
                duration: 1,
                ease: 'sine.inOut',
                transformPerspective: 2000,
                transformOrigin: 'center',
                zIndex: i === index ? 10 : 0,
                onComplete: () => {
                    isAnimating.current = false;
                },
            });

            // find the inner wrapper for blur and animate it
            const wrapper = card.querySelector('.glow-wrapper') || card.querySelector('div');
            if (wrapper) {
                gsap.to(wrapper, {
                    filter,
                    duration: 1,
                    ease: 'sine.out',
                });
            }
        });

        if (!textRef.current) return;

        gsap.fromTo(
            textRef.current,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: .8,
                ease: 'sine.inOut',
            }
        );
    }, [index]);



    return (
        <section className="h-screen overflow-hidden relative" ref={containerRef}>
            <div ref={textRef} className="z-30 absolute top-10 w-full text-center">

                <h2 className="mt-10 text-6xl font-nebukla uppercase tracking-widest">{planets[index].name}</h2>
                <p className="max-w-2xl mx-auto mt-4 text-base font-light px-4">
                    {planets[index].description}
                </p>

                <PlanetInfoModal
                    setModalOpen={setModalOpen}
                    modalOpenRef={modalOpenRef}
                    planet={currentPlanet}
                />

            </div>
            <ul className="perspective-wrapper relative w-full h-full z-20">
                {planets.map((planet, i) => (
                    <li
                        key={i}
                        ref={(el) => (cardsRef.current[i] = el)}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center text-2xl font-bold rounded-full"
                    >
                        <div className="w-full h-full flex items-center justify-center">
                            <div className={`${planet.glowClass} transition-all duration-500`}
                                style={{ filter: planet.blur }}>
                                <model-viewer
                                    src={planet.model}
                                    auto-rotate
                                    interaction-prompt="none"
                                    camera-controls
                                    disable-zoom
                                    disable-pan
                                    disable-tap
                                    {...(planet.modelScale && { 'model-scale': planet.modelScale })}
                                    tone-mapping="reinhard"
                                    {...(planet.needsEnv && { 'environment-image': '/space.hdr' })}

                                    className="w-[230px] h-[230px] md:w-[280px] md:h-[280px] lg:w-[320px] lg:h-[320px]"
                                ></model-viewer>
                            </div>
                        </div>

                    </li>
                ))}
            </ul>
        </section>
    );
}


// const planets = [
//     {
//         name: 'Sun',
//         model: '/sun.glb',
//         needsEnv: true,
//         glowClass: "glow-wrapper",
//         description: 'The Sun is the star at the center of the Solar System and the source of light and heat for all planets.'
//     },
//     {
//         name: 'Mercury',
//         model: '/mercury2.glb',
//         glowClass: "",
//         needsEnv: false,
//         description: 'Mercury is the smallest planet in the Solar System and closest to the Sun.'
//     },
//     {
//         name: 'Venus',
//         model: '/venus.glb',
//         glowClass: "",
//         needsEnv: false,
//         description: 'Venus is the second planet from the Sun and has a thick, toxic atmosphere.'
//     },
//     {
//         name: 'Earth',
//         model: '/earth.glb',
//         glowClass: "",
//         needsEnv: false,
//         description: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life.'
//     },
//     {
//         name: 'Mars',
//         model: '/mars.glb',
//         glowClass: "",
//         needsEnv: false,
//         description: 'Mars is known as the Red Planet and is home to the tallest mountain in the Solar System.'
//     },
//     {
//         name: 'Jupiter',
//         model: '/jupiter.glb',
//         glowClass: "",
//         needsEnv: false,
//         description: 'Jupiter is the largest planet in the Solar System and has a giant red storm.'
//     },
//     {
//         name: 'Saturn',
//         model: '/saturn.glb',
//         needsEnv: false,
//         modelScale: '2 2 2',
//         glowClass: "",
//         description: 'Saturn is famous for its stunning rings made of ice and rock.'
//     },
//     {
//         name: 'Uranus',
//         model: '/uranus.glb',
//         needsEnv: false,
//         glowClass: "",
//         description: 'Uranus rotates on its side and has a pale blue color due to methane in its atmosphere.'
//     },
//     {
//         name: 'Neptune',
//         model: '/neptune.glb',
//         needsEnv: false,
//         glowClass: "",
//         description: 'Neptune is a deep blue planet known for its strong winds and storms.'
//     },
// ];

// useEffect(() => {
//     cardsRef.current.forEach((card, i) => {
//         const offset = i - index;

//         gsap.to(card, {
//             x: `${offset * 700}px`,
//             y: i === index
//                 ? (planets[i].name === 'Saturn' || planets[i].name === 'Uranus' ? '0px' : '180px')
//                 : '-250px',
//             scale: i === index ? 2.8 : 0.8,
//             zIndex: i === index ? 10 : 1,
//             opacity: 1,
//             duration: 1,
//             ease: 'sine.inOut',
//             transformPerspective: 1000,
//             onComplete: () => {
//                 isAnimating.current = false;
//             },
//         });
//     });

//     if (!textRef.current) return;

//     gsap.fromTo(
//         textRef.current,
//         { opacity: 0, y: 20 },
//         {
//             opacity: 1,
//             y: 0,
//             duration: 1.5,
//             ease: 'sine.out',
//         }
//     );

// }, [index]);