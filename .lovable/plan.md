# VIBE_LAB Portfolio — Build Plan

A single-page dark-mode portfolio for an AI Agent Developer / Vibe Coder, built from the selected "Cyber-premium minimalist" direction. Deep black (#050505) + lime accent (#CCFF00), Sora display + Inter body.

## Sections (in order)
1. **Sticky nav** — VIBE_LAB wordmark, anchor links (Work, Services, Philosophy), "Hire Me" outlined accent button.
2. **Hero** — "AI Agent Architect" pill, headline "Building Intelligent AI Agents That Scale Your Business", Vibe Coding sub-headline, two CTAs (Book a Consultation / View Manifest).
3. **Selected Deployments** — 2-column grid of 4 project cards with generated mockups, name, description, demo/code links.
4. **Services** — 3-column grid (AI Automation, Custom Web Apps, Intelligent Chatbots) styled to match the surface/outline language.
5. **Philosophy (About)** — Vibe Coding manifesto + 10x / 99% stat tiles + creator-studio image.
6. **Testimonials** — 3 quote cards on the surface tone for social proof.
7. **Contact** — Name/Email/Message form (client-side only, toast on submit) + GitHub / LinkedIn / X links.
8. **Footer** — wordmark, copyright, status dot.

## Technical notes
- Add Sora + Inter via `<link>` in `__root.tsx` head; do not `@import` URLs in CSS.
- Replace shadcn light tokens in `src/styles.css` with the direction's palette: `--background #050505`, `--foreground #fff`, `--card #121212`, `--primary #CCFF00` (black foreground), `--muted-foreground #888`, accent map. Map via `@theme inline` so utilities like `bg-background`, `text-accent` work. Define `--font-heading` and `--font-body` tokens.
- All content built in `src/routes/index.tsx` composed from small components in `src/components/portfolio/` (Nav, Hero, Projects, Services, Philosophy, Testimonials, Contact, Footer).
- Use Framer Motion (`motion`) for restrained entrance fades on section headings and card reveals — no scroll-jacking.
- Generate 3 images via `imagegen` (fast tier) into `src/assets/`: two project mockups + one creator-studio photo, using the prompts from the placeholder divs. Import as ES modules.
- Update `head()` in `src/routes/index.tsx`: title "Vibe Lab — AI Agent Developer & Vibe Coder", meta description, OG tags. Single H1 in hero.
- Mobile: nav collapses to logo + Hire Me; hero scales down; grids drop to single column at `md`.
- Use shadcn `Button`, `Input`, `Textarea`, `sonner` for the contact form; restyle to match (sharp corners, uppercase bold).
- No backend wired — contact form shows a toast. Mention Lovable Cloud as an optional next step if the user wants real email delivery.

## Out of scope (ask later)
- Real email/CRM integration for contact form
- CMS / dynamic project data
- Blog or case-study sub-pages
