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
        <span className="text-muted-foreground text-xs font-mono shrink-0">[ TRUST ]</span>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((t, i) => (
          <motion.div
            key={`${t.name}-${i}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="p-8 bg-surface border border-white/10"
          >
            <div className="text-accent text-3xl font-heading mb-4 leading-none">"</div>
            <p className="text-white/90 italic mb-8 leading-relaxed">{t.quote}</p>
            <div className="pt-4 border-t border-white/10">
              <p className="font-bold text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
