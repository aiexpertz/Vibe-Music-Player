import { motion } from "framer-motion";
import { Mail, Phone, Github, Linkedin, Instagram } from "lucide-react";
import { useSection } from "@/lib/site-content";


export function Contact() {
  const c = useSection("contact");

  const SOCIALS = [
    { label: "GITHUB", href: c.github_url, Icon: Github },
    { label: "LINKEDIN", href: c.linkedin_url, Icon: Linkedin },
    { label: "INSTAGRAM", href: c.instagram_url, Icon: Instagram },
  ];

  return (
    <section
      id="contact"
      className="py-16 px-6 max-w-5xl mx-auto scroll-mt-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">
          {c.heading}
        </h2>
        <p className="text-muted-foreground">{c.subheading}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="grid md:grid-cols-2 gap-4 mb-8"
      >
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=ammarsidaiexpert@gmail.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-4 p-5 bg-surface border border-white/10 hover:border-accent/50 hover:bg-white/[0.02] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(204,255,0,0.12)] transition-all group"
        >
          <div className="size-10 grid place-items-center bg-accent/10 border border-accent/20 shrink-0">
            <Mail className="size-4 text-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Email
            </p>
            <p className="text-sm font-semibold text-white truncate group-hover:text-accent transition-colors">
              {c.email}
            </p>
          </div>
        </a>
        <a
          href="https://wa.me/923147666278"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-4 p-5 bg-surface border border-white/10 hover:border-accent/50 hover:bg-white/[0.02] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(204,255,0,0.12)] transition-all group"
        >
          <div className="size-10 grid place-items-center bg-accent/10 border border-accent/20 shrink-0">
            <Phone className="size-4 text-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Phone
            </p>
            <p className="text-sm font-semibold text-white truncate group-hover:text-accent transition-colors">
              {c.phone}
            </p>
          </div>
        </a>
      </motion.div>

      <div className="mt-10 pt-10 border-t border-white/5 flex justify-center gap-8 flex-wrap">
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
