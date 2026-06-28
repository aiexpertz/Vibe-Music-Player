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
              translateY: -10,
              rotateX: 6,
              rotateY: 6,
              scale: 1.03,
              transition: { duration: 0.25 },
            }}
            style={{
              transformStyle: "preserve-3d",
              animation: `float-pill 6s ease-in-out ${i * 0.7}s infinite`,
            }}
            className="group p-8 bg-surface border border-white/10 hover:border-accent/60 hover:bg-white/[0.02] hover:shadow-[0_25px_70px_-15px_rgba(204,255,0,0.45)] transition-shadow"
          >
            <div className="flex items-center mb-8">
              <div className="size-3 bg-accent rounded-full shadow-[0_0_12px_var(--color-accent)] group-hover:shadow-[0_0_28px_var(--color-accent)] transition-shadow" />
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
