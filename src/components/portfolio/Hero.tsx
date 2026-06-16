import { motion } from "framer-motion";
import { useSection } from "@/lib/site-content";

export function Nav() {
  const branding = useSection("branding");
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-background/80 backdrop-blur-md border-b border-white/5">
      <a href="#home" className="flex items-center gap-2 text-xl font-heading font-extrabold tracking-tighter italic shrink-0">
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
        <a href="#home" className="hover:text-accent transition-colors">Home</a>
        <a href="#work" className="hover:text-accent transition-colors">Work</a>
        <a href="#services" className="hover:text-accent transition-colors">Services</a>
        <a href="#philosophy" className="hover:text-accent transition-colors">Philosophy</a>
        <a href="#signal" className="hover:text-accent transition-colors">Client Signal</a>
        <a href="#contact" className="hover:text-accent transition-colors">Contact Us</a>
      </div>
      <a
        href="#contact"
        className="px-5 py-2 border border-accent/30 text-accent text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-black transition-all"
      >
        Hire Me
      </a>
    </nav>
  );
}

export function Hero() {
  const home = useSection("home");
  const branding = useSection("branding");
  // set favicon dynamically
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
    <section id="home" className="pt-40 pb-24 px-6 max-w-7xl mx-auto scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl"
      >
        <div className="inline-block px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-[10px] font-bold uppercase tracking-widest mb-6">
          {home.badge}
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold leading-[1.05] mb-8">
          {home.headline_prefix}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white/40">
            {home.headline_highlight}
          </span>{" "}
          {home.headline_suffix}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl leading-relaxed mb-10">
          {home.subheadline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#contact"
            className="px-8 py-4 bg-accent text-black font-bold uppercase tracking-tight text-base sm:text-lg hover:scale-[0.97] transition-transform text-center"
          >
            {home.cta_primary}
          </a>
          <a
            href="#philosophy"
            className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-tight text-base sm:text-lg hover:bg-white/10 transition-colors text-center"
          >
            {home.cta_secondary}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
