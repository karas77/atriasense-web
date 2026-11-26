"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/components/providers/lang-provider";
import { useLenis } from "@/components/providers/smooth-scroll";
import { useIntro } from "@/components/providers/intro-provider";
import { runCheckerTransition } from "@/lib/checker-transition";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

const NAV = [
  { id: "urunler", key: "products" },
  { id: "hakkimizda", key: "about" },
  { id: "iletisim", key: "contact" },
] as const;

export function SiteHeader() {
  const { t, toggle } = useLang();
  const lenis = useLenis();
  const { done } = useIntro();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const busy = useRef(false);

  // Başlığın altındaki bölümün temasını izle (koyu lacivert / açık bej).
  useEffect(() => {
    const probe = () => {
      const el = document.elementsFromPoint(window.innerWidth / 2, 36).find((n) =>
        (n as HTMLElement).closest?.("[data-theme]"),
      ) as HTMLElement | undefined;
      const host = el?.closest("[data-theme]") as HTMLElement | null;
      const next = (host?.dataset.theme as "dark" | "light") ?? "dark";
      setTheme((prev) => (prev === next ? prev : next));
      const past = window.scrollY > 40;
      setScrolled((prev) => (prev === past ? prev : past));
    };
    probe();
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: probe });
    window.addEventListener("resize", probe);
    return () => {
      st.kill();
      window.removeEventListener("resize", probe);
    };
  }, []);

  const go = (id: string, event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setOpen(false);
    const target = document.getElementById(id);
    if (!target || busy.current) return;
    busy.current = true;
    const rect = event.currentTarget.getBoundingClientRect();
    runCheckerTransition({
      origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
      color: "#062045",
      onCovered: () => {
        if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
        else target.scrollIntoView({ behavior: "instant" as ScrollBehavior });
        ScrollTrigger.update();
        history.replaceState(null, "", `#${id}`);
      },
      onComplete: () => {
        busy.current = false;
        target.focus({ preventScroll: true });
      },
    });
  };

  return (
    <header
      className={cn(
        "site-header",
        theme === "light" && "is-light",
        scrolled && "is-scrolled",
        done && "is-visible",
      )}
      data-open={open || undefined}
    >
      <a href="#top" className="site-header__brand" aria-label={t.nav.home} onClick={(e) => go("top", e)}>
        <img src="/img/emblem-96.webp" alt="" width={40} height={40} className="site-header__emblem" />
        <span className="site-header__wordmark">AtriaSense</span>
      </a>

      <nav aria-label={t.nav.label} className="site-header__nav">
        <ul>
          {NAV.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} onClick={(e) => go(item.id, e)} className="site-header__link">
                {t.nav[item.key]}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="site-header__actions">
        <Button
          variant="outline-current"
          size="icon-pill"
          onClick={toggle}
          className="site-header__lang"
          aria-label={t.nav.langSwitch}
        >
          {t.nav.langShort}
        </Button>
        <a
          href="#iletisim"
          onClick={(e) => go("iletisim", e)}
          className={cn(buttonVariants({ variant: theme === "light" ? "navy" : "lime", size: "pill" }), "site-header__cta")}
        >
          {t.nav.cta}
        </a>
        <Button
          variant="outline-current"
          size="icon-pill"
          className="site-header__menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={t.nav.label}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </Button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            key="mobile-nav"
            aria-label={t.nav.label}
            className="mobile-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.16 } }}
            transition={{ type: "spring", stiffness: 420, damping: 36 }}
          >
            <ul>
              {NAV.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} onClick={(e) => go(item.id, e)}>
                    {t.nav[item.key]}
                  </a>
                </li>
              ))}
              <li className="mobile-nav__cta">
                <a
                  href="#iletisim"
                  onClick={(e) => go("iletisim", e)}
                  className={buttonVariants({ variant: "navy", size: "pill-lg" })}
                >
                  {t.nav.cta}
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
