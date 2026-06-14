import { useState, type FormEvent } from "react";
import { toast } from "sonner";

export function Contact() {
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    setTimeout(() => {
      toast.success("Transmission received", {
        description: "I'll get back to you within 24 hours.",
      });
      form.reset();
      setSubmitting(false);
    }, 600);
  }

  return (
    <section id="contact" className="py-24 px-6 max-w-3xl mx-auto text-center">
      <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">
        Ready to Automate?
      </h2>
      <p className="text-muted-foreground mb-12">
        Let's build something that thinks for itself.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            required
            placeholder="NAME"
            className="w-full bg-surface border border-white/10 px-4 py-4 focus:outline-none focus:border-accent transition-colors text-xs font-bold tracking-widest placeholder:text-muted-foreground"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="EMAIL"
            className="w-full bg-surface border border-white/10 px-4 py-4 focus:outline-none focus:border-accent transition-colors text-xs font-bold tracking-widest placeholder:text-muted-foreground"
          />
        </div>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="TELL ME ABOUT YOUR PROJECT..."
          className="w-full bg-surface border border-white/10 px-4 py-4 focus:outline-none focus:border-accent transition-colors text-xs font-bold tracking-widest placeholder:text-muted-foreground resize-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-white text-black font-extrabold uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-60"
        >
          {submitting ? "Transmitting..." : "Initialize Project"}
        </button>
      </form>

      <div className="mt-16 pt-12 border-t border-white/5 flex justify-center gap-8 flex-wrap">
        <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-accent transition-colors text-xs font-bold tracking-widest">GITHUB</a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-accent transition-colors text-xs font-bold tracking-widest">LINKEDIN</a>
        <a href="https://x.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-accent transition-colors text-xs font-bold tracking-widest">X / TWITTER</a>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-10 border-t border-white/5 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
          © 2026 VIBE_LAB — ALL RIGHTS RESERVED
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          <div className="size-1.5 bg-accent rounded-full animate-pulse" />
          SYSTEMS_OPERATIONAL
        </div>
      </div>
    </footer>
  );
}
