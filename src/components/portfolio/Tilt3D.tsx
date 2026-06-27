import { useRef, type ReactNode, type MouseEvent } from "react";

export function Tilt3D({
  children,
  className = "",
  max = 12,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - y) * max;
    const ry = (x - 0.5) * max;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    if (glare) {
      el.style.setProperty("--glare-x", `${x * 100}%`);
      el.style.setProperty("--glare-y", `${y * 100}%`);
    }
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transition: "transform 0.25s ease-out",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className={`relative ${className}`}
    >
      {children}
      {glare && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
          style={{
            background:
              "radial-gradient(circle at var(--glare-x,50%) var(--glare-y,50%), rgba(204,255,0,0.18), transparent 50%)",
            mixBlendMode: "screen",
          }}
        />
      )}
    </div>
  );
}
