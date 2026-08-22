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
      { title: "AI Automation for Real Estate | Lead Bots & CRM Agents" },
      {
        name: "description",
        content:
          "AI automation specialist for real estate: lead qualification bots, WhatsApp property inquiry chatbots, buyer-to-listing matching and automated CRM follow-up for agents.",
      },
      {
        property: "og:title",
        content: "AI Automation for Real Estate | Lead Bots & CRM Agents",
      },
      {
        property: "og:description",
        content:
          "AI agents that qualify real estate leads, answer property inquiries on WhatsApp 24/7, match buyers to listings and automate realtor CRM follow-up.",
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
