import { motion } from "framer-motion";
import studioImg from "@/assets/creator-studio.jpg";

export function Philosophy() {
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
            The Vibe Coding Philosophy
          </h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
            <p>
              Traditional dev is too slow.{" "}
              <span className="text-white font-medium">Vibe Coding</span> is the art of using AI to
              bridge the gap between imagination and production at terminal velocity.
            </p>
            <p>
              I build systems that don't just follow logic—they anticipate user intent. Cleaner
              stacks, faster shipping, zero friction.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-8 max-w-md">
            <div className="p-5 border border-white/10 bg-background">
              <div className="text-accent font-extrabold text-3xl">10×</div>
              <div className="text-[10px] uppercase tracking-widest mt-2 text-muted-foreground">
                Deployment Speed
              </div>
            </div>
            <div className="p-5 border border-white/10 bg-background">
              <div className="text-accent font-extrabold text-3xl">99%</div>
              <div className="text-[10px] uppercase tracking-widest mt-2 text-muted-foreground">
                Uptime SLA
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
            src={studioImg}
            alt="Creator studio — mechanical keyboard and curved monitor"
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
