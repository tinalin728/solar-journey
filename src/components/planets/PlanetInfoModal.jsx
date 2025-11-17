import { useState, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import PlanetInfoModalContent from "./PlanetInfoModalContent";
import { SoundContext } from "../../context/SoundProvider";
import PrimaryButton from "../buttons/PrimaryButton";

export default function PlanetInfoModal({
  modalOpenRef,
  setModalOpen,
  planet,
}) {
  const [showModal, setShowModal] = useState(false);
  const { playClickSound, playHoverSound } = useContext(SoundContext);

  useEffect(() => {
    setModalOpen(showModal);
    modalOpenRef.current = showModal;
  }, [showModal]);

  const handleClick = () => {
    playClickSound();
  };

  return (
    <>
      <PrimaryButton
        label="View Now"
        onClick={() => {
          setShowModal(true);
          handleClick();
        }}
      />

      {showModal &&
        createPortal(
          <PlanetInfoModalContent
            onClose={() => setShowModal(false)}
            planetData={planet}
          />,
          document.body
        )}
    </>
  );
}
