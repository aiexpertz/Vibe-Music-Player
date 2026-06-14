import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Nav } from "@/components/portfolio/Hero";
import { Services } from "@/components/portfolio/Services";
import { Footer } from "@/components/portfolio/Contact";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Vibe Lab" },
      { name: "description", content: "AI automation, custom web apps, intelligent chatbots, n8n, Vibe Coding, and custom design systems." },
      { property: "og:title", content: "Services — Vibe Lab" },
      { property: "og:description", content: "AI automation, n8n, Vibe Coding, and custom design systems." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Nav />
      <main className="pt-32">
        <div className="px-6 max-w-7xl mx-auto mb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent">// CAPABILITIES</span>
          <h1 className="text-5xl md:text-6xl font-heading font-extrabold mt-4">What I Build.</h1>
        </div>
        <Services />
      </main>
      <Footer />
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}
