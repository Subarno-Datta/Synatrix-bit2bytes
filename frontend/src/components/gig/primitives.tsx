import { motion, useMotionValue, useSpring, useTransform, type MotionStyle } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TiltCard({
  children,
  className,
  delay = 0,
  glow = "var(--primary)",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  glow?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 180, damping: 18 });
  const sy = useSpring(my, { stiffness: 180, damping: 18 });
  const rotateY = useTransform(sx, [0, 1], [-3.5, 3.5]);
  const rotateX = useTransform(sy, [0, 1], [3.5, -3.5]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      whileHover={{ y: -6 }}
      style={{ rotateX, rotateY, transformPerspective: 1000 } as MotionStyle}
      className={cn(
        "group relative rounded-3xl glass p-6 transition-shadow duration-500 hover:shadow-[0_0_0_1px_var(--tw-glow),0_30px_70px_-30px_var(--tw-glow)]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          boxShadow: `0 0 0 1px color-mix(in oklab, ${glow} 45%, transparent), 0 30px 80px -40px ${glow}`,
        }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

export function CountUp({
  value,
  duration = 1.4,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span className="tabular-nums">
      {prefix}
      {display.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-2xl"
    >
      {eyebrow ? (
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      {sub ? <p className="mt-2 text-sm text-muted-foreground">{sub}</p> : null}
    </motion.div>
  );
}

export function PlatformMark({ name, color, size = 44 }: { name: string; color: string; size?: number }) {
  return (
    <motion.div
      whileHover={{ rotate: 8, scale: 1.06 }}
      transition={{ type: "spring", stiffness: 320, damping: 14 }}
      className="grid shrink-0 place-items-center rounded-2xl text-xs font-bold"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(140deg, ${color}44, ${color}12)`,
        border: `1px solid ${color}55`,
        color,
        boxShadow: `0 12px 30px -18px ${color}`,
      }}
    >
      {name.slice(0, 2).toUpperCase()}
    </motion.div>
  );
}
