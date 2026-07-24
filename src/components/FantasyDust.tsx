import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useAppSelector } from "../app/hooks";

// Dalla v3 il tweening lungo una curva vive nel MotionPathPlugin, con la
// proprietà "motionPath" (non più "bezier": quella sintassi è di
// TweenLite/GSAP 1-2). Senza registrare il plugin E usare il nome
// corretto, GSAP ignora la proprietà in silenzio: solo opacity/scale
// animano, il puntino resta fermo sul posto.
gsap.registerPlugin(MotionPathPlugin);

// Polvere dorata per il tema fantasy, adattata da "FireFlye Particles"
// di Diaco M. Lotfollahi (https://codepen.io/MAW/pen/gbwzoM): ogni
// puntino si muove lungo una curva di Bezier verso una destinazione
// casuale e, a fine corsa, ne sceglie subito un'altra (loop continuo),
// invece di un pattern CSS a posizione fissa.
const PARTICLE_COUNT = 40;

function randomUpTo(max: number): number {
  return Math.random() * max;
}

function FantasyDust() {
  const brandTheme = useAppSelector((state) => state.theme.brandTheme);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (brandTheme !== "fantasy") return;
    const container = containerRef.current;
    if (!container) return;

    const dots: HTMLDivElement[] = [];
    const tweens: gsap.core.Tween[] = [];

    const animateDot = (dot: HTMLDivElement) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const tween = gsap.to(dot, {
        duration: 10 + randomUpTo(20),
        motionPath: {
          path: [
            { x: randomUpTo(w), y: randomUpTo(h) },
            { x: randomUpTo(w), y: randomUpTo(h) },
          ],
          curviness: 1.5,
        },
        opacity: randomUpTo(1),
        scale: 0.5 + randomUpTo(1),
        delay: randomUpTo(5),
        onComplete: () => animateDot(dot),
      });
      tweens[dots.indexOf(dot)] = tween;
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const dot = document.createElement("div");
      dot.className = "fantasy-firefly-dot";
      gsap.set(dot, {
        x: randomUpTo(window.innerWidth),
        y: randomUpTo(window.innerHeight),
        opacity: 0,
      });
      container.appendChild(dot);
      dots.push(dot);
      animateDot(dot);
    }

    return () => {
      tweens.forEach((tween) => tween?.kill());
      dots.forEach((dot) => dot.remove());
    };
  }, [brandTheme]);

  if (brandTheme !== "fantasy") return null;

  return (
    <div ref={containerRef} className="fantasy-dust-layer" aria-hidden="true" />
  );
}

export default FantasyDust;
