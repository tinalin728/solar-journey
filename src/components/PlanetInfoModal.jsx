import { useState, useEffect, useContext } from "react";
import { createPortal } from 'react-dom';
import PlanetInfoModalContent from "./PlanetInfoModalContent";
import { SoundContext } from './SoundProvider';


export default function PlanetInfoModal({ modalOpenRef, setModalOpen, planet }) {
    const [showModal, setShowModal] = useState(false);
    const { playClickSound, playHoverSound } = useContext(SoundContext)


    useEffect(() => {
        setModalOpen(showModal);
        modalOpenRef.current = showModal;
    }, [showModal]);

    const handleClick = () => {
        playClickSound();
    };

    return (
        <>
            <button onMouseEnter={playHoverSound}
                onClick={() => { setShowModal(true); handleClick(); }} className="group notched-button overflow-visible cursor-pointer relative z-40">
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
                    <span className='uppercase font-bold text-primary '>View Now</span>
                </div>
            </button >


            {showModal &&
                createPortal(
                    <PlanetInfoModalContent
                        onClose={() => setShowModal(false)}
                        planetData={planet}
                    />,
                    document.body
                )
            }
        </>
    );
}
