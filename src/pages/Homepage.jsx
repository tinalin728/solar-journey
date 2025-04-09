import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { SoundContext } from '../components/SoundProvider';
import LoadingScreen from '../components/LoadingScreen';
import gsap from 'gsap';

import on from '../../public/icons/sound-on.svg'
import off from '../../public/icons/sound-off.svg'

export default function Homepage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [speed, setSpeed] = useState(10500);
    const hasPlayedLoading = useRef(false);


    const borderRef = useRef();
    const contentRef = useRef();
    const hudRef = useRef();
    const topHudRef = useRef();
    const navigate = useNavigate();
    const { playClickSound, isSoundOn, setIsSoundOn, playHoverSound, playLoadingSound } = useContext(SoundContext)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoaded(true);
        }, 1500);

        if (!hasPlayedLoading.current) {
            playLoadingSound();
            hasPlayedLoading.current = true;
        }

        return () => clearTimeout(timeout);
    }, []);


    useEffect(() => {
        if (!isLoaded || !borderRef.current || !contentRef.current) return;

        const tl = gsap.timeline();

        tl.fromTo(
            borderRef.current,
            { scaleX: 0, transformOrigin: "center" },
            {
                scaleX: 1,
                duration: 1,
                ease: "power4.out",
            }
        );
        tl.fromTo(
            topHudRef.current,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
            },
        );

        tl.fromTo(
            contentRef.current.children,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
            },
        );
        tl.fromTo(
            hudRef.current.children,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
            },
            "-=0.2"
        );
    }, [isLoaded]);

    const handleExploreClick = () => {
        playClickSound();
        setTimeout(() => {
            navigate('/planets');
        }, 200);
    };

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

    const handleSoundToggle = () => {

        const nextState = !isSoundOn;

        if (nextState) {
            const clickSound = new Audio('/sound/click.mp3');
            clickSound.volume = 0.5;
            clickSound.play();
        }

        setIsSoundOn(nextState);
    }

    return (
        <>
            <section className='background-grid h-screen over'>
                {!isLoaded ? (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <LoadingScreen />
                    </div>
                ) : (
                    <div className='relative w-full h-screen bg-gray p-4 md:p-10 lg:p-14'>
                        <div ref={borderRef} className='absolute top-0 primary-border w-full h-full z-30'>
                            <div ref={hudRef} className='w-full flex justify-between items-center px-4 absolute bottom-4 md:px-6'>
                                <div className='font-nebula text-2xl text-primary/50 md:text-3xl lg:text-4xl'>
                                    <p> {time}</p>
                                    <p className='text-lg md:text-xl'> {date}</p>
                                </div>
                                <div className="flex flex-col justify-center items-end text-primary/50">
                                    <p className="font-nebula text-2xl font-bold text-center md:text-3xl lg:text-4xl">{speed.toLocaleString()}</p>
                                    <p className="font-nebula text-lg tracking-widest text-center md:text-xl">KM/M</p>
                                </div>
                            </div>

                            <div ref={topHudRef} className='w-full flex justify-between items-center px-4 absolute top-4 md:px-6 z-40'>
                                <div className='font-nebula text-primary/50 text-lg md:text-xl'>
                                    <p className='text-lg md:text-xl'> SYSTEM: Online </p>

                                </div>
                                <button onClick={handleSoundToggle}
                                >
                                    <img src={isSoundOn ? on : off}
                                        alt="sound" width={40} />
                                </button>
                            </div>
                        </div>

                        <div ref={contentRef} className='w-full h-full flex flex-col justify-center items-center p-1 absolute top-0 left-0'>
                            <h1 className='font-nebula font-bold uppercase text-center glow-text'>To <br /> Infinity & beyond</h1>

                            <h3 className='mt-5 text-primary text-center'>Through the Solar System</h3>

                            <button onClick={handleExploreClick}
                                onMouseEnter={playHoverSound}
                                className="group notched-button overflow-visible mt-10 relative z-40">
                                <svg className="notch-border overflow-visible" viewBox="0 0 220 70" xmlns="http://www.w3.org/2000/svg">
                                    <polygon
                                        points="12,0 208,0 220,12 220,58 208,70 12,70 0,58 0,12"
                                        className="notch-static"
                                    />
                                    <polygon
                                        points="12,0 208,0 220,12 220,58 208,70 12,70 0,58 0,12"
                                        className="notch-animated"
                                    />
                                </svg>

                                <div className="ui-btn">
                                    <span className='uppercase font-bold text-primary '>Explore Now</span>
                                </div>

                            </button>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}
