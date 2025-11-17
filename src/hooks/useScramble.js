import { useRef } from "react";

export function useScramble() {
  const rafRef = useRef();

  const scramble = (el, to) => {
    if (!el) return;

    // global speed settings here
    const duration = 800; // one place to control scramble speed
    const fps = 30;       // one place to control frame rate
    const frameMs = 1000 / fps;

    const from = el.innerText;
    const maxLen = Math.max(from.length, to.length);
    const toPadded = to.padEnd(maxLen, " ");
    const fromPadded = from.padEnd(maxLen, " ");

    const glyphs = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const keepChar = c => c === " " || c === "," || c === ":";

    const steps = Math.max(1, Math.floor(duration / frameMs));

    // control per character smoothness here
    const exponent = 1.6; // increase for slower smoother reveal
    
    // FIXED: Ensure minimum scramble frames (at least 3 frames of scrambling)
    const minScrambleFrames = 3;
    const reveals = Array.from({ length: maxLen }, () => {
      const randomReveal = Math.floor(Math.pow(Math.random(), exponent) * steps);
      return Math.max(minScrambleFrames, randomReveal);
    });

    let frame = 0;

    const tick = () => {
      frame++;

      let out = "";
      for (let i = 0; i < maxLen; i++) {
        if (frame >= reveals[i]) {
          out += toPadded[i];
        } else if (keepChar(toPadded[i])) {
          out += toPadded[i];
        } else {
          out += glyphs[Math.floor(Math.random() * glyphs.length)];
        }
      }

      el.innerText = out.trimEnd();

      if (frame < steps) {
        rafRef.current = setTimeout(tick, frameMs);
      } else {
        el.innerText = to.trimEnd();
      }
    };

    tick();
  };

  const stop = () => {
    if (rafRef.current) clearTimeout(rafRef.current);
  };

  return { scramble, stop };
}