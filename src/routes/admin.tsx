import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import type { Session } from "@supabase/supabase-js";

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
  created_at: string;
};

const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10; // 10 years

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

      <main className="px-6 py-12 max-w-5xl mx-auto">
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
            className="w-full bg-black/40 border border-white/10 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </Field>
        <Field label="PASSWORD">
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/40 border border-white/10 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </Field>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-black font-bold uppercase tracking-widest py-3 text-sm hover:scale-[0.98] transition-transform disabled:opacity-50"
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techs, setTechs] = useState("");
  const [youtube, setYoutube] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
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
      const technologies = techs
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const { error } = await supabase.from("projects").insert({
        title,
        description,
        technologies,
        youtube_url: youtube || null,
        image_url: imageUrl,
      });
      if (error) throw error;
      toast.success("Project published");
      setTitle("");
      setDescription("");
      setTechs("");
      setYoutube("");
      setFile(null);
      (document.getElementById("file-input") as HTMLInputElement | null)?.value &&
        ((document.getElementById("file-input") as HTMLInputElement).value = "");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <div className="space-y-12">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-white/10 bg-surface/60 backdrop-blur p-8"
      >
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent mb-2">
          // new_deployment
        </p>
        <h2 className="text-2xl font-heading font-extrabold mb-6">Publish a Project</h2>
        <form onSubmit={onSubmit} className="grid gap-4">
          <Field label="PROJECT TITLE">
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/40 border border-white/10 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </Field>
          <Field label="DESCRIPTION">
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black/40 border border-white/10 px-3 py-2 text-sm focus:border-accent focus:outline-none resize-y"
            />
          </Field>
          <Field label="TECHNOLOGIES (comma separated)">
            <input
              value={techs}
              onChange={(e) => setTechs(e.target.value)}
              placeholder="React, OpenAI, Supabase"
              className="w-full bg-black/40 border border-white/10 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </Field>
          <Field label="YOUTUBE VIDEO LINK">
            <input
              type="url"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=…"
              className="w-full bg-black/40 border border-white/10 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </Field>
          <Field label="PROJECT SCREENSHOT">
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm file:bg-accent file:text-black file:border-0 file:px-3 file:py-2 file:mr-3 file:font-bold file:uppercase file:tracking-widest file:text-xs file:cursor-pointer"
            />
          </Field>
          <button
            type="submit"
            disabled={submitting}
            className="bg-accent text-black font-bold uppercase tracking-widest py-3 text-sm hover:scale-[0.99] transition-transform disabled:opacity-50"
          >
            {submitting ? "Publishing…" : "Publish Project →"}
          </button>
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
        {loading ? (
          <p className="text-muted-foreground text-sm font-mono">[ loading… ]</p>
        ) : projects.length === 0 ? (
          <p className="text-muted-foreground text-sm">No projects yet. Publish your first above.</p>
        ) : (
          <div className="grid gap-3">
            {projects.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-4 border border-white/10 bg-surface/40 p-4 hover:border-accent/30 transition-colors"
              >
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-20 h-14 object-cover bg-black"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-20 h-14 bg-black/60 border border-white/5" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold truncate">{p.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">{p.description}</p>
                </div>
                <button
                  onClick={() => onDelete(p.id)}
                  className="text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-2 hover:bg-red-500/10 transition-colors"
                >
                  Delete
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
