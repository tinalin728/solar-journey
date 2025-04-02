import { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import PlanetInfoModalContent from "./PlanetInfoModalContent";

export default function PlanetInfoModal({ modalOpenRef, setModalOpen, planet }) {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setModalOpen(showModal);
        modalOpenRef.current = showModal;
    }, [showModal]);

    return (
        <>
            <div className="notched-button overflow-visible mt-10">
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
                <button onClick={() => setShowModal(true)} className="ui-btn">
                    <span>View Now</span>
                </button>
            </div>

            {showModal &&
                createPortal(
                    <PlanetInfoModalContent onClose={() => setShowModal(false)}
                        planetData={planet}
                    />,
                    document.body
                )
            }
        </>
    );
}
