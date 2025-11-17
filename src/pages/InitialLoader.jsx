import { useNavigate } from "react-router-dom";
import { useContext, useRef, useEffect } from "react";
import { SoundContext } from "../context/SoundProvider";
import PrimaryButton from "../components/buttons/PrimaryButton";

import gsap from "gsap";

export default function InitialLoader() {
  const navigate = useNavigate();
  const loaderRef = useRef(null);
  const { setIsSoundOn, playClickSound } = useContext(SoundContext);

  useEffect(() => {
    setTimeout(() => {
      gsap.fromTo(
        loaderRef.current,
        { opacity: 0, y:50 },
        { opacity: 1, y:0, duration: 1, ease: "sine.out" }
      );
    }, 500);
  },[])

  const handleStart = (soundState) => {
    setIsSoundOn(soundState);
    if (soundState) playClickSound();
    sessionStorage.setItem("initialSeen", "true");

    setTimeout(() => {
      navigate("/");
    }, 300);
  };


  return (
    <div 
    ref={loaderRef}
    className="relative z-10 h-screen flex items-center justify-center opacity-0">
      <div className="w-[92vw] md:w-auto">
        <div className="relative h-8 w-full bg-primary/40 border-t border-x rounded-t-lg  backdrop-blur-[2px] ">
          <div className=" absolute top-1/2 left-4 -translate-y-1/2 flex gap-2">
            <span className="h-3 w-3 bg-primary/50 rounded-full"></span>
            <span className="h-3 w-3 bg-primary/50 rounded-full"></span>
            <span className="h-3 w-3 bg-primary/50 rounded-full"></span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-10 md:p-20 border-x border-b bg-primary/10 backdrop-blur-[2px] rounded-b-lg text-center">
          <h3 className="text-white typing-dots">System Logging in</h3>

          <div className="flex flex-col gap-4 mt-10 md:flex-row">
            <PrimaryButton label="Sound On" onClick={() => handleStart(true)} />
            <PrimaryButton
              label="Sound Off"
              onClick={() => handleStart(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
