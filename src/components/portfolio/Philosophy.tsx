import { motion } from "framer-motion";
import studioImg from "@/assets/creator-studio.jpg";
import { useSection } from "@/lib/site-content";

export function Philosophy() {
  const p = useSection("philosophy");
  return (
    <section id="philosophy" className="py-24 bg-surface border-y border-white/5 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-8 italic">
            {p.heading}
          </h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
            {p.body}
          </div>
          <div className="grid grid-cols-2 gap-4 pt-8 max-w-md">
            <div className="p-5 border border-white/10 bg-background">
              <div className="text-accent font-extrabold text-3xl">{p.stat1_value}</div>
              <div className="text-[10px] uppercase tracking-widest mt-2 text-muted-foreground">
                {p.stat1_label}
              </div>
            </div>
            <div className="p-5 border border-white/10 bg-background">
              <div className="text-accent font-extrabold text-3xl">{p.stat2_value}</div>
              <div className="text-[10px] uppercase tracking-widest mt-2 text-muted-foreground">
                {p.stat2_label}
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="w-full aspect-[4/5] bg-background outline outline-1 -outline-offset-1 outline-white/5 overflow-hidden"
        >
          <img
            src={p.image_url || studioImg}
            alt="Creator studio"
            loading="lazy"
            width={1024}
            height={1280}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
