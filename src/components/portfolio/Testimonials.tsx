import { motion } from "framer-motion";
import { useSection } from "@/lib/site-content";

export function Testimonials() {
  const { heading, items } = useSection("signal");
  return (
    <section id="signal" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
      <div className="flex items-end mb-12 gap-4 sm:gap-8">
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight shrink-0">
          {heading}
        </h2>
        <div className="h-px flex-1 bg-white/10 mb-2" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((t, i) => (
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
