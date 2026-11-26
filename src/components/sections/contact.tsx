"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Check, Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLang } from "@/components/providers/lang-provider";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// atriasense.com'daki mevcut bekleme listesi uç noktası ve ürün kodları.
const WAITLIST_URL = "https://atriasense.com/api/waitlist";
const PRODUCT_CODES = { atrialens: "1", wristband: "2" } as const;

type Status = "idle" | "sending" | "sent" | "error";

/** İletişim: bekleme listesi formu, SSS ve altbilgi (bej zemin). */
export function Contact() {
  const { t, lang } = useLang();
  const root = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [product, setProduct] = useState<string | null>(null);
  const [productError, setProductError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const f = t.contact.form;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          el.querySelectorAll(".contact__reveal"),
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: { trigger: ".contact__grid", start: "top 85%", end: "top 50%", scrub: 0.4 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!product) {
      setProductError(true);
      form.querySelector<HTMLElement>("[data-slot=select-trigger]")?.focus();
      return;
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch(WAITLIST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          fullname: data.get("fullname"),
          email: data.get("email"),
          product: Number(PRODUCT_CODES[product as keyof typeof PRODUCT_CODES]),
          note: data.get("note"),
        }),
      });
      if (!res.ok) throw new Error("waitlist failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    formRef.current?.reset();
    setProduct(null);
    setStatus("idle");
  };

  return (
    <section id="iletisim" ref={root} tabIndex={-1} data-theme="light" className="contact" aria-labelledby="contact-heading">
      <div className="contact__grid">
        <div className="contact__intro">
          <p className="eyebrow contact__reveal">{t.contact.eyebrow}</p>
          <h2 id="contact-heading" className="contact__heading contact__reveal">
            {t.contact.heading}
          </h2>
          <p className="contact__lead contact__reveal">{t.contact.lead}</p>
          <p className="contact__note contact__reveal">{t.contact.note}</p>

          <div className="contact__faq contact__reveal">
            <h3 className="contact__faq-heading">{t.contact.faqHeading}</h3>
            <Accordion className="faq">
              {t.contact.faq.map(([q, a], i) => (
                <AccordionItem key={q} value={`faq-${i}`} className="faq__item">
                  <AccordionTrigger className="faq__trigger">{q}</AccordionTrigger>
                  <AccordionContent className="faq__content">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="contact__card contact__reveal">
          <AnimatePresence mode="wait" initial={false}>
            {status === "sent" ? (
              <motion.div
                key="sent"
                className="contact__success"
                role="status"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <span className="contact__success-icon" aria-hidden="true">
                  <Check size={22} />
                </span>
                <h3>{f.successTitle}</h3>
                <p>{f.successText}</p>
                <Button type="button" variant="outline" size="pill" onClick={reset} className="border-[var(--input)] text-[var(--navy)]">
                  {f.reset}
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={formRef}
                noValidate
                onSubmit={onSubmit}
                className="contact__form"
                aria-labelledby="form-title"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <h3 id="form-title" className="contact__form-title">
                  {f.title}
                </h3>

                <div className="field">
                  <Label htmlFor="fullname">{f.name}</Label>
                  <Input id="fullname" name="fullname" autoComplete="name" required minLength={2} />
                </div>

                <div className="field">
                  <Label htmlFor="email">{f.email}</Label>
                  <Input id="email" name="email" type="email" autoComplete="email" inputMode="email" required />
                </div>

                <div className="field">
                  <Label htmlFor="product" id="product-label">
                    {f.product}
                  </Label>
                  <Select
                    value={product}
                    onValueChange={(v) => {
                      setProduct(v as string);
                      setProductError(false);
                    }}
                  >
                    <SelectTrigger
                      id="product"
                      aria-labelledby="product-label"
                      aria-invalid={productError || undefined}
                      aria-describedby={productError ? "product-error" : undefined}
                      className="w-full"
                    >
                      <SelectValue placeholder={f.productPlaceholder}>
                        {(value: string | null) =>
                          t.products.items.find((p) => p.id === value)?.name ?? f.productPlaceholder
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {t.products.items.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {productError && (
                    <p id="product-error" className="field__error" role="alert">
                      {f.productError}
                    </p>
                  )}
                </div>

                <div className="field">
                  <Label htmlFor="note">
                    {f.note} <span className="field__optional">{f.optional}</span>
                  </Label>
                  <Textarea id="note" name="note" rows={4} placeholder={f.placeholder} />
                </div>

                {status === "error" && (
                  <p className="field__error" role="alert">
                    {f.error}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="navy"
                  size="pill-lg"
                  disabled={status === "sending"}
                  aria-busy={status === "sending"}
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="btn__spin" size={18} aria-hidden="true" /> {f.sending}
                    </>
                  ) : (
                    <>
                      {f.submit} <ArrowRight size={18} aria-hidden="true" />
                    </>
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      <footer className="site-footer">
        <p className="site-footer__tagline" aria-hidden="true">
          AtriaSense
        </p>
        <dl className="site-footer__meta">
          <div>
            <dt>{t.contact.locationLabel}</dt>
            <dd>
              <MapPin size={16} aria-hidden="true" /> {t.contact.location}
            </dd>
          </div>
          <div>
            <dt>{t.contact.socialLabel}</dt>
            <dd>
              <a
                className="site-footer__social"
                href="https://www.linkedin.com/company/atriasense/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" fill="currentColor">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
                </svg>
                {t.contact.socialNote}
                <span className="sr-only"> ({lang === "tr" ? "yeni sekmede açılır" : "opens in a new tab"})</span>
              </a>
            </dd>
          </div>
        </dl>
        <div className="site-footer__base">
          <span>{t.contact.rights}</span>
          <span>{t.contact.tagline}</span>
        </div>
      </footer>
    </section>
  );
}
