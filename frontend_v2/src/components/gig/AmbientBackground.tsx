import { useMemo } from "react";

export function AmbientBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        left: (i * 37) % 100,
        delay: (i % 13) * 1.4,
        duration: 12 + (i % 7) * 2.5,
        size: 1 + (i % 3),
        top: (i * 53) % 100,
      })),
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute -left-40 -top-40 h-[46rem] w-[46rem] rounded-full opacity-45 blur-[130px]"
        style={{
          background: "radial-gradient(circle, #3B82F6 0%, transparent 65%)",
          animation: "blob-drift 26s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -right-56 top-1/4 h-[40rem] w-[40rem] rounded-full opacity-35 blur-[140px]"
        style={{
          background: "radial-gradient(circle, #8B5CF6 0%, transparent 65%)",
          animation: "blob-drift 32s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute bottom-[-18rem] left-1/3 h-[38rem] w-[38rem] rounded-full opacity-30 blur-[150px]"
        style={{
          background: "radial-gradient(circle, #06B6D4 0%, transparent 65%)",
          animation: "blob-drift 38s ease-in-out infinite",
        }}
      />
      <div className="absolute inset-0 grid-overlay opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white/60"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animation: `float-particle ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(59,130,246,0.16),transparent_60%)]" />
    </div>
  );
}
