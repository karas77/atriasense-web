"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * kgunes "pixelated-heading": başlık önce iri piksellerle görünür, kaydırdıkça
 * netleşir (scrub 0.38). Gerçek metin DOM'da kalır; canvas yalnız görsel
 * katmandır (aria-hidden). Satır kırılmaları için her kelimenin gerçek
 * konumu Range ile ölçülüp canvas'a aynı yere çizilir.
 */
export function PixelatedHeading({
  text,
  as: Tag = "h3",
  className,
  id,
}: {
  text: string;
  as?: "h2" | "h3";
  className?: string;
  id?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const host = wrap.current;
      if (!host) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const heading = host.querySelector<HTMLElement>(".pixelated__text")!;
        const canvas = host.querySelector<HTMLCanvasElement>(".pixelated__canvas")!;
        const ctx = canvas.getContext("2d");
        const buffer = document.createElement("canvas");
        const bctx = buffer.getContext("2d");
        if (!ctx || !bctx) return;

        const state = { pixel: 26 };
        let words: { text: string; x: number; y: number; h: number }[] = [];
        let font = "";
        let color = "#000";
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const measure = () => {
          const rect = host.getBoundingClientRect();
          canvas.width = Math.ceil(rect.width * dpr);
          canvas.height = Math.ceil(rect.height * dpr);
          const cs = getComputedStyle(heading);
          font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
          color = cs.color;
          words = [];
          const node = heading.firstChild;
          if (!node || node.nodeType !== Node.TEXT_NODE) return;
          const range = document.createRange();
          const raw = node.textContent ?? "";
          let i = 0;
          for (const w of raw.split(" ")) {
            if (w) {
              range.setStart(node, i);
              range.setEnd(node, i + w.length);
              const r = range.getClientRects()[0];
              if (r) words.push({ text: w, x: r.left - rect.left, y: r.top - rect.top, h: r.height });
            }
            i += w.length + 1;
          }
        };

        const draw = () => {
          const p = Math.max(1, state.pixel);
          const w = canvas.width;
          const h = canvas.height;
          const sw = Math.max(1, Math.round(w / (p * dpr)));
          const sh = Math.max(1, Math.round(h / (p * dpr)));
          buffer.width = sw;
          buffer.height = sh;
          bctx.clearRect(0, 0, sw, sh);
          bctx.save();
          bctx.scale(sw / (w / dpr), sh / (h / dpr));
          bctx.font = font;
          bctx.fillStyle = color;
          bctx.textBaseline = "middle";
          for (const word of words) bctx.fillText(word.text, word.x, word.y + word.h / 2);
          bctx.restore();
          ctx.clearRect(0, 0, w, h);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(buffer, 0, 0, w, h);
          host.classList.toggle("is-sharp", p <= 1.05);
        };

        measure();
        draw();
        host.classList.add("is-pixelated");

        // Kaydırmaya bağlı (scrub) değil, zamana bağlı: başlık görünür olunca
        // kendiliğinden netleşir. Scrub'da üst kapsayıcının (kart) kayması bitiş
        // noktasını kaydırıp başlığı pikselli bırakabiliyordu.
        const tween = gsap.to(state, {
          pixel: 1,
          duration: 1.1,
          ease: "power2.out",
          paused: true,
          onUpdate: draw,
          onComplete: draw,
          onReverseComplete: draw,
        });
        const trigger = ScrollTrigger.create({
          trigger: host,
          start: "top 92%",
          onEnter: () => tween.play(),
          onLeaveBack: () => tween.reverse(),
          onRefresh: (self) => {
            measure();
            // Sayfa yenilendiğinde başlık zaten geçilmişse doğrudan net göster.
            if (self.progress > 0 || self.scroll() > self.start) tween.progress(1);
            draw();
          },
        });

        document.fonts?.ready.then(() => {
          measure();
          draw();
        });

        return () => {
          tween.kill();
          trigger.kill();
          host.classList.remove("is-pixelated", "is-sharp");
        };
      });
      return () => mm.revert();
    },
    { scope: wrap, dependencies: [text], revertOnUpdate: true },
  );

  return (
    <div ref={wrap} className={cn("pixelated", className)}>
      <Tag id={id} className="pixelated__text">
        {text}
      </Tag>
      <canvas className="pixelated__canvas" aria-hidden="true" />
    </div>
  );
}
