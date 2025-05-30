import React, { useEffect, useRef, useState, useContext } from 'react'
import gsap from 'gsap';
import { SoundContext } from './SoundProvider';
import planetsData from "../data/planets"


export default function PlanetInfoModalContent({ onClose, planetData }) {

    const modalRef = useRef(null);
    const [isClosing, setIsClosing] = useState(false);
    const { playClickSound } = useContext(SoundContext)

    useEffect(() => {
        if (modalRef.current) {
            gsap.fromTo(modalRef.current,
                {
                    // scale: 0.85,
                    y: 850,
                },
                {
                    // scale: 1,
                    y: 0,
                    duration: .8,
                    ease: 'power2.out'
                }
            );
        }
    }, []);

    const handleClose = () => {
        if (modalRef.current) {
            setIsClosing(true);
            playClickSound();

            gsap.to(modalRef.current, {
                // opacity: 0,
                // scale: 0.85,
                y: 840,
                duration: 0.6,
                ease: 'power2.in',
                onComplete: () => {
                    onClose();
                }
            });
        }
    };


    return (
        <div data-lenis-prevent ref={modalRef} className='fixed inset-0 z-50 p-6 md:p-14 flex items-center justify-center backdrop-blur-xl bg-black/50'>
            <div className='relative w-full p-2 md:p-8 lg:p-10 h-full max-h-[95vh] text-primary primary-border ' >
                <div onClick={handleClose}
                    className='trapezoid cursor-pointer absolute left-1/2 top-0 -translate-x-1/2 w-1/2 p-2 flex justify-center items-center'>
                    <button
                        className="w-4 h-3 bg-white cursor-pointer "
                        style={{
                            clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                        }}
                        aria-label="Close"
                    ></button>
                </div>

                <div className='h-full overflow-y-auto px-2 py-8 lg:py-2'>
                    <div className='flex justify-center items-center gap-6 md:gap-10'>
                        <div className='h-[1px] w-full bg-primary/50'></div>
                        <h2>{planetData.name}</h2>
                        <div className='h-[1px] w-full bg-primary/50'></div>
                    </div>

                    <div className='mt-10 flex flex-col gap-10 md:flex-row'>
                        <div className='flex-1 w-full  h-fit md:sticky md:top-20'>
                            <model-viewer
                                key={planetData.name}
                                className="w-full p-2 h-[230px] md:w-[300px] md:h-[280px] lg:w-full lg:h-[510px]"
                                src={planetData.model}
                                loading="eager"
                                auto-rotate
                                camera-controls
                                disable-pan
                                tone-mapping="reinhard"
                                {...(planetData.needsEnv && { 'environment-image': '/space.hdr' })}
                            ></model-viewer>
                        </div>

                        <div className='flex-1 w-full h-fit'>
                            <div className="w-full h-fit grid grid-cols-2 border border-primary/50 text-tiny md:text-sm">
                                {planetData.facts.map(([label, value], i) => (
                                    <>
                                        <p key={`label-${i}`} className={`p-4 border-r-[.5px] border-dashed border-primary/50 font-bold uppercase tracking-widest text-white glow-text ${i % 2 === 0 ? 'bg-primary/15' : ''}`}>
                                            {label}
                                        </p>
                                        <p key={`value-${i}`} className={`p-4 ${i % 2 === 0 ? 'bg-primary/15' : ''}`}>
                                            {value}
                                        </p>
                                    </>
                                ))}
                            </div>

                            {/* Fun Fact */}
                            <div className='h-full flex-1 mt-10 border p-4 border-primary/50'>
                                <h4 className='text-2xl uppercase font-bold tracking-widest mb-3 text-white glow-text'>Fun Facts</h4>
                                <p className=''>{planetData.funFacts}</p>

                                <a href={planetData.link} target='_blank' className='text-white font-nebula'>
                                    <span className='mt-10 p-4 w-full flex justify-center items-center bg-primary/50 hover:bg-primary/70 transition duration-200'>
                                        VIEW MORE FACTS
                                    </span>
                                </a>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
