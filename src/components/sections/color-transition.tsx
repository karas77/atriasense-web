"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLang } from "@/components/providers/lang-provider";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * kgunes "works-to-services": 173svh bölüm, 100svh yapışkan sahne. Üst kenarı
 * yumuşak gradient'li bej "kağıt" katmanı yPercent 65 → -40 kaydırmayla
 * yükselir. Başlık bej renkte ve mix-blend-mode: difference; kağıt arkasına
 * geldikçe yazı kendiliğinden koyuya döner. Böylece lacivert → bej geçişi.
 */
export function ColorTransition() {
  const { t, lang } = useLang();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const paper = el.querySelector<HTMLElement>(".color-transition__paper")!;
        const heading = el.querySelector<HTMLElement>(".color-transition__heading")!;

        // Başlık rengi kağıdın konumunu izler: kağıdın saydamlığı a olan yerde
        // yazı ivory→navy karışımı (a) olur. kgunes'teki difference etkisinin
        // lacivert zeminde doğru renkleri veren karşılığı.
        const syncText = () => {
          const pr = paper.getBoundingClientRect();
          const hr = heading.getBoundingClientRect();
          heading.style.setProperty("--paper-top", `${pr.top - hr.top}px`);
          heading.style.setProperty("--paper-h", `${pr.height}px`);
          // Kağıdın yarı saydam olduğu nokta (üstten %22, saydamlık 0.5) menü
          // bandına ulaşınca menü açık temaya geçer; zemin artık açık görünür.
          const midTop = pr.top + pr.height * 0.22;
          el.dataset.theme = midTop <= 80 ? "light" : "dark";
        };
        gsap.fromTo(
          heading,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 90%", end: "top 50%", scrub: true, invalidateOnRefresh: true },
          },
        );
        gsap.fromTo(
          paper,
          // y: 0 şart: CSS'teki translateY(65%) GSAP'a piksel "y" olarak okunur
          // ve yPercent'in üstüne eklenir (kgunes kodunda da y: 0 var).
          { y: 0, yPercent: 65 },
          {
            y: 0,
            yPercent: -40,
            ease: "none",
            onUpdate: syncText,
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
              onRefresh: syncText,
            },
          },
        );
        syncText();
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  );

  // Boyut değişince ScrollTrigger konumlarını yenile (kgunes'teki ResizeObserver).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={root} data-theme="dark" className="color-transition" aria-labelledby="transition-heading">
      <div className="color-transition__stage">
        <div className="color-transition__paper" aria-hidden="true" />
        <h2 id="transition-heading" className="color-transition__heading">
          <span>{t.transition.lineOne}</span>
          <span>{t.transition.lineTwo}</span>
        </h2>
      </div>
    </section>
  );
}
