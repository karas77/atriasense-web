"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { SplitText } from "@/components/split-text";
import { PixelatedHeading } from "@/components/pixelated-heading";
import { FluidTrail } from "@/components/fluid-trail";
import { useLang } from "@/components/providers/lang-provider";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** kgunes "Selected Works" düzeni: iki büyük ürün kartı. */
export function Products() {
  const { t, lang } = useLang();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Başlık: harfler maskeden kayarak gelir (scrub).
        gsap.fromTo(
          el.querySelectorAll(".products__heading .split__part"),
          { yPercent: 150 },
          {
            yPercent: 0,
            ease: "power3.out",
            stagger: { each: 0.004 },
            scrollTrigger: { trigger: el, start: "top 90%", end: "top 40%", scrub: 0.32 },
          },
        );
        gsap.fromTo(
          el.querySelectorAll(".products__eyebrow, .products__intro"),
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 80%", end: "top 45%", scrub: 0.32 },
          },
        );
        // Kartlar: alttan yükselir; görsel kartın içinde paralaks yapar.
        // GSAP dış li'yi taşır; iç article'ın hover yayı (Motion) ile çakışmaz.
        el.querySelectorAll<HTMLElement>(".products__grid > li").forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 120 + i * 60 },
            {
              y: 0,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "top 35%", scrub: 0.7, invalidateOnRefresh: true },
            },
          );
          const img = card.querySelector(".product-card__image");
          gsap.fromTo(
            img,
            { yPercent: -6, scale: 1.12 },
            {
              yPercent: 6,
              scale: 1.04,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  );

  return (
    <section id="urunler" ref={root} tabIndex={-1} data-theme="dark" className="products" aria-labelledby="products-heading">
      <header className="products__header">
        <p className="eyebrow products__eyebrow">{t.products.eyebrow}</p>
        <h2 id="products-heading" className="products__heading">
          <SplitText text={t.products.heading} />
        </h2>
        <p className="products__intro">{t.products.intro}</p>
      </header>

      <ul className="products__grid">
        {t.products.items.map((p, i) => (
          <li key={p.id}>
            <motion.article
              className="product-card"
              aria-labelledby={`${p.id}-title`}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <div className="product-card__media">
                <picture>
                  <source srcSet={`${p.image}.avif`} type="image/avif" />
                  <img
                    className="product-card__image"
                    src={`${p.image}.webp`}
                    alt={p.alt}
                    width={900}
                    height={1125}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <FluidTrail palette={p.palette} />
                <span className="product-card__index" aria-hidden="true">
                  0{i + 1}
                </span>
              </div>

              <div className="product-card__body">
                <PixelatedHeading id={`${p.id}-title`} text={p.name} className="product-card__title" />
                <p className="product-card__heading">{p.heading}</p>
                <p className="product-card__desc">
                  {p.desc} {p.lead}
                </p>
                <dl className="product-card__meta" aria-label={p.metaLabel}>
                  {p.meta.map((m) => (
                    <div key={m.label}>
                      <dt>{m.label}</dt>
                      <dd>{m.sub}</dd>
                    </div>
                  ))}
                </dl>
                <ul className="product-card__features">
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </motion.article>
          </li>
        ))}
      </ul>
    </section>
  );
}
