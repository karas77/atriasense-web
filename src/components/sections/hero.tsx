"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SplitText } from "@/components/split-text";
import { useLang } from "@/components/providers/lang-provider";
import { useIntro } from "@/components/providers/intro-provider";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * kgunes hero mekaniği:
 * - Giriş: harfler yPercent 145→0 (power4.out, 0.032 stagger), slogan kelimeleri
 *   yPercent 112→0 (power3.out, 0.06 stagger).
 * - Kaydırma (360svh sabit sahne, scrub): dev wordmark küçülüp yukarı kalkar,
 *   slogan sol ve sağ yarıya ayrılıp kenarlara açılır, harfler aşağı düşer.
 */
export function Hero() {
  const { t, lang } = useLang();
  const { done } = useIntro();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", (ctx) => {
        const chars = el.querySelectorAll(".hero__wordmark .split__part");
        const left = el.querySelector(".hero__slogan-half--left");
        const right = el.querySelector(".hero__slogan-half--right");
        const sloganWords = el.querySelectorAll(".hero__slogan .split__part");
        const star = el.querySelector(".hero__star");
        const lines = el.querySelectorAll(".hero__line .split__part");
        const emblem = el.querySelector(".hero__emblem");
        const hint = el.querySelector(".hero__hint");

        // Giriş: açılış bitmeden gizli dur.
        gsap.set(chars, { yPercent: 170 });
        gsap.set(sloganWords, { yPercent: 150 });
        gsap.set(lines, { yPercent: 150 });
        gsap.set([star, hint], { autoAlpha: 0 });
        gsap.set(emblem, { autoAlpha: 0, scale: 0.92 });
        if (!done) return;

        gsap
          .timeline({ defaults: { overwrite: "auto" } })
          .to(emblem, { autoAlpha: 1, scale: 1, duration: 1.4, ease: "power2.out" }, 0)
          .to(chars, { yPercent: 0, duration: 0.94, ease: "power4.out", stagger: 0.032 }, 0.12)
          .to(star, { autoAlpha: 1, rotate: 180, duration: 0.82, ease: "power3.out" }, 0.6)
          .to(sloganWords, { yPercent: 0, duration: 0.82, ease: "power3.out", stagger: 0.06 }, 0.8)
          .to(lines, { yPercent: 0, duration: 0.82, ease: "power3.out", stagger: 0.06 }, 1.0)
          .to(hint, { autoAlpha: 1, duration: 0.46, ease: "power2.out" }, 1.4)
          .add(() => {
            // Kaydırma koreografisi girişten sonra devreye girer. ctx.add ile
            // bağlama eklenir (temizlikte geri alınır). Her adım fromTo ile
            // açık başlangıç değeri taşır: yukarı kaydırınca sahne her zaman
            // giriş bitmiş haline geri sarılır, ara durumda takılı kalmaz.
            ctx.add(() => {
              const wordmark = el.querySelector(".hero__wordmark");
              const d = { immediateRender: false };
              gsap
                .timeline({
                  scrollTrigger: {
                    trigger: el,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true,
                    invalidateOnRefresh: true,
                  },
                })
                .fromTo(wordmark, { scale: 1, yPercent: 0 }, { ...d, scale: 0.42, yPercent: -62, ease: "none", duration: 0.5 }, 0)
                .fromTo(chars, { yPercent: 0 }, { ...d, yPercent: -170, ease: "power3.in", duration: 0.32, stagger: { each: 0.004, from: "center" } }, 0.34)
                .fromTo(left, { xPercent: 0 }, { ...d, xPercent: -70, ease: "power2.inOut", duration: 0.5 }, 0.12)
                .fromTo(right, { xPercent: 0 }, { ...d, xPercent: 70, ease: "power2.inOut", duration: 0.5 }, 0.12)
                .fromTo(star, { rotate: 180, scale: 1, autoAlpha: 1 }, { ...d, rotate: 540, scale: 2.4, autoAlpha: 0, ease: "power2.in", duration: 0.46 }, 0.16)
                .fromTo(sloganWords, { yPercent: 0 }, { ...d, yPercent: 170, ease: "power3.in", duration: 0.26, stagger: 0.03 }, 0.48)
                .fromTo(lines, { yPercent: 0 }, { ...d, yPercent: -160, ease: "power3.in", duration: 0.24, stagger: 0.03 }, 0.2)
                .fromTo(hint, { autoAlpha: 1 }, { ...d, autoAlpha: 0, duration: 0.1 }, 0)
                .fromTo(emblem, { scale: 1, autoAlpha: 1 }, { ...d, scale: 1.9, autoAlpha: 0, ease: "power1.in", duration: 0.8 }, 0.2);
            });
          });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el.querySelectorAll(".split__part"), { clearProps: "all" });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [done, lang], revertOnUpdate: true },
  );

  return (
    <section
      id="top"
      ref={root}
      tabIndex={-1}
      data-theme="dark"
      aria-label={t.hero.label}
      className="hero"
    >
      <div className="hero__stage">
        <picture className="hero__emblem">
          <source srcSet="/img/emblem.avif" type="image/avif" />
          <img src="/img/emblem.webp" alt="" width={800} height={800} />
        </picture>

        <h1 className="hero__title">
          <SplitText text={t.hero.wordmark} className="hero__wordmark" />
          <span className="hero__slogan" lang="en">
            <span className="hero__slogan-half hero__slogan-half--left">
              <SplitText text={t.hero.sloganLeft} by="words" />
            </span>
            <svg className="hero__star" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z" />
            </svg>
            <span className="hero__slogan-half hero__slogan-half--right">
              <SplitText text={t.hero.sloganRight} by="words" />
            </span>
          </span>
        </h1>

        <p className="hero__lines">
          <SplitText text={t.hero.lineOne} by="words" className="hero__line" />
          <SplitText text={t.hero.lineTwo} by="words" className="hero__line hero__line--dim" />
        </p>

        <p className="hero__hint" aria-hidden="true">
          <span className="hero__hint-dot" />
          {t.hero.scrollHint}
        </p>
      </div>
    </section>
  );
}
