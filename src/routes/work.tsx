import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Nav } from "@/components/portfolio/Hero";
import { Projects } from "@/components/portfolio/Projects";
import { Footer } from "@/components/portfolio/Contact";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Vibe Lab" },
      { name: "description", content: "Selected AI agent deployments, RAG platforms, and automation workflows shipped by Vibe Lab." },
      { property: "og:title", content: "Work — Vibe Lab" },
      { property: "og:description", content: "Selected AI agent deployments and automation workflows." },
    ],
  }),
  component: WorkPage,
});

function WorkPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Nav />
      <main className="pt-32">
        <div className="px-6 max-w-7xl mx-auto mb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent">// PORTFOLIO</span>
          <h1 className="text-5xl md:text-6xl font-heading font-extrabold mt-4">The Work.</h1>
        </div>
        <Projects />
      </main>
      <Footer />
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}
