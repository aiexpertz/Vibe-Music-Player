import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function toYouTubeEmbed(url: string): string | null {
  try {
    const u = new URL(url.trim());
    let id = "";
    if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
    else if (u.pathname.startsWith("/embed/")) id = u.pathname.split("/")[2];
    else if (u.pathname.startsWith("/shorts/")) id = u.pathname.split("/")[2];
    else id = u.searchParams.get("v") ?? "";
    if (!id) return null;
    const t = u.searchParams.get("t") ?? u.searchParams.get("start");
    const start = t ? `&start=${parseInt(t, 10) || 0}` : "";
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0${start}`;
  } catch {
    return null;
  }
}
import aetherImg from "@/assets/project-aether.jpg";
import orchestratorImg from "@/assets/project-orchestrator.jpg";

type DbProject = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  youtube_url: string | null;
  image_url: string | null;
  created_at: string;
};

type DisplayProject = {
  id: string;
  name: string;
  tag: string;
  description: string;
  technologies: string[];
  image: string;
  youtube: string | null;
};

const fallbackImages = [aetherImg, orchestratorImg];

const fallback: DisplayProject[] = [
  {
    id: "f1",
    name: "Project_Aether",
    tag: "Autonomous Sales Agent",
    description:
      "Multi-agent swarm for automated lead qualification and CRM synchronization using GPT-4o.",
    technologies: ["GPT-4o", "LangGraph", "Supabase"],
    image: aetherImg,
    youtube: null,
  },
  {
    id: "f2",
    name: "Vibe_Orchestrator",
    tag: "Custom LLM Middleware",
    description:
      "High-throughput API gateway for managing agentic workflows and token cost optimization.",
    technologies: ["TypeScript", "Edge Functions", "Redis"],
    image: orchestratorImg,
    youtube: null,
  },
];

export function Projects() {
  const [items, setItems] = useState<DisplayProject[] | null>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!active) return;
        const rows = (data as DbProject[] | null) ?? [];
        if (rows.length === 0) {
          setItems(fallback);
          return;
        }
        setItems(
          rows.map((r, i) => ({
            id: r.id,
            name: r.title,
            tag: r.technologies[0] ?? "Project",
            description: r.description,
            technologies: r.technologies,
            image: r.image_url || fallbackImages[i % fallbackImages.length],
            youtube: r.youtube_url,
          })),
        );
      });
    return () => {
      active = false;
    };
  }, []);

  const list = items ?? fallback;

  return (
    <section id="work" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
      <div className="flex items-end mb-12 gap-4 sm:gap-8">
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight shrink-0">
          SELECTED_DEPLOYMENTS
        </h2>
        <div className="h-px flex-1 bg-white/10 mb-2" />
      </div>

      <div className="grid md:grid-cols-2 gap-8" style={{ perspective: 1400 }}>
        {list.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
            className="group [perspective:1400px]"
          >
            <div className="relative w-full aspect-video transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              {/* FRONT */}
              <div className="absolute inset-0 [backface-visibility:hidden] bg-surface outline outline-1 -outline-offset-1 outline-white/10 overflow-hidden shadow-[0_20px_60px_-20px_rgba(204,255,0,0.2)]">
                <img
                  src={p.image}
                  alt={`${p.name} mockup`}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-80"
                />
                <span className="absolute top-3 left-3 text-[10px] font-medium uppercase tracking-[0.15em] text-accent bg-background/70 px-2 py-1">
                  {p.tag}
                </span>
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/70 to-transparent">
                  <h3 className="text-lg font-heading font-bold">{p.name}</h3>
                </div>
              </div>
              {/* BACK */}
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-surface border border-accent/40 p-6 flex flex-col justify-between shadow-[0_20px_60px_-20px_rgba(204,255,0,0.4)]">
                <div>
                  <h3 className="text-xl font-heading font-bold mb-3 text-accent">
                    {p.name}
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed mb-4">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {p.technologies.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono uppercase tracking-widest border border-accent/30 px-2 py-1 text-accent"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                {p.youtube && (
                  <button
                    type="button"
                    onClick={() => setActive(p)}
                    className="self-start mt-4 text-[10px] font-bold tracking-widest text-accent hover:underline underline-offset-4"
                  >
                    WATCH_DEMO →
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl w-[95vw] bg-surface border border-accent/40 p-4 sm:p-6 shadow-[0_20px_80px_-20px_rgba(204,255,0,0.45)]">
          <DialogHeader>
            <DialogTitle className="font-heading text-accent tracking-tight">
              {active?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full bg-background outline outline-1 -outline-offset-1 outline-accent/30 overflow-hidden">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={`${active?.name} demo video`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-xs font-mono text-accent/70 px-4 text-center">
                INVALID_VIDEO_LINK
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
