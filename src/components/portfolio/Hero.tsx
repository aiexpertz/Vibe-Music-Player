import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-background/80 backdrop-blur-md border-b border-white/5">
      <Link to="/" className="text-xl font-heading font-extrabold tracking-tighter italic">
        VIBE<span className="text-accent">_</span>LAB
      </Link>
      <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide uppercase">
        <Link to="/work" className="hover:text-accent transition-colors" activeProps={{ className: "text-accent" }}>Work</Link>
        <Link to="/services" className="hover:text-accent transition-colors" activeProps={{ className: "text-accent" }}>Services</Link>
        <Link to="/contact" className="hover:text-accent transition-colors" activeProps={{ className: "text-accent" }}>Contact</Link>
      </div>
      <Link
        to="/contact"
        className="px-5 py-2 border border-accent/30 text-accent text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-black transition-all"
      >
        Hire Me
      </Link>
    </nav>
  );
}

export function Hero() {
  return (
    <section id="top" className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl"
      >
        <div className="inline-block px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-[10px] font-bold uppercase tracking-widest mb-6">
          AI Agent Architect
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold leading-[1.05] mb-8">
          Building Intelligent{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white/40">
            AI Agents
          </span>{" "}
          That Scale Your Business.
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl leading-relaxed mb-10">
          I combine heavy-duty LLM orchestration with{" "}
          <span className="text-white italic">Vibe Coding</span>—prioritizing speed, intuition, and high-performance DX.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/contact"
            className="px-8 py-4 bg-accent text-black font-bold uppercase tracking-tight text-base sm:text-lg hover:scale-[0.97] transition-transform text-center"
          >
            Book a Consultation
          </Link>
          <Link
            to="/about"
            className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-tight text-base sm:text-lg hover:bg-white/10 transition-colors text-center"
          >
            View Manifest
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
