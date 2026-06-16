import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, Phone, Github, Linkedin, Instagram } from "lucide-react";
import { useSection } from "@/lib/site-content";

export function Contact() {
  const c = useSection("contact");
  const [submitting, setSubmitting] = useState(false);

  const SOCIALS = [
    { label: "GITHUB", href: c.github_url, Icon: Github },
    { label: "LINKEDIN", href: c.linkedin_url, Icon: Linkedin },
    { label: "INSTAGRAM", href: c.instagram_url, Icon: Instagram },
  ];

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
    <section
      id="contact"
      className="py-24 px-6 max-w-5xl mx-auto scroll-mt-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">
          Ready to Automate?
        </h2>
        <p className="text-muted-foreground">
          Let's build something that thinks for itself.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="grid md:grid-cols-2 gap-4 mb-10"
      >
        <a
          href="mailto:ammarsidaiexpert@gmail.com"
          className="flex items-center gap-4 p-5 bg-surface border border-white/10 hover:border-accent/50 hover:bg-white/[0.02] transition-all group"
        >
          <div className="size-10 grid place-items-center bg-accent/10 border border-accent/20 shrink-0">
            <Mail className="size-4 text-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Email
            </p>
            <p className="text-sm font-semibold text-white truncate group-hover:text-accent transition-colors">
              ammarsidaiexpert@gmail.com
            </p>
          </div>
        </a>
        <a
          href="tel:+923147666278"
          className="flex items-center gap-4 p-5 bg-surface border border-white/10 hover:border-accent/50 hover:bg-white/[0.02] transition-all group"
        >
          <div className="size-10 grid place-items-center bg-accent/10 border border-accent/20 shrink-0">
            <Phone className="size-4 text-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Phone
            </p>
            <p className="text-sm font-semibold text-white truncate group-hover:text-accent transition-colors">
              +92 314 7666278
            </p>
          </div>
        </a>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-6 text-left"
      >
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
      </motion.form>

      <div className="mt-16 pt-12 border-t border-white/5 flex justify-center gap-8 flex-wrap">
        {SOCIALS.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors text-xs font-bold tracking-widest"
          >
            <Icon className="size-4" />
            {label}
          </a>
        ))}
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
