"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useIntro } from "@/components/providers/intro-provider";
import { useLang } from "@/components/providers/lang-provider";
import { useLenis } from "@/components/providers/smooth-scroll";
import { Button } from "@/components/ui/button";

/**
 * Açılış: Atria logo animasyonu (4 sn). kgunes'teki imza açılışının mantığı:
 * fontlar + medya hazır olunca logo yukarı kayar (power3.inOut, 0.68 sn),
 * katman 0.22 sn gecikmeyle söner (0.46 sn). Bu sırada kaydırma kilitli.
 */
export function IntroLoader() {
  const { t } = useLang();
  const { done, finish } = useIntro();
  const lenis = useLenis();
  const overlayRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const exitingRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);

  // Kaydırmayı açılış süresince kilitle.
  useEffect(() => {
    if (done) {
      document.documentElement.classList.remove("is-intro");
      lenis?.start();
      return;
    }
    document.documentElement.classList.add("is-intro");
    lenis?.stop();
  }, [done, lenis]);

  const exit = () => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !overlayRef.current || !mediaRef.current) {
      finish();
      setGone(true);
      return;
    }
    gsap
      .timeline({
        onComplete: () => setGone(true),
      })
      .to(mediaRef.current, { yPercent: -38, scale: 0.86, duration: 0.68, ease: "power3.inOut" }, 0)
      .call(finish, [], 0.16)
      .to(overlayRef.current, { opacity: 0, duration: 0.46, ease: "power2.inOut" }, 0.22);
  };

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(() => !cancelled && setReady(true));

    // Hareket azaltma: animasyonu oynatmadan kısa bir duruştan sonra geç.
    if (reduce) {
      const id = window.setTimeout(exit, 500);
      return () => {
        cancelled = true;
        window.clearTimeout(id);
      };
    }
    // Video hiç yüklenmezse kullanıcı beklemesin.
    const safety = window.setTimeout(exit, 7000);
    return () => {
      cancelled = true;
      window.clearTimeout(safety);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div
      ref={overlayRef}
      className="intro-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t.intro.label}
    >
      <div ref={mediaRef} className="intro-media">
        <video
          ref={videoRef}
          className="intro-video"
          autoPlay
          muted
          playsInline
          preload="auto"
          poster="/media/atria-intro-poster.jpg"
          aria-hidden="true"
          onEnded={() => (ready ? exit() : document.fonts?.ready.then(exit))}
          onError={exit}
        >
          <source src="/media/atria-intro.webm" type="video/webm" />
          <source src="/media/atria-intro.mp4" type="video/mp4" />
        </video>
      </div>

      <div className={`intro-status ${ready ? "is-ready" : ""}`} role="status" aria-live="polite">
        <span className="intro-track" aria-hidden="true">
          <span className="intro-sweep" />
        </span>
        <span>{t.intro.preparing}</span>
      </div>

      <Button variant="outline-current" size="pill" className="intro-skip" onClick={exit}>
        {t.intro.skip}
      </Button>
    </div>
  );
}
