"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

/**
 * kgunes.com ile aynı kurulum: Lenis (lerp 0.09) GSAP ticker'ına bağlı,
 * ScrollTrigger her Lenis kaydırmasında güncellenir. Hareket azaltma
 * tercihinde Lenis hiç başlatılmaz ve tarayıcının yerel kaydırması kalır.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const tickRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
    instance.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => instance.raf(time * 1000);
    tickRef.current = tick;
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Örneği bir sonraki karede yayınla (efekt içinde senkron setState yok).
    const publish = requestAnimationFrame(() => setLenis(instance));

    return () => {
      cancelAnimationFrame(publish);
      if (tickRef.current) gsap.ticker.remove(tickRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export function useLenis() {
  return useContext(LenisContext);
}
