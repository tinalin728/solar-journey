// hooks/useLenisScroll.js
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useLenisScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            direction: 'vertical',
            gestureDirection: 'vertical',
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // sync with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        return () => {
            lenis.destroy();
        };
    }, []);
}
