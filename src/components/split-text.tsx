import { Fragment } from "react";
import { cn } from "@/lib/utils";

/**
 * Metni harf veya kelime span'larına böler. Ekran okuyucu görünmez tam metni
 * okur; görsel parçalar aria-hidden. Her parça maskeli bir kabın içinde durur,
 * kgunes'teki gibi yPercent ile maskeden kayarak girer/çıkar. Kelime arası
 * boşluk, inline-block kabın dışında düz metin olarak kalır (kırpılmasın diye).
 */
export function SplitText({
  text,
  by = "chars",
  className,
  partClassName,
  as: Tag = "span",
  lang,
}: {
  text: string;
  by?: "chars" | "words";
  className?: string;
  partClassName?: string;
  as?: "span" | "h2" | "p";
  lang?: string;
}) {
  const words = text.split(" ");
  return (
    <Tag className={cn("split", className)} lang={lang}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="split__visual">
        {words.map((word, wi) => (
          <Fragment key={`${word}-${wi}`}>
            <span className="split__word">
              {by === "words" ? (
                <span className="split__mask">
                  <span className={cn("split__part", partClassName)}>{word}</span>
                </span>
              ) : (
                Array.from(word).map((ch, ci) => (
                  <span key={ci} className="split__mask">
                    <span className={cn("split__part", partClassName)}>{ch}</span>
                  </span>
                ))
              )}
            </span>
            {wi < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
