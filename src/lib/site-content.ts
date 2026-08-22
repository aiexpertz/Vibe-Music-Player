import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
    badge: "AI Automation for Real Estate",
    headline_prefix: "AI Agents That Qualify Leads",
    headline_highlight: "& Close Deals",
    headline_suffix: "For Real Estate Teams.",
    subheadline:
      "I build AI lead qualification bots, WhatsApp property-inquiry automation, and CRM follow-up systems that turn cold real estate leads into booked viewings — around the clock.",
    cta_primary: "Book a Consultation",
    cta_secondary: "See How It Works",
  } as HomeContent,
  services: {
    heading: "CORE_SERVICES",
    items: [
      {
        code: "S_01",
        title: "AI Lead Qualification Bots",
        description:
          "Agents that instantly engage every new property lead, ask budget, area, timeline and financing questions, score the lead, and hand hot buyers straight to your agents.",
      },
      {
        code: "S_02",
        title: "WhatsApp Property Inquiry Automation",
        description:
          "24/7 WhatsApp and website chatbots that answer listing questions, share brochures and pricing, and book viewings directly into your calendar.",
      },
      {
        code: "S_03",
        title: "Buyer-to-Listing Matching Agents",
        description:
          "AI that reads buyer requirements and matches them to your live inventory, then sends personalised listing shortlists the moment a suitable property hits the market.",
      },
      {
        code: "S_04",
        title: "Automated Lead Follow-Up",
        description:
          "Multi-touch nurture sequences over WhatsApp, email and SMS that keep every real estate lead warm until they're ready to buy, rent or sell.",
      },
      {
        code: "S_05",
        title: "CRM Automation for Realtors",
        description:
          "Hands-free data entry, deal-stage updates and reminders across your CRM — no more leads lost in spreadsheets or unread inboxes.",
      },
      {
        code: "S_06",
        title: "Custom Real Estate Web Apps",
        description:
          "Fast, AI-powered property portals, agent dashboards and valuation tools built on a modern stack and wired into your existing listing data.",
      },
    ],
  } as ServicesContent,
  philosophy: {
    heading: "How I Work With Real Estate Teams",
    body: "Real estate runs on speed — the agent who replies first usually wins the deal. I build AI systems that respond to every property inquiry in seconds, qualify the buyer or seller, and only surface serious leads to your team. Start with one workflow, prove the ROI in weeks, then scale it across your whole pipeline.",
    stat1_value: "24/7",
    stat1_label: "Lead Response",
    stat2_value: "<60s",
    stat2_label: "First Reply Time",
    image_url: null,
  } as PhilosophyContent,
  signal: {
    heading: "CLIENT_SIGNAL",
    items: [] as TestimonialItem[],
  } as SignalContent,
  contact: {
    heading: "Ready to Automate Your Real Estate Pipeline?",
    subheading:
      "Let's put an AI agent on every lead, inquiry and follow-up in your business.",
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
  const queryClient = useQueryClient();

  // Live updates: refetch whenever the admin panel writes to site_content.
  useEffect(() => {
    const channel = supabase
      .channel("site_content_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content" },
        () => queryClient.invalidateQueries({ queryKey: ["site_content"] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["site_content"],
    queryFn: fetchAllSiteContent,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}

export function useSection<K extends SectionKey>(key: K): SiteContentMap[K] {
  const { data } = useSiteContent();
  return (data?.[key] ?? DEFAULTS[key]) as SiteContentMap[K];
}
