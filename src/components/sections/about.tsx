"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PixelatedHeading } from "@/components/pixelated-heading";
import { useLang } from "@/components/providers/lang-provider";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** kgunes "selected-intro" sayfası: pikselli büyük başlık + kaydırdıkça beliren metin. */
export function About() {
  const { t, lang } = useLang();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Alıntı: kelimeler sırayla soluktan tam renge (okuma hızında scrub).
        gsap.fromTo(
          el.querySelectorAll(".about__quote-word"),
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.06,
            scrollTrigger: { trigger: ".about__quote", start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
        el.querySelectorAll<HTMLElement>(".about__body p").forEach((p) => {
          gsap.fromTo(
            p,
            { y: 32, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              ease: "power2.out",
              scrollTrigger: { trigger: p, start: "top 90%", end: "top 62%", scrub: 0.4 },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  );

  return (
    <section id="hakkimizda" ref={root} tabIndex={-1} data-theme="dark" className="about" aria-labelledby="about-heading">
      <div className="about__masthead">
        <p className="eyebrow">{t.about.eyebrow}</p>
        <span className="about__mark" aria-hidden="true">
          AtriaSense
        </span>
      </div>

      <div className="about__heading-wrap">
        <PixelatedHeading as="h2" id="about-heading" text={t.about.heading} className="about__heading" />
      </div>

      <div className="about__grid">
        <blockquote className="about__quote">
          <p>
            {t.about.quote.split(" ").map((w, i) => (
              <span key={`${w}-${i}`} className="about__quote-word">
                {w}{" "}
              </span>
            ))}
          </p>
          <footer className="about__quote-cite">
            <cite>{t.about.quoteCite}</cite>
          </footer>
        </blockquote>
        <div className="about__body">
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
          <p>{t.about.p3}</p>
        </div>
      </div>
    </section>
  );
}
