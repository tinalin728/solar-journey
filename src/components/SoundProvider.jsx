// SoundProvider.jsx
import { createContext, useEffect, useState, useRef } from 'react';

export const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
    const bgMusicRef = useRef(null);

    const [isSoundOn, setIsSoundOn] = useState(() => {
        const saved = localStorage.getItem('soundOn');
        return saved !== null ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('soundOn', JSON.stringify(isSoundOn));

        if (bgMusicRef.current) {
            if (isSoundOn) {
                bgMusicRef.current.volume = 0.1;

                bgMusicRef.current.play().catch(e => {
                    console.warn('Autoplay failed:', e);
                });
            } else {
                bgMusicRef.current.pause();
            }
        }
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

    const playLoadingSound = () => {
        if (!isSoundOn) return;
        const loading = new Audio('/sound/loading.mp3');
        loading.volume = 0.3;
        loading.playbackRate = 1.2; // optional speed tweak
        loading.play();
    };

    return (
        <SoundContext.Provider value={{ isSoundOn, setIsSoundOn, playClickSound, playScrollSound, playHoverSound, playLoadingSound }}>
            <audio
                ref={bgMusicRef}
                src="/sound/bgmusic.mp3"
                loop
            />
            {children}
        </SoundContext.Provider>
    );
};
