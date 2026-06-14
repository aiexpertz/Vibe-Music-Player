import { motion } from "framer-motion";
import aetherImg from "@/assets/project-aether.jpg";
import orchestratorImg from "@/assets/project-orchestrator.jpg";

type Project = {
  name: string;
  tag: string;
  description: string;
  image: string;
  demo: string;
  code: string;
};

const projects: Project[] = [
  {
    name: "Project_Aether",
    tag: "Autonomous Sales Agent",
    description:
      "Multi-agent swarm for automated lead qualification and CRM synchronization using GPT-4o.",
    image: aetherImg,
    demo: "#",
    code: "#",
  },
  {
    name: "Vibe_Orchestrator",
    tag: "Custom LLM Middleware",
    description:
      "High-throughput API gateway for managing agentic workflows and token cost optimization.",
    image: orchestratorImg,
    demo: "#",
    code: "#",
  },
  {
    name: "Helios_Support",
    tag: "RAG Chatbot Platform",
    description:
      "Context-aware customer support agent grounded in private docs, with tool-use for ticket actions.",
    image: aetherImg,
    demo: "#",
    code: "#",
  },
  {
    name: "Synapse_Ops",
    tag: "DevOps Copilot",
    description:
      "Autonomous incident-response agent that triages alerts, runs runbooks, and posts post-mortems.",
    image: orchestratorImg,
    demo: "#",
    code: "#",
  },
];

export function Projects() {
  return (
    <section id="projects" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex items-end mb-12 gap-4 sm:gap-8">
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight shrink-0">
          SELECTED_DEPLOYMENTS
        </h2>
        <div className="h-px flex-1 bg-white/10 mb-2" />
        <span className="text-muted-foreground text-xs font-mono shrink-0">
          [001 — 004]
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="relative w-full aspect-video bg-surface outline outline-1 -outline-offset-1 outline-white/10 mb-6 group-hover:outline-accent/50 transition-all overflow-hidden">
              <img
                src={p.image}
                alt={`${p.name} mockup`}
                loading="lazy"
                width={1280}
                height={800}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <span className="absolute top-3 left-3 text-[10px] font-medium uppercase tracking-[0.15em] text-accent bg-background/70 px-2 py-1">
                {p.tag}
              </span>
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2 group-hover:text-accent transition-colors">
              {p.name}
            </h3>
            <p className="text-muted-foreground text-sm mb-3">{p.description}</p>
            <div className="flex gap-5 text-[10px] font-bold tracking-widest">
              <a href={p.demo} className="text-accent hover:underline underline-offset-4">
                LIVE_DEMO →
              </a>
              <a href={p.code} className="text-muted-foreground hover:text-white transition-colors">
                SOURCE_CODE →
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
