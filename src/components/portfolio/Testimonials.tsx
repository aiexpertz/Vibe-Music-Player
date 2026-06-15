import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "The agentic workflows reduced our SDR response time from hours to seconds. Game-changing output.",
    name: "Sarah Chen",
    role: "CTO @ NexusFlow",
  },
  {
    quote:
      "Efficiency reached a point where our internal tools started feeling like they were one step ahead of us.",
    name: "Marcus Thorne",
    role: "Founder @ Automata",
  },
  {
    quote:
      "A rare developer who understands both the deep technical constraints and the high-level business vibe.",
    name: "Elena Rossi",
    role: "VP Eng @ Vertex",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex items-end mb-12 gap-4 sm:gap-8">
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight shrink-0">
          CLIENT_SIGNAL
        </h2>
        <div className="h-px flex-1 bg-white/10 mb-2" />
        <span className="text-muted-foreground text-xs font-mono shrink-0">[ TRUST ]</span>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="p-8 bg-surface border border-white/10"
          >
            <div className="text-accent text-3xl font-heading mb-4 leading-none">"</div>
            <p className="text-white/90 italic mb-8 leading-relaxed">{t.quote}</p>
            <div className="flex items-center gap-3 pt-6 border-t border-white/5">
              <div className="size-9 rounded-full bg-gradient-to-br from-accent/40 to-white/10 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{t.name}</p>
                <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase truncate">
                  {t.role}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
