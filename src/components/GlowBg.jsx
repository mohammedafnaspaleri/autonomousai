export default function GlowBg({ className = "", opacity = 1 }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      // Fade the edges so the clipped glow never leaves a hard horizontal seam between sections
      style={{
        opacity,
        maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 72%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 72%, transparent 100%)",
      }}
    >
      <div
        className="absolute -top-40 left-1/2 h-[620px] w-[980px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.16), rgba(139,92,246,0.09) 50%, transparent 72%)", filter: "blur(50px)" }}
      />
      <div
        className="absolute -bottom-52 right-[-12%] h-[560px] w-[720px] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.11), rgba(59,130,246,0.05) 55%, transparent 72%)", filter: "blur(56px)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(148,163,255,0.06) 1px, transparent 1.4px)",
          backgroundSize: "42px 42px",
          maskImage: "radial-gradient(ellipse 90% 75% at 50% 40%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 75% at 50% 40%, black 30%, transparent 100%)",
        }}
      />
    </div>
  );
}
