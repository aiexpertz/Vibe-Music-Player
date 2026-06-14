import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Nav } from "@/components/portfolio/Hero";
import { Philosophy } from "@/components/portfolio/Philosophy";
import { Testimonials } from "@/components/portfolio/Testimonials";
import { Footer } from "@/components/portfolio/Contact";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Vibe Lab" },
      { name: "description", content: "The Vibe Coding philosophy, the studio behind Vibe Lab, and what clients say." },
      { property: "og:title", content: "About — Vibe Lab" },
      { property: "og:description", content: "The Vibe Coding philosophy and client signal." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Nav />
      <main className="pt-32">
        <div className="px-6 max-w-7xl mx-auto mb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent">// MANIFEST</span>
          <h1 className="text-5xl md:text-6xl font-heading font-extrabold mt-4">About the Lab.</h1>
        </div>
        <Philosophy />
        <Testimonials />
      </main>
      <Footer />
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}
