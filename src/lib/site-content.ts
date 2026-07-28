import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const SECTION_KEYS = [
  "branding",
  "home",
  "services",
  "philosophy",
  "signal",
  "contact",
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export type BrandingContent = {
  brand_first: string;
  brand_second: string;
  logo_url: string | null;
  favicon_url: string | null;
};

export type HomeContent = {
  badge: string;
  headline_prefix: string;
  headline_highlight: string;
  headline_suffix: string;
  subheadline: string;
  cta_primary: string;
  cta_secondary: string;
};

export type ServiceItem = {
  code: string;
  title: string;
  description: string;
};
export type ServicesContent = {
  heading: string;
  items: ServiceItem[];
};

export type PhilosophyContent = {
  heading: string;
  body: string;
  stat1_value: string;
  stat1_label: string;
  stat2_value: string;
  stat2_label: string;
  image_url: string | null;
};

export type TestimonialItem = { quote: string; name: string; role: string };
export type SignalContent = {
  heading: string;
  items: TestimonialItem[];
};

export type ContactContent = {
  heading: string;
  subheading: string;
  email: string;
  phone: string;
  github_url: string;
  linkedin_url: string;
  instagram_url: string;
};

export const DEFAULTS = {
  branding: {
    brand_first: "VIBE",
    brand_second: "LAB",
    logo_url: null,
    favicon_url: null,
  } as BrandingContent,
  home: {
    badge: "AI Agent Architect",
    headline_prefix: "Building Intelligent",
    headline_highlight: "AI Agents",
    headline_suffix: "That Scale Your Business.",
    subheadline:
      "I combine heavy-duty LLM orchestration with Vibe Coding—prioritizing speed, intuition, and high-performance DX.",
    cta_primary: "Book a Consultation",
    cta_secondary: "View Manifest",
  } as HomeContent,
  services: {
    heading: "CORE_SERVICES",
    items: [
      {
        code: "S_01",
        title: "AI Automation",
        description:
          "End-to-end workflow automation using tool-calling agents and multi-step reasoning chains that replace manual ops drag.",
      },
      {
        code: "S_02",
        title: "Custom Web Apps",
        description:
          "Performant, real-time interfaces built on a modern stack — React, TanStack, Tailwind — optimized for AI-driven UX.",
      },
      {
        code: "S_03",
        title: "Intelligent Chatbots",
        description:
          "RAG-powered conversational agents that hold context, follow brand voice, and execute actual business logic.",
      },
    ],
  } as ServicesContent,
  philosophy: {
    heading: "The Vibe Coding Philosophy",
    body: "Traditional dev is too slow. Vibe Coding is the art of using AI to bridge the gap between imagination and production at terminal velocity. I build systems that don't just follow logic—they anticipate user intent. Cleaner stacks, faster shipping, zero friction.",
    stat1_value: "10×",
    stat1_label: "Deployment Speed",
    stat2_value: "99%",
    stat2_label: "Uptime SLA",
    image_url: null,
  } as PhilosophyContent,
  signal: {
    heading: "CLIENT_SIGNAL",
    items: [
      {
        quote:
          "The agentic workflows reduced our SDR response time from hours to seconds. Game-changing output.",
        name: "Sarah Chen",
        role: "CTO @ NexusFlow",
      },
      {
        quote:
          "Efficiency reached a point where our internal tools started feeling like they were one step ahead of us.",
        name: "Marcus Thorne",
        role: "Founder @ Automata",
      },
      {
        quote:
          "A rare developer who understands both the deep technical constraints and the high-level business vibe.",
        name: "Elena Rossi",
        role: "VP Eng @ Vertex",
      },
    ],
  } as SignalContent,
  contact: {
    heading: "Ready to Automate?",
    subheading: "Let's build something that thinks for itself.",
    email: "ammarsidaiexpert@gmail.com",
    phone: "+92 314 7666278",
    github_url: "https://github.com/aiexpertz",
    linkedin_url:
      "https://www.linkedin.com/in/ammar-siddiqui-19849040a?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    instagram_url: "https://www.instagram.com/ammaraiexpertz/",
  } as ContactContent,
};

export type SiteContentMap = {
  branding: BrandingContent;
  home: HomeContent;
  services: ServicesContent;
  philosophy: PhilosophyContent;
  signal: SignalContent;
  contact: ContactContent;
};

/** Drop null/undefined values so they never overwrite a default (e.g. items: null). */
function clean(payload: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(payload).filter(([k, v]) => v !== undefined && !(v === null && k !== "logo_url" && k !== "favicon_url" && k !== "image_url")),
  );
}

export async function fetchAllSiteContent(): Promise<SiteContentMap> {
  const { data, error } = await supabase.from("site_content").select("key,data");
  if (error) console.error("[site_content]", error.message);
  const map = { ...DEFAULTS } as SiteContentMap;
  (data ?? []).forEach((row) => {
    if (!(SECTION_KEYS as readonly string[]).includes(row.key)) return;
    const k = row.key as SectionKey;
    const payload = (row.data && typeof row.data === "object" && !Array.isArray(row.data)
      ? row.data
      : {}) as Record<string, unknown>;
    // @ts-expect-error generic merge of partial DB data over defaults
    map[k] = { ...DEFAULTS[k], ...clean(payload) };
  });
  // Guarantee list-shaped sections always expose an array.
  if (!Array.isArray(map.signal.items)) map.signal = { ...map.signal, items: [] };
  if (!Array.isArray(map.services.items)) map.services = { ...map.services, items: [] };
  return map;
}

export function useSiteContent() {
  return useQuery({
    queryKey: ["site_content"],
    queryFn: fetchAllSiteContent,
    staleTime: 30_000,
  });
}

export function useSection<K extends SectionKey>(key: K): SiteContentMap[K] {
  const { data } = useSiteContent();
  return (data?.[key] ?? DEFAULTS[key]) as SiteContentMap[K];
}
