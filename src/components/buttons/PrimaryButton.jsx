import { useRef, useContext } from "react";
import { useScramble } from "../../hooks/useScramble";
import { SoundContext } from "../../context/SoundProvider";
import "./button.css";

export default function PrimaryButton({ label = "Button", onClick }) {
  const textRef = useRef();
  const { scramble, stop } = useScramble();
  const { playHoverSound } = useContext(SoundContext);

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

  return (
    <button
      className="group notched-button relative z-40 overflow-hidden"
      onClick={onClick}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <div
        className="absolute inset-0 backdrop-blur-[2px] bg-primary/5"
        style={{
          clipPath:
            "polygon(12px 0, 208px 0, 220px 12px, 220px 58px, 208px 70px, 12px 70px, 0 58px, 0 12px)",
        }}
      />
      <svg
        className="notch-border overflow-visible relative"
        viewBox="0 0 220 70"
        xmlns="http://www.w3.org/2000/svg"
      >

        <polygon
          points="12,0 208,0 220,12 220,58 208,70 12,70 0,58 0,12"
          className="notch-static "
        />
        <polygon
          points="12,0 208,0 220,12 220,58 208,70 12,70 0,58 0,12"
          className="notch-animated"
        />
      </svg>

      <div className="ui-btn ">
        <span ref={textRef} className="uppercase font-bold text-primary glow-text">
          {label}
        </span>
      </div>
    </button>
  );
}
