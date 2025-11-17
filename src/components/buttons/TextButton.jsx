import { useRef, useContext } from "react";
import { useScramble } from "../../hooks/useScramble";
import { SoundContext } from "../../context/SoundProvider";

export default function TextButton({ onClick, label = "Text Button" }) {
  const textRef = useRef();
  const { scramble, stop } = useScramble();
  const { playHoverSound, playClickSound } = useContext(SoundContext);

  const handleHover = () => {
    playHoverSound(); // sound
    scramble(textRef.current, label); // scramble
  };

  const handleLeave = () => {
    stop();
    if (textRef.current) {
      textRef.current.innerText = label;
    }
  };

  const handleClick = () => {
    playClickSound(); // Now it's defined
    if (onClick) onClick(); // Call the passed onClick prop
  };

  return (
    <button
      className="relative px-3 py-1 
             before:content-['['] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2
             after:content-[']'] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2"
      onClick={handleClick}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <span
        ref={textRef}
        className="!text-sm text-primary tracking-widest uppercase glow-text"
      >
        {label}
      </span>
    </button>
  );
}
