import { createFileRoute, Link } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Nav, Hero } from "@/components/portfolio/Hero";
import { Footer } from "@/components/portfolio/Contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vibe Lab — AI Agent Developer & Vibe Coder" },
      {
        name: "description",
        content:
          "Independent AI agent developer building autonomous LLM workflows, intelligent chatbots, and custom web apps. Hire a Vibe Coder for high-velocity delivery.",
      },
      { property: "og:title", content: "Vibe Lab — AI Agent Developer & Vibe Coder" },
      {
        property: "og:description",
        content:
          "Autonomous AI agents, RAG chatbots, and custom web apps — built fast with the Vibe Coding philosophy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const quickLinks = [
  { to: "/work", code: "01", title: "Work", desc: "Selected AI agent deployments." },
  { to: "/services", code: "02", title: "Services", desc: "What I build — agents, apps, n8n." },
  { to: "/about", code: "03", title: "About", desc: "The Vibe Coding philosophy." },
  { to: "/contact", code: "04", title: "Contact", desc: "Start a project. 24h response." },
] as const;

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Nav />
      <main>
        <Hero />
        <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
          <div className="flex items-end mb-12 gap-4 sm:gap-8">
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight shrink-0">
              NAVIGATE
            </h2>
            <div className="h-px flex-1 bg-white/10 mb-2" />
            <span className="text-muted-foreground text-xs font-mono shrink-0">[01 — 04]</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="group p-6 bg-surface border border-white/10 hover:border-accent/50 transition-all"
              >
                <div className="font-mono text-[10px] text-muted-foreground tracking-widest mb-6">
                  / {l.code}
                </div>
                <div className="text-xl font-heading font-bold group-hover:text-accent transition-colors">
                  {l.title} →
                </div>
                <p className="text-muted-foreground text-sm mt-2">{l.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}
