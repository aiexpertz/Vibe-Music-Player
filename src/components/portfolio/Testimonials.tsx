import { motion } from "framer-motion";
import { useSection } from "@/lib/site-content";

const TRUST_POINTS: string[] = [
  "Every project starts with a working demo, not just a pitch — you see the AI agent in action before you commit.",
  "Direct access to me, not a support ticket queue — I build, deploy and maintain every system myself.",
  "Built on real property data and real WhatsApp flows — not generic chatbot templates.",
];

export function Testimonials() {
  const { heading, items } = useSection("signal");
  const list = Array.isArray(items) ? items : [];
  return (
    <section id="signal" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
      <div className="flex items-end mb-12 gap-4 sm:gap-8">
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight shrink-0">
          {heading}
        </h2>
        <div className="h-px flex-1 bg-white/10 mb-2" />
      </div>
      {list.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="text-accent font-mono text-xs">//</span>
            <h3 className="font-mono text-sm sm:text-base uppercase tracking-widest text-white">
              Why Real Estate Teams Choose to Work With Me
            </h3>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {TRUST_POINTS.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-8 bg-surface border border-white/10 hover:border-accent/60 hover:bg-white/[0.02] hover:shadow-[0_25px_70px_-15px_rgba(204,255,0,0.45)] transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                    T_{String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="size-2 bg-accent rounded-full shadow-[0_0_12px_var(--color-accent)]" />
                </div>
                <p className="text-white/90 text-sm leading-relaxed">{point}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-8 bg-surface border border-accent/20"
          >
            <p className="text-base sm:text-lg font-heading font-semibold leading-relaxed flex-1">
              Book a 15-min call and I'll show you a live demo built around
              your listings.
            </p>
            <a
              href="#contact"
              className="shrink-0 px-8 py-4 bg-accent text-black font-bold uppercase tracking-tight text-sm sm:text-base text-center transition-all duration-150 shadow-[0_6px_0_0_rgba(0,0,0,0.6),0_0_30px_rgba(204,255,0,0.35)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.6),0_0_20px_rgba(204,255,0,0.25)] hover:translate-y-1 active:translate-y-[6px] active:shadow-none"
            >
              Book a Consultation
            </a>
          </motion.div>
        </motion.div>
      )}
      <div className="grid md:grid-cols-3 gap-6">
        {list.map((t, i) => (
          <motion.div
            key={`${t.name}-${i}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group h-64 [perspective:1400px]"
          >
            <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              {/* FRONT */}
              <div className="absolute inset-0 [backface-visibility:hidden] p-8 bg-surface border border-white/10 flex flex-col justify-between shadow-[0_20px_50px_-20px_rgba(204,255,0,0.2)]">
                <div className="text-accent text-4xl font-heading leading-none">"</div>
                <div>
                  <p className="font-bold text-base">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.role}</p>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-accent mt-4">
                    Hover to read →
                  </p>
                </div>
              </div>
              {/* BACK */}
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] p-8 bg-surface border border-accent/40 flex items-center shadow-[0_25px_60px_-20px_rgba(204,255,0,0.45)]">
                <p className="text-white/90 italic leading-relaxed text-sm">{t.quote}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
