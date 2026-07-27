import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import type { Session } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DEFAULTS,
  fetchAllSiteContent,
  type SectionKey,
  type SiteContentMap,
  type ServiceItem,
  type TestimonialItem,
} from "@/lib/site-content";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — Vibe Lab" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  youtube_url: string | null;
  image_url: string | null;
  display_order: number;
  created_at: string;
};

const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

const TABS: { key: "branding" | SectionKey | "work"; label: string }[] = [
  { key: "branding", label: "Branding" },
  { key: "home", label: "Home" },
  { key: "work", label: "Work" },
  { key: "services", label: "Services" },
  { key: "philosophy", label: "Philosophy" },
  { key: "signal", label: "Client Signal" },
  { key: "contact", label: "Contact" },
];

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) checkAdmin(s.user.id);
      else {
        setIsAdmin(false);
        setChecking(false);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) checkAdmin(data.session.user.id);
      else setChecking(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function checkAdmin(uid: string) {
    setChecking(true);
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!!data);
    setChecking(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(204,255,0,0.08),transparent_50%),radial-gradient(circle_at_80%_90%,rgba(204,255,0,0.05),transparent_50%)]" />
      <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <a href="/" className="text-xl font-heading font-extrabold italic tracking-tighter">
          VIBE<span className="text-accent">_</span>LAB
        </a>
        <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest">
          <span className="text-muted-foreground">/admin</span>
          {session && (
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                toast.success("Signed out");
              }}
              className="text-accent hover:underline"
            >
              Sign out →
            </button>
          )}
        </div>
      </header>

      <main className="px-6 py-12 max-w-6xl mx-auto">
        {checking ? (
          <p className="text-muted-foreground text-sm font-mono">[ initializing… ]</p>
        ) : !session ? (
          <AuthForm />
        ) : !isAdmin ? (
          <div className="border border-destructive/40 p-6">
            <h2 className="font-heading font-bold text-lg mb-2">Access denied</h2>
            <p className="text-sm text-muted-foreground">
              This account is not an admin. The first user to sign up automatically
              becomes admin.
            </p>
          </div>
        ) : (
          <Dashboard />
        )}
      </main>
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}

function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created — signing you in…");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto mt-12 border border-white/10 bg-surface/60 backdrop-blur p-8 shadow-[0_0_60px_-20px_rgba(204,255,0,0.3)]"
    >
      <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent mb-2">
        // secure_terminal
      </p>
      <h1 className="text-3xl font-heading font-extrabold mb-6">
        {mode === "login" ? "Admin Access" : "Initialize Admin"}
      </h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="EMAIL">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="PASSWORD">
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
          />
        </Field>
        <button
          type="submit"
          disabled={loading}
          className={primaryBtn}
        >
          {loading ? "…" : mode === "login" ? "Authenticate" : "Create Account"}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="mt-4 text-xs text-muted-foreground hover:text-accent transition-colors"
      >
        {mode === "login" ? "First time? Create the admin account →" : "Have an account? Sign in →"}
      </button>
    </motion.div>
  );
}

const inputCls =
  "w-full bg-black/40 border border-white/10 px-3 py-2 text-sm focus:border-accent focus:outline-none";
const primaryBtn =
  "bg-accent text-black font-bold uppercase tracking-widest py-3 px-5 text-sm hover:scale-[0.99] transition-transform disabled:opacity-50";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-1.5 block">
        {label}
      </span>
      {children}
    </label>
  );
}

function Dashboard() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("branding");
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
              tab === t.key
                ? "bg-accent text-black"
                : "border border-white/10 text-muted-foreground hover:text-accent hover:border-accent/40"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "work" ? (
        <WorkManager />
      ) : (
        <SectionEditor sectionKey={tab as SectionKey} />
      )}
    </div>
  );
}

// ───────────────────────── Section editors ─────────────────────────

function useSiteContentQuery() {
  return useQuery({
    queryKey: ["site_content"],
    queryFn: fetchAllSiteContent,
    staleTime: 0,
  });
}

