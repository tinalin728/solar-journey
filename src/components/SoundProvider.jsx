// SoundProvider.jsx
import { createContext, useEffect, useState } from 'react';

export const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
    const [isSoundOn, setIsSoundOn] = useState(() => {
        const saved = localStorage.getItem('soundOn');
        return saved !== null ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('soundOn', JSON.stringify(isSoundOn));
    }, [isSoundOn]);

    const playClickSound = () => {
        if (!isSoundOn) return;
        const clickSound = new Audio('/sound/click.mp3');
        clickSound.volume = 0.4;
        clickSound.play();

    };

    const playScrollSound = () => {
        if (!isSoundOn) return;
        const swoosh = new Audio('/sound/swoosh.mp3');
        swoosh.volume = 0.3;
        swoosh.play();
    }

    const playHoverSound = () => {
        if (!isSoundOn) return;
        const hoverSound = new Audio('/sound/hover.mp3');
        hoverSound.volume = 0.3;
        hoverSound.play();
    };


    return (
        <SoundContext.Provider value={{ isSoundOn, setIsSoundOn, playClickSound, playScrollSound, playHoverSound }}>
            {children}
        </SoundContext.Provider>
    );
};
