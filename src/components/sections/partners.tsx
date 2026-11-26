"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLang } from "@/components/providers/lang-provider";
import type { Partner } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Kurumlar: logolar sonsuz döngüde yatay kayar (CSS animasyonu). Üstüne gelince
 * ya da klavyeyle odaklanınca durur; hareket azaltma tercihinde sabit kalır.
 * Logoya tıklayınca rapordaki bilgi bir panelde açılır.
 */
export function Partners() {
  const { t, lang } = useLang();
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<Partner | null>(null);
  const items = t.partners.items;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          el.querySelectorAll(".partners__eyebrow, .partners__marquee, .partners__hint"),
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none reverse" },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  );

  // Sonsuz kayma için liste iki kez çizilir; ikinci kopya ekran okuyucudan ve
  // sekme sırasından gizlenir.
  const renderTrack = (copy: boolean) => (
    <ul className="partners__track" aria-hidden={copy || undefined}>
      {items.map((p) => (
        <li key={p.id} className="partner-slide">
          <button
            type="button"
            className={p.width === p.height ? "partner-slide__btn partner-slide__btn--square" : "partner-slide__btn"}
            onClick={() => setActive(p)}
            tabIndex={copy ? -1 : undefined}
            aria-haspopup="dialog"
          >
            <img src={p.logo} alt={copy ? "" : p.name} width={p.width} height={p.height} loading="lazy" decoding="async" />
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <section ref={root} data-theme="dark" className="partners" aria-labelledby="partners-heading">
      <h2 id="partners-heading" className="eyebrow partners__eyebrow">
        {t.partners.eyebrow}
      </h2>

      <div className="partners__marquee">
        {/* Cam kartların arkasında bulanıklığı görünür kılan ışıklar. */}
        <span className="partners__glow partners__glow--lime" aria-hidden="true" />
        <span className="partners__glow partners__glow--blue" aria-hidden="true" />
        <div className="partners__rail">
          {renderTrack(false)}
          {renderTrack(true)}
        </div>
      </div>
      <p className="partners__hint">{t.partners.hint}</p>

      <Dialog open={active !== null} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent showCloseButton={false} className="partner-dialog">
          {active && (
            <>
              <div className="partner-dialog__logo">
                <img src={active.logo} alt="" width={active.width} height={active.height} />
              </div>
              <p className="partner-dialog__badge">{active.badge}</p>
              <DialogTitle className="partner-dialog__title">{active.title}</DialogTitle>
              <DialogDescription className="partner-dialog__text">{active.text}</DialogDescription>
              <DialogClose
                render={<Button variant="navy" size="icon-pill" className="partner-dialog__close" />}
                aria-label={t.partners.close}
              >
                <X size={18} aria-hidden="true" />
              </DialogClose>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
