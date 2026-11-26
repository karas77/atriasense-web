"use client";

import { useLang } from "@/components/providers/lang-provider";

export function SkipLink() {
  const { t } = useLang();
  return (
    <a href="#urunler" className="skip-link">
      {t.skip}
    </a>
  );
}
