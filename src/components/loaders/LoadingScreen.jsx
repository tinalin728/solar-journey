import React, { useEffect } from "react";

export default function LoadingScreen({ playSound }) {
  // play sound only once when screen mounts
  useEffect(() => {
    if (playSound) {
      playSound();
    }
  }, [playSound]);

  return (
    <div className="fixed inset-0 flex flex-col gap-2 items-center justify-center z-50">
      <div className='progress w-[240px] px-1 h-[30px] rounded-lg border-3 border-primary/30 bg[#1e1e1e]'>
        <div className='track relative w-full h-[30px] overflow-hidden'>
          {Array.from({ length: 19 }).map((_, i) => (
            <div key={i} className='bar'></div>
          ))}
        </div>
      </div>
      <p className='uppercase tracking-widest'>loading...</p>
    </div>
  );
}
