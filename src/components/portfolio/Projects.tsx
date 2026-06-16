import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
    image: aetherImg,
    youtube: null,
  },
  {
    id: "f2",
    name: "Vibe_Orchestrator",
    tag: "Custom LLM Middleware",
    description:
      "High-throughput API gateway for managing agentic workflows and token cost optimization.",
    image: orchestratorImg,
    youtube: null,
  },
];

function youtubeEmbed(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    let id: string | null = null;
    if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
    else if (u.searchParams.get("v")) id = u.searchParams.get("v");
    else if (u.pathname.startsWith("/embed/")) id = u.pathname.split("/")[2];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

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
        <span className="text-muted-foreground text-xs font-mono shrink-0">
          [{list.length.toString().padStart(3, "0")}]
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {list.map((p, i) => {
          const embed = youtubeEmbed(p.youtube);
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
              className="group"
            >
              <div className="relative w-full aspect-video bg-surface outline outline-1 -outline-offset-1 outline-white/10 mb-6 group-hover:outline-accent/50 transition-all overflow-hidden">
                {embed ? (
                  <iframe
                    src={embed}
                    title={p.name}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <img
                    src={p.image}
                    alt={`${p.name} mockup`}
                    loading="lazy"
                    width={1280}
                    height={800}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                )}
                <span className="absolute top-3 left-3 text-[10px] font-medium uppercase tracking-[0.15em] text-accent bg-background/70 px-2 py-1">
                  {p.tag}
                </span>
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2 group-hover:text-accent transition-colors">
                {p.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-3">{p.description}</p>
              {p.youtube && (
                <div className="flex gap-5 text-[10px] font-bold tracking-widest">
                  <a
                    href={p.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent hover:underline underline-offset-4"
                  >
                    WATCH_DEMO →
                  </a>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
