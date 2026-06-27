import { motion } from "framer-motion";
import { useSection } from "@/lib/site-content";

export function Services() {
  const { heading, items } = useSection("services");
  return (
    <section id="services" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
      <div className="flex items-end mb-12 gap-4 sm:gap-8">
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight shrink-0">
          {heading}
        </h2>
        <div className="h-px flex-1 bg-white/10 mb-2" />
        <span className="text-muted-foreground text-xs font-mono shrink-0">
          [{items[0]?.code ?? "—"} — {items[items.length - 1]?.code ?? "—"}]
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6" style={{ perspective: 1200 }}>
        {items.map((s, i) => (
          <motion.div
            key={`${s.code}-${i}`}
            initial={{ opacity: 0, y: 30, rotateY: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            whileHover={{
              translateY: -6,
              rotateX: 4,
              rotateY: 4,
              scale: 1.02,
              transition: { duration: 0.25 },
            }}
            style={{ transformStyle: "preserve-3d" }}
            className="group p-8 bg-surface border border-white/10 hover:border-accent/40 hover:bg-white/[0.02] hover:shadow-[0_20px_60px_-15px_rgba(204,255,0,0.25)] transition-shadow"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="size-3 bg-accent rounded-full shadow-[0_0_12px_var(--color-accent)] group-hover:shadow-[0_0_24px_var(--color-accent)] transition-shadow" />
              <span className="font-mono text-[10px] text-muted-foreground tracking-widest">
                {s.code}
              </span>
            </div>
            <h3 className="text-xl font-heading font-semibold mb-3 group-hover:text-accent transition-colors">
              {s.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
