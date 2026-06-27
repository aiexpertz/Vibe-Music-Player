import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useSection } from "@/lib/site-content";
import { ParticleField } from "./ParticleField";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#philosophy", label: "Philosophy" },
  { href: "#signal", label: "Client Signal" },
  { href: "#contact", label: "Contact Us" },
];

export function Nav() {
  const branding = useSection("branding");
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-background/80 backdrop-blur-md border-b border-white/5">
        <a
          href="#home"
          className="flex items-center gap-2 text-xl font-heading font-extrabold tracking-tighter italic shrink-0"
        >
          {branding.logo_url && (
            <img src={branding.logo_url} alt="Logo" className="h-7 w-auto" />
          )}
          <span>
            {branding.brand_first}
            <span className="text-accent">_</span>
            {branding.brand_second}
          </span>
        </a>
        <div className="hidden lg:flex gap-6 text-xs font-medium tracking-wide uppercase">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-accent transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden sm:inline-block px-5 py-2 border border-accent/30 text-accent text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-black transition-all"
          >
            Hire Me
          </a>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 text-white hover:text-accent transition-colors"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 z-[70] h-full w-[78%] max-w-sm bg-background border-l border-accent/20 lg:hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/10">
                <span className="font-heading font-extrabold italic">
                  {branding.brand_first}
                  <span className="text-accent">_</span>
                  {branding.brand_second}
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="p-2 text-white hover:text-accent transition-colors"
                >
                  <X className="size-6" />
                </button>
              </div>
              <div className="flex flex-col p-6 gap-1">
                {NAV_LINKS.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                    className="text-lg font-bold uppercase tracking-widest py-3 border-b border-white/5 hover:text-accent hover:pl-2 transition-all"
                  >
                    {l.label}
                  </motion.a>
                ))}
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="mt-8 px-5 py-3 bg-accent text-black text-xs font-bold uppercase tracking-widest text-center"
                >
                  Hire Me
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function Hero() {
  const home = useSection("home");
  const branding = useSection("branding");
  if (typeof document !== "undefined" && branding.favicon_url) {
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    if (link.href !== branding.favicon_url) link.href = branding.favicon_url;
  }
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-40 pb-24 px-6 scroll-mt-20"
    >
      <ParticleField />
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
          style={{ perspective: 1200 }}
        >
          <div className="inline-block px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-[10px] font-bold uppercase tracking-widest mb-6">
            {home.badge}
          </div>
          <motion.h1
            initial={{ opacity: 0, rotateX: -25, y: 30 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{
              transformStyle: "preserve-3d",
              textShadow:
                "0 1px 0 rgba(255,255,255,0.05), 0 0 40px rgba(204,255,0,0.15)",
            }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold leading-[1.05] mb-8"
          >
            {home.headline_prefix}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white/40">
              {home.headline_highlight}
            </span>{" "}
            {home.headline_suffix}
          </motion.h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl leading-relaxed mb-10">
            {home.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="group relative px-8 py-4 bg-accent text-black font-bold uppercase tracking-tight text-base sm:text-lg text-center transition-all duration-150 shadow-[0_6px_0_0_rgba(0,0,0,0.6),0_0_30px_rgba(204,255,0,0.35)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.6),0_0_20px_rgba(204,255,0,0.25)] hover:translate-y-1 active:translate-y-[6px] active:shadow-none"
            >
              {home.cta_primary}
            </a>
            <a
              href="#philosophy"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-tight text-base sm:text-lg hover:bg-white/10 hover:border-accent/40 transition-all text-center"
            >
              {home.cta_secondary}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
