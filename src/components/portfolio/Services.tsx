import { motion } from "framer-motion";

const services = [
  {
    code: "S_01",
    title: "AI Automation",
    description:
      "End-to-end workflow automation using tool-calling agents and multi-step reasoning chains that replace manual ops drag.",
  },
  {
    code: "S_02",
    title: "Custom Web Apps",
    description:
      "Performant, real-time interfaces built on a modern stack — React, TanStack, Tailwind — optimized for AI-driven UX.",
  },
  {
    code: "S_03",
    title: "Intelligent Chatbots",
    description:
      "RAG-powered conversational agents that hold context, follow brand voice, and execute actual business logic.",
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex items-end mb-12 gap-4 sm:gap-8">
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight shrink-0">
          CORE_SERVICES
        </h2>
        <div className="h-px flex-1 bg-white/10 mb-2" />
        <span className="text-muted-foreground text-xs font-mono shrink-0">
          [S_01 — S_03]
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.code}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group p-8 bg-surface border border-white/10 hover:border-accent/40 hover:bg-white/[0.02] transition-all"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="size-3 bg-accent rounded-full shadow-[0_0_12px_var(--color-accent)]" />
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