async function uploadSiteAsset(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("site-assets")
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (upErr) throw upErr;
  const { data: signed, error: sErr } = await supabase.storage
    .from("site-assets")
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (sErr) throw sErr;
  return signed.signedUrl;
}

async function saveSection(key: SectionKey, data: SiteContentMap[SectionKey]) {
  const { error } = await supabase
    .from("site_content")
    .upsert({ key, data: data as never }, { onConflict: "key" });
  if (error) throw error;
}

function SectionEditor({ sectionKey }: { sectionKey: SectionKey }) {
  const qc = useQueryClient();
  const { data, isLoading } = useSiteContentQuery();
  const [draft, setDraft] = useState<SiteContentMap[SectionKey] | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setDraft(data[sectionKey]);
  }, [data, sectionKey]);

  if (isLoading || !draft) {
    return <p className="text-muted-foreground text-sm font-mono">[ loading… ]</p>;
  }

  async function save() {
    setSaving(true);
    try {
      await saveSection(sectionKey, draft!);
      toast.success("Saved — live on the site");
      qc.invalidateQueries({ queryKey: ["site_content"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function patch(partial: Partial<SiteContentMap[SectionKey]>) {
    setDraft((d) => ({ ...(d as object), ...partial }) as SiteContentMap[SectionKey]);
  }

  async function handleImage(field: "logo_url" | "favicon_url" | "image_url", file: File | null) {
    if (!file) return;
    try {
      const url = await uploadSiteAsset(file);
      patch({ [field]: url } as Partial<SiteContentMap[SectionKey]>);
      toast.success("Image uploaded — click Save to publish");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-white/10 bg-surface/60 backdrop-blur p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-extrabold capitalize">
          {sectionKey} content
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setDraft(DEFAULTS[sectionKey])}
            className="px-4 py-2 text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-accent/40 hover:text-accent"
          >
            Reset
          </button>
          <button onClick={save} disabled={saving} className={primaryBtn}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {sectionKey === "branding" && (
        <BrandingFields
          draft={draft as SiteContentMap["branding"]}
          patch={patch as (p: Partial<SiteContentMap["branding"]>) => void}
          onUpload={handleImage}
        />
      )}
      {sectionKey === "home" && (
        <HomeFields
          draft={draft as SiteContentMap["home"]}
          patch={patch as (p: Partial<SiteContentMap["home"]>) => void}
        />
      )}
      {sectionKey === "services" && (
        <ServicesFields
          draft={draft as SiteContentMap["services"]}
          patch={patch as (p: Partial<SiteContentMap["services"]>) => void}
        />
      )}
      {sectionKey === "philosophy" && (
        <PhilosophyFields
          draft={draft as SiteContentMap["philosophy"]}
          patch={patch as (p: Partial<SiteContentMap["philosophy"]>) => void}
          onUpload={handleImage}
        />
      )}
      {sectionKey === "signal" && (
        <SignalFields
          draft={draft as SiteContentMap["signal"]}
          patch={patch as (p: Partial<SiteContentMap["signal"]>) => void}
        />
      )}
      {sectionKey === "contact" && (
        <ContactFields
          draft={draft as SiteContentMap["contact"]}
          patch={patch as (p: Partial<SiteContentMap["contact"]>) => void}
        />
      )}
    </motion.div>
  );
}

function ImageField({
  label,
  url,
  onFile,
  onRemove,
  aspect = "aspect-video",
}: {
  label: string;
  url: string | null;
  onFile: (f: File | null) => void;
  onRemove: () => void;
  aspect?: string;
}) {
  return (
    <Field label={label}>
      <div className="flex gap-4 items-start">
        <div className={`w-40 ${aspect} bg-black/40 border border-white/10 overflow-hidden shrink-0`}>
          {url ? (
            <img src={url} alt="" className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full grid place-items-center text-[10px] text-muted-foreground font-mono">
              NO IMAGE
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm file:bg-accent file:text-black file:border-0 file:px-3 file:py-2 file:mr-3 file:font-bold file:uppercase file:tracking-widest file:text-xs file:cursor-pointer"
          />
          {url && (
            <button
              type="button"
              onClick={onRemove}
              className="text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-2 hover:bg-red-500/10"
            >
              Remove image
            </button>
          )}
        </div>
      </div>
    </Field>
  );
}

function BrandingFields({
  draft,
  patch,
  onUpload,
}: {
  draft: SiteContentMap["branding"];
  patch: (p: Partial<SiteContentMap["branding"]>) => void;
  onUpload: (f: "logo_url" | "favicon_url" | "image_url", file: File | null) => void;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="BRAND NAME (LEFT)">
          <input className={inputCls} value={draft.brand_first} onChange={(e) => patch({ brand_first: e.target.value })} />
        </Field>
        <Field label="BRAND NAME (RIGHT)">
          <input className={inputCls} value={draft.brand_second} onChange={(e) => patch({ brand_second: e.target.value })} />
        </Field>
      </div>
      <ImageField
        label="LOGO"
        url={draft.logo_url}
        onFile={(f) => onUpload("logo_url", f)}
        onRemove={() => patch({ logo_url: null })}
        aspect="aspect-square"
      />
      <ImageField
        label="FAVICON / SITE ICON"
        url={draft.favicon_url}
        onFile={(f) => onUpload("favicon_url", f)}
        onRemove={() => patch({ favicon_url: null })}
        aspect="aspect-square"
      />
    </div>
  );
}

function HomeFields({
  draft,
  patch,
}: {
  draft: SiteContentMap["home"];
  patch: (p: Partial<SiteContentMap["home"]>) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field label="BADGE">
        <input className={inputCls} value={draft.badge} onChange={(e) => patch({ badge: e.target.value })} />
      </Field>
      <div className="grid md:grid-cols-3 gap-4">
        <Field label="HEADLINE PREFIX">
          <input className={inputCls} value={draft.headline_prefix} onChange={(e) => patch({ headline_prefix: e.target.value })} />
        </Field>
        <Field label="HEADLINE HIGHLIGHT">
          <input className={inputCls} value={draft.headline_highlight} onChange={(e) => patch({ headline_highlight: e.target.value })} />
        </Field>
        <Field label="HEADLINE SUFFIX">
          <input className={inputCls} value={draft.headline_suffix} onChange={(e) => patch({ headline_suffix: e.target.value })} />
        </Field>
      </div>
      <Field label="SUB-HEADLINE">
        <textarea className={`${inputCls} resize-y`} rows={3} value={draft.subheadline} onChange={(e) => patch({ subheadline: e.target.value })} />
      </Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="PRIMARY CTA">
          <input className={inputCls} value={draft.cta_primary} onChange={(e) => patch({ cta_primary: e.target.value })} />
        </Field>
        <Field label="SECONDARY CTA">
          <input className={inputCls} value={draft.cta_secondary} onChange={(e) => patch({ cta_secondary: e.target.value })} />
        </Field>
      </div>
    </div>
  );
}

function ServicesFields({
  draft,
  patch,
}: {
  draft: SiteContentMap["services"];
  patch: (p: Partial<SiteContentMap["services"]>) => void;
}) {
  function updateItem(i: number, partial: Partial<ServiceItem>) {
    const items = draft.items.map((it, idx) => (idx === i ? { ...it, ...partial } : it));
    patch({ items });
  }
  function removeItem(i: number) {
    patch({ items: draft.items.filter((_, idx) => idx !== i) });
  }
  function addItem() {
    patch({
      items: [...draft.items, { code: `S_0${draft.items.length + 1}`, title: "New Service", description: "" }],
    });
  }
  return (
    <div className="grid gap-4">
      <Field label="SECTION HEADING">
        <input className={inputCls} value={draft.heading} onChange={(e) => patch({ heading: e.target.value })} />
      </Field>
      <div className="grid gap-3">
        {draft.items.map((it, i) => (
          <div key={i} className="border border-white/10 p-4 grid gap-2">
            <div className="grid md:grid-cols-[120px_1fr] gap-3">
              <input className={inputCls} value={it.code} onChange={(e) => updateItem(i, { code: e.target.value })} placeholder="CODE" />
              <input className={inputCls} value={it.title} onChange={(e) => updateItem(i, { title: e.target.value })} placeholder="Title" />
            </div>
            <textarea className={`${inputCls} resize-y`} rows={2} value={it.description} onChange={(e) => updateItem(i, { description: e.target.value })} placeholder="Description" />
            <button type="button" onClick={() => removeItem(i)} className="self-start text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300">
              Remove
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem} className="self-start px-4 py-2 text-xs font-bold uppercase tracking-widest border border-accent/40 text-accent hover:bg-accent hover:text-black">
        + Add service
      </button>
    </div>
  );
}

function PhilosophyFields({
  draft,
  patch,
  onUpload,
}: {
  draft: SiteContentMap["philosophy"];
  patch: (p: Partial<SiteContentMap["philosophy"]>) => void;
  onUpload: (f: "logo_url" | "favicon_url" | "image_url", file: File | null) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field label="HEADING">
        <input className={inputCls} value={draft.heading} onChange={(e) => patch({ heading: e.target.value })} />
      </Field>
      <Field label="BODY (line breaks become paragraphs)">
        <textarea className={`${inputCls} resize-y`} rows={6} value={draft.body} onChange={(e) => patch({ body: e.target.value })} />
      </Field>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <input className={inputCls} value={draft.stat1_value} onChange={(e) => patch({ stat1_value: e.target.value })} placeholder="10×" />
          <input className={inputCls} value={draft.stat1_label} onChange={(e) => patch({ stat1_label: e.target.value })} placeholder="Stat 1 label" />
        </div>
        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <input className={inputCls} value={draft.stat2_value} onChange={(e) => patch({ stat2_value: e.target.value })} placeholder="99%" />
          <input className={inputCls} value={draft.stat2_label} onChange={(e) => patch({ stat2_label: e.target.value })} placeholder="Stat 2 label" />
        </div>
      </div>
      <ImageField
        label="SIDE IMAGE"
        url={draft.image_url}
        onFile={(f) => onUpload("image_url", f)}
        onRemove={() => patch({ image_url: null })}
        aspect="aspect-[4/5]"
      />
    </div>
  );
}

function SignalFields({
  draft,
  patch,
}: {
  draft: SiteContentMap["signal"];
  patch: (p: Partial<SiteContentMap["signal"]>) => void;
}) {
  function update(i: number, p: Partial<TestimonialItem>) {
    patch({ items: draft.items.map((it, idx) => (idx === i ? { ...it, ...p } : it)) });
  }
  return (
    <div className="grid gap-4">
      <Field label="SECTION HEADING">
        <input className={inputCls} value={draft.heading} onChange={(e) => patch({ heading: e.target.value })} />
      </Field>
      {draft.items.map((t, i) => (
        <div key={i} className="border border-white/10 p-4 grid gap-2">
          <textarea className={`${inputCls} resize-y`} rows={3} value={t.quote} onChange={(e) => update(i, { quote: e.target.value })} placeholder="Quote" />
          <div className="grid md:grid-cols-2 gap-2">
            <input className={inputCls} value={t.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="Name" />
            <input className={inputCls} value={t.role} onChange={(e) => update(i, { role: e.target.value })} placeholder="Role / Company" />
          </div>
          <button type="button" onClick={() => patch({ items: draft.items.filter((_, idx) => idx !== i) })} className="self-start text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300">
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => patch({ items: [...draft.items, { quote: "", name: "", role: "" }] })}
        className="self-start px-4 py-2 text-xs font-bold uppercase tracking-widest border border-accent/40 text-accent hover:bg-accent hover:text-black"
      >
        + Add testimonial
      </button>
    </div>
  );
}

function ContactFields({
  draft,
  patch,
}: {
  draft: SiteContentMap["contact"];
  patch: (p: Partial<SiteContentMap["contact"]>) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field label="HEADING">
        <input className={inputCls} value={draft.heading} onChange={(e) => patch({ heading: e.target.value })} />
      </Field>
      <Field label="SUB-HEADING">
        <input className={inputCls} value={draft.subheading} onChange={(e) => patch({ subheading: e.target.value })} />
      </Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="EMAIL"><input className={inputCls} value={draft.email} onChange={(e) => patch({ email: e.target.value })} /></Field>
        <Field label="PHONE"><input className={inputCls} value={draft.phone} onChange={(e) => patch({ phone: e.target.value })} /></Field>
      </div>
      <Field label="GITHUB URL"><input className={inputCls} value={draft.github_url} onChange={(e) => patch({ github_url: e.target.value })} /></Field>
      <Field label="LINKEDIN URL"><input className={inputCls} value={draft.linkedin_url} onChange={(e) => patch({ linkedin_url: e.target.value })} /></Field>
      <Field label="INSTAGRAM URL"><input className={inputCls} value={draft.instagram_url} onChange={(e) => patch({ instagram_url: e.target.value })} /></Field>
    </div>
  );
}

// ───────────────────────── Work manager ─────────────────────────

function WorkManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techs, setTechs] = useState("");
  const [youtube, setYoutube] = useState("");
  const [file, setFile] = useState<File | null>(null);


  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setProjects((data as Project[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      let imageUrl: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("project-images")
          .upload(path, file, { cacheControl: "31536000", upsert: false });
        if (upErr) throw upErr;
        const { data: signed, error: sErr } = await supabase.storage
          .from("project-images")
          .createSignedUrl(path, SIGNED_URL_TTL);
        if (sErr) throw sErr;
        imageUrl = signed.signedUrl;
      }
      const technologies = techs.split(",").map((t) => t.trim()).filter(Boolean);
      if (editingId) {
        const { error } = await supabase
          .from("projects")
          .update({
            title,
            description,
            technologies,
            youtube_url: youtube || null,
            ...(imageUrl ? { image_url: imageUrl } : {}),
          })
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Project updated");
      } else {
        const { error } = await supabase.from("projects").insert({
          title,
          description,
          technologies,
          youtube_url: youtube || null,
          image_url: imageUrl,
          display_order: projects.length,
        });
        if (error) throw error;
        toast.success("Project published");
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setEditingId(null);
    setExistingImage(null);
    setTitle(""); setDescription(""); setTechs(""); setYoutube(""); setFile(null);
    const el = document.getElementById("file-input") as HTMLInputElement | null;
    if (el) el.value = "";
  }

  function onEdit(p: Project) {
    setEditingId(p.id);
    setExistingImage(p.image_url ?? null);
    setTitle(p.title);
    setDescription(p.description);
    setTechs((p.technologies ?? []).join(", "));
    setYoutube(p.youtube_url ?? "");
    setFile(null);
    const el = document.getElementById("file-input") as HTMLInputElement | null;
    if (el) el.value = "";
    document.getElementById("project-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }


  async function onDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  async function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = projects.findIndex((p) => p.id === active.id);
    const newIdx = projects.findIndex((p) => p.id === over.id);
    const next = arrayMove(projects, oldIdx, newIdx);
    setProjects(next);
    // persist new ordering
    const updates = next.map((p, i) =>
      supabase.from("projects").update({ display_order: i }).eq("id", p.id),
    );
    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);
    if (failed?.error) toast.error(failed.error.message);
    else toast.success("Order saved");
  }

  return (
    <div className="space-y-10">
      <motion.section
        id="project-form"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-white/10 bg-surface/60 backdrop-blur p-8 scroll-mt-24"
      >
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent mb-2">
          // {editingId ? "edit_deployment" : "new_deployment"}
        </p>
        <h2 className="text-2xl font-heading font-extrabold mb-6">
          {editingId ? "Edit Project" : "Publish a Project"}
        </h2>
        <form onSubmit={onSubmit} className="grid gap-4">
          <Field label="PROJECT TITLE">
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
          </Field>
          <Field label="DESCRIPTION">
            <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputCls} resize-y`} />
          </Field>
          <Field label="TECHNOLOGIES (comma separated)">
            <input value={techs} onChange={(e) => setTechs(e.target.value)} placeholder="React, OpenAI, Supabase" className={inputCls} />
          </Field>
          <Field label="YOUTUBE VIDEO LINK">
            <input type="url" value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" className={inputCls} />
          </Field>
          <Field label="PROJECT SCREENSHOT">
            <div className="grid gap-2">
              {editingId && existingImage && (
                <div className="flex items-center gap-3">
                  <img src={existingImage} alt="Current screenshot" className="w-24 h-16 object-cover bg-black border border-white/10" />
                  <span className="text-xs text-muted-foreground font-mono">
                    current — upload a new file to replace it
                  </span>
                </div>
              )}
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm file:bg-accent file:text-black file:border-0 file:px-3 file:py-2 file:mr-3 file:font-bold file:uppercase file:tracking-widest file:text-xs file:cursor-pointer"
              />
            </div>
          </Field>
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={submitting} className={primaryBtn}>
              {submitting
                ? editingId ? "Saving…" : "Publishing…"
                : editingId ? "Save Changes →" : "Publish Project →"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-3 text-xs font-bold uppercase tracking-widest border border-white/20 text-muted-foreground hover:text-white hover:border-white/40 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.section>


      <section>
        <div className="flex items-end mb-6 gap-4">
          <h2 className="text-xl font-heading font-extrabold tracking-tight">
            EXISTING_PROJECTS
          </h2>
          <div className="h-px flex-1 bg-white/10 mb-2" />
          <span className="text-muted-foreground text-xs font-mono">
            [{projects.length.toString().padStart(3, "0")}]
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-4 font-mono">
          // drag rows by the handle to reorder — saves instantly
        </p>
        {loading ? (
          <p className="text-muted-foreground text-sm font-mono">[ loading… ]</p>
        ) : projects.length === 0 ? (
          <p className="text-muted-foreground text-sm">No projects yet. Publish your first above.</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              <div className="grid gap-3">
                {projects.map((p) => (
                  <SortableProjectRow key={p.id} project={p} onDelete={onDelete} onEdit={onEdit} editing={editingId === p.id} />
                ))}

              </div>
            </SortableContext>
          </DndContext>
        )}
      </section>
    </div>
  );
}

function SortableProjectRow({
  project: p,
  onDelete,
  onEdit,
  editing,
}: {
  project: Project;
  onDelete: (id: string) => void;
  onEdit: (p: Project) => void;
  editing: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 border bg-surface/40 p-4 transition-colors ${editing ? "border-accent/60" : "border-white/10 hover:border-accent/30"}`}
    >

      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-accent p-1"
        aria-label="Drag to reorder"
        type="button"
      >
        <GripVertical className="size-5" />
      </button>
      {p.image_url ? (
        <img src={p.image_url} alt={p.title} className="w-20 h-14 object-cover bg-black" loading="lazy" />
      ) : (
        <div className="w-20 h-14 bg-black/60 border border-white/5" />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-bold truncate">{p.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{p.description}</p>
      </div>
      <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
        #{(p.display_order ?? 0).toString().padStart(2, "0")}
      </span>
      <button
        onClick={() => onEdit(p)}
        className="text-xs font-bold uppercase tracking-widest text-accent border border-accent/40 px-3 py-2 hover:bg-accent hover:text-black transition-colors"
        type="button"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(p.id)}
        className="text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-2 hover:bg-red-500/10 transition-colors"
        type="button"
      >
        Delete
      </button>

    </div>
  );
}
