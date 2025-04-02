import React, { useEffect, useRef, useState } from 'react';

export default function Starfield({
    speedFactor = 0.2,
    backgroundColor = 'black',
    starColor = [255, 255, 255],
    starCount = 8000,
}) {


    const modelRef = useRef();
    const scrollRef = useRef()

    useEffect(() => {
        const canvas = document.getElementById('starfield');
        if (!canvas) return console.error('Canvas element not found');

        const c = canvas.getContext('2d');
        if (!c) return console.error('Could not get 2d context');

        const setCanvasExtents = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        // Initial canvas sizing
        setCanvasExtents();

        // Update on window resize
        window.addEventListener('resize', setCanvasExtents);

        const makeStars = (count) =>
            Array.from({ length: count }, () => ({
                x: Math.random() * 1600 - 800,
                y: Math.random() * 900 - 450,
                z: Math.random() * 1000,
            }));

        let stars = makeStars(starCount);

        const clear = () => {
            c.fillStyle = backgroundColor;
            c.fillRect(0, 0, canvas.width, canvas.height);
        };

        const putPixel = (x, y, brightness) => {
            const rgb = `rgba(${starColor[0]},${starColor[1]},${starColor[2]},${brightness})`;
            c.fillStyle = rgb;
            c.fillRect(x, y, 1.5, 1.2);
        };

        const moveStars = (distance) => {
            for (let s of stars) {
                s.z -= distance;
                if (s.z <= 1) s.z += 1000;
            }
        };

        let prevTime;

        const init = (time) => {
            prevTime = time;
            requestAnimationFrame(tick);
        };

        const tick = (time) => {
            const elapsed = time - prevTime;
            prevTime = time;

            moveStars(elapsed * speedFactor);
            clear();

            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;

            for (let star of stars) {
                const x = cx + star.x / (star.z * 0.001);
                const y = cy + star.y / (star.z * 0.001);

                if (x < 0 || x >= window.innerWidth || y < 0 || y >= window.innerHeight) continue;

                const d = star.z / 1000;
                const b = 1 - d * d;

                putPixel(x, y, b);
            }

            requestAnimationFrame(tick);
        };

        requestAnimationFrame(init);

        // Clean up
        return () => {
            window.removeEventListener('resize', setCanvasExtents);
        };
    }, [starColor, backgroundColor, speedFactor, starCount]);


    return (
        <canvas
            id="starfield"
            style={{
                padding: 0,
                margin: 0,
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 10,
                opacity: 1,
                pointerEvents: 'none',
                mixBlendMode: 'screen',
            }}
        />
    )
}
