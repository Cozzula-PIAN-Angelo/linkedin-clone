import React, { useEffect, useRef, useState } from "react";
import "./HorrorEffects.css";
import { MuzzleFlash } from "./MuzzleFlash";

export const HorrorEffects: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lightning, setLightning] = useState(false);

  // 🔊 1. Gestione Suono Pioggia Continua (Loop)
  useEffect(() => {
    const rainAudio = new Audio("/sounds/rain.wav");
    rainAudio.loop = true;
    rainAudio.volume = 0.25;

    rainAudio.play().catch(() => {
      // Evita errori di autoplay del browser se l'utente non ha ancora interagito
    });

    return () => {
      rainAudio.pause();
      rainAudio.currentTime = 0;
    };
  }, []);

  // 🔊 2. Gestione Flash del Tuono + Suono Tuono Sincronizzato
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const triggerLightning = () => {
      // Effetto visivo lampo
      setLightning(true);

      // Suono del tuono
      const thunderAudio = new Audio("/sounds/thunder.wav");
      thunderAudio.volume = 0.5;
      thunderAudio.play().catch(() => {});

      setTimeout(() => setLightning(false), 120);

      // Prossimo tuono tra 6 e 15 secondi
      const nextDelay = Math.random() * 9000 + 6000;
      timeoutId = setTimeout(triggerLightning, nextDelay);
    };

    timeoutId = setTimeout(triggerLightning, 4000);

    return () => clearTimeout(timeoutId);
  }, []);

  // 🔊 3. Gestione Suono Tastiera/Digitazione sui Campi di Testo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isHorror =
        document.documentElement.getAttribute("data-brand-theme") ===
          "horror" ||
        document.body.getAttribute("data-brand-theme") === "horror";
      if (!isHorror) return;

      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isInput) {
        const typeAudio = new Audio("/sounds/typing.wav");
        typeAudio.volume = 0.3;
        typeAudio.play().catch(() => {});
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 🌧️ 4. Animazione Canvas Pioggia Rossa
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const drops = Array.from({ length: 180 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 25 + 10,
      speed: Math.random() * 15 + 9,
      opacity: Math.random() * 0.45 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.strokeStyle = `rgba(220, 53, 69, ${d.opacity})`;
        ctx.lineWidth = 1.3;

        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;
        d.x -= 0.3;

        if (d.y > height) {
          d.y = -20;
          d.x = Math.random() * width;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={`horror-effects-overlay ${lightning ? "flash-active" : ""}`}
    >
      {/* Canvas Pioggia */}
      <canvas ref={canvasRef} className="horror-rain-canvas" />

      {/* Vignettatura con sfumatura d'ombra */}
      <div className="horror-vignette" />

      {/* Sangue sulla Navbar */}
      <div className="horror-blood-banner" />

      {/* Badge Biohazard in Basso a Sinistra */}
      <div className="horror-warning-badge">
        <span className="biohazard-icon">☣</span> UMBRELLA CORP — LEVEL 4
        CONTAINMENT
      </div>

      {/* Componente Sparo/Scintilla sui Click */}
      <MuzzleFlash />
    </div>
  );
};

export default HorrorEffects;
