import { IntroLoader } from "@/components/intro-loader";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";
import { Hero } from "@/components/sections/hero";
import { Products } from "@/components/sections/products";
import { About } from "@/components/sections/about";
import { Partners } from "@/components/sections/partners";
import { ColorTransition } from "@/components/sections/color-transition";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <SkipLink />
      <IntroLoader />
      <SiteHeader />
      <main id="main">
        <Hero />
        {/* Kutu sahnesi (video) daha sonra buraya eklenecek. */}
        <Products />
        <About />
        <Partners />
        <ColorTransition />
        <Contact />
      </main>
    </>
  );
}
