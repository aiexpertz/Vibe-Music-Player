import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Nav, Hero } from "@/components/portfolio/Hero";
import { Projects } from "@/components/portfolio/Projects";
import { Services } from "@/components/portfolio/Services";
import { Philosophy } from "@/components/portfolio/Philosophy";
import { Testimonials } from "@/components/portfolio/Testimonials";
import { Contact, Footer } from "@/components/portfolio/Contact";

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

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Services />
        <Philosophy />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}
