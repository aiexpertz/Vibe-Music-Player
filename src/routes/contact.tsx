import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Nav } from "@/components/portfolio/Hero";
import { Contact, Footer } from "@/components/portfolio/Contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Vibe Lab" },
      { name: "description", content: "Start a project with Vibe Lab — AI agents, automation, and custom apps." },
      { property: "og:title", content: "Contact — Vibe Lab" },
      { property: "og:description", content: "Start a project with Vibe Lab." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Nav />
      <main className="pt-32">
        <Contact />
      </main>
      <Footer />
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}
