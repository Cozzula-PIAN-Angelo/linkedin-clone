import React, { useEffect, useState } from "react";
import "./MuzzleFlash.css";

interface Spark {
  id: number;
  x: number;
  y: number;
}

export const MuzzleFlash: React.FC = () => {
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Controlla se siamo nel tema horror
      const isHorror =
        document.documentElement.getAttribute("data-brand-theme") ===
          "horror" ||
        document.body.getAttribute("data-brand-theme") === "horror";
      if (!isHorror) return;

      // 🔊 RIPRODUZIONE SUONO SPARO
      const shotAudio = new Audio("/sounds/gunshot.wav");
      shotAudio.volume = 0.3; // Regola il volume (0.0 - 1.0)
      shotAudio.play().catch(() => {}); // catch evita errori di autoplay browser

      const newSpark = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };

      setSparks((prev) => [...prev, newSpark]);

      // Rimuove l'animazione dello sparo dopo 300ms
      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => s.id !== newSpark.id));
      }, 300);
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="muzzle-flash-container">
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="shot-effect"
          style={{ left: spark.x, top: spark.y }}
        >
          {/* Cerchio di fuoco / lampo centralizzato */}
          <div className="flash-core" />
          {/* Onde di rinculo e scintille */}
          <div className="spark-line spark-1" />
          <div className="spark-line spark-2" />
          <div className="spark-line spark-3" />
          <div className="spark-line spark-4" />
        </div>
      ))}
    </div>
  );
};
