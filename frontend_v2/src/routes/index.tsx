import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { ArrowUpRight, Clock3, Layers, ShieldAlert, Wallet } from "lucide-react";
import { CountUp, PlatformMark, SectionHeading, TiltCard } from "@/components/gig/primitives";
import { platformMeta, statusMeta } from "@/lib/gig-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — RideRight" },
      { name: "description", content: "See total earnings, hours worked, platform breakdown and AI-flagged unfair payouts in one dashboard." },
      { property: "og:title", content: "Dashboard — RideRight" },
      { property: "og:description", content: "Unified gig earnings dashboard with AI fair-pay detection." },
    ],
  }),
  component: Dashboard,
});

type DashData = {
  stats: {
    total_earnings: number;
    total_hours: number;
    platforms_used: number;
    flagged_jobs: number;
    lost_earnings: number;
  };
  platform_earnings: { platform: string; amount: number; job_count: number }[];
  weekly: { day: string; earnings: number; fair: number }[];
};

type Job = {
  id: string; platform: string; fare: number; distance: number;
  minutes: number; date: string; status: string; expected: number; fairness_pct: number;
};

const PLATFORM_COLORS: Record<string, string> = {
  Swiggy: "#F59E0B", Zomato: "#EF4444", Uber: "#22C55E",
  Rapido: "#8B5CF6", Blinkit: "#06B6D4",
};
const getColor = (p: string) => PLATFORM_COLORS[p] ?? "#3B82F6";

function useDashboard() {
  const [data, setData] = useState<DashData | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
    fetch("http://localhost:8000/api/jobs?limit=6")
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs ?? []))
      .catch(() => {});
  }, []);

  return { data, jobs };
}

function Dashboard() {
  const { data, jobs } = useDashboard();

  const stats = data?.stats;
  const totalEarnings = stats?.total_earnings ?? 0;
  const totalHours = stats?.total_hours ?? 0;
  const platformsUsed = stats?.platforms_used ?? 0;
  const flaggedJobs = stats?.flagged_jobs ?? 0;
  const lostEarnings = stats?.lost_earnings ?? 0;

  // RideRight score: avg fairness across all jobs (derived from flagged ratio)
  const totalJobs = jobs.length;
  const fairScore = totalJobs > 0
    ? Math.round(((totalJobs - flaggedJobs) / totalJobs) * 100)
    : 91;

  const statCards = [
    { label: "Total Earnings", value: totalEarnings, prefix: "₹", icon: Wallet, tint: "#3B82F6", trend: lostEarnings > 0 ? `₹${lostEarnings} potentially lost` : "All payouts fair" },
    { label: "Hours Worked", value: totalHours, suffix: "h", icon: Clock3, tint: "#06B6D4", trend: `${totalJobs} jobs logged` },
    { label: "Platforms Used", value: platformsUsed, icon: Layers, tint: "#8B5CF6", trend: data?.platform_earnings[0] ? `${data.platform_earnings[0].platform} leads` : "No data yet" },
    { label: "Flagged Jobs", value: flaggedJobs, icon: ShieldAlert, tint: "#EF4444", trend: lostEarnings > 0 ? `₹${lostEarnings} potentially lost` : "Nothing flagged" },
  ];

  const weekly = data?.weekly ?? [];
  const platformEarnings = data?.platform_earnings ?? [];

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] shadow-[0_0_10px_#22C55E]" />
            Live sync across {platformsUsed || 4} platforms
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Every rupee you earn,
            <br />
            <span className="text-gradient">verified for fairness.</span>
          </h1>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            RideRight reads your payouts across Swiggy, Uber, Rapido and Blinkit, then flags the
            gigs that paid you less than they should have.
          </p>
        </motion.div>

        <div className="relative">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-0 hidden justify-end xl:flex">
            <div className="relative -mb-5 -mr-1 2xl:-mr-6">
              <div
                className="absolute left-1/2 top-[26%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[85px]"
                style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)", animation: "shield-glow-pulse 4.5s ease-in-out infinite" }}
              />
              <img
                src="/hero-rider.png"
                alt="RideRight rider"
                className="relative h-[38vh] max-h-[360px] min-h-[240px] w-auto object-contain"
                style={{ animation: "rider-float 5s ease-in-out infinite", maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)" }}
              />
            </div>
          </div>

          <TiltCard delay={0.2} glow="#8B5CF6" className="relative z-10 rounded-3xl p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              RideRight Score
            </p>
            <div className="mt-4 flex items-end gap-4">
              <p className="text-6xl font-extrabold tracking-tight">
                <CountUp value={fairScore} />
              </p>
              <span className="mb-2 text-sm text-muted-foreground">/ 100</span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${fairScore}%` }}
                transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full"
                style={{ background: "var(--gradient-brand)" }}
              />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Based on {totalJobs} logged gigs · {flaggedJobs} flagged
            </p>
          </TiltCard>
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s, i) => (
          <TiltCard key={s.label} delay={0.1 + i * 0.09} glow={s.tint}>
            <div className="flex items-start justify-between">
              <div
                className="grid h-11 w-11 place-items-center rounded-2xl transition-transform duration-300 group-hover:rotate-6"
                style={{ background: `linear-gradient(140deg, ${s.tint}40, ${s.tint}10)`, border: `1px solid ${s.tint}50`, color: s.tint }}
              >
                <s.icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-6 text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">
              <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} duration={1.6} decimals={s.suffix === "h" ? 1 : 0} />
            </p>
            <p className="mt-2 text-[11px] text-muted-foreground">{s.trend}</p>
          </TiltCard>
        ))}
      </section>

      {/* Weekly chart */}
      {weekly.length > 0 && (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Trend"
            title="Weekly earnings vs fair-pay baseline"
            sub="The dotted baseline is what our model expected you to be paid for the same work."
          />
          <TiltCard delay={0.1} className="p-6 md:p-8">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weekly} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="earnFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }} />
                  <Tooltip
                    cursor={{ stroke: "rgba(255,255,255,0.15)" }}
                    contentStyle={{ background: "rgba(16,24,40,0.92)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, backdropFilter: "blur(12px)", color: "white" }}
                  />
                  <Area type="monotone" dataKey="fair" stroke="#8B5CF6" strokeDasharray="5 5" strokeWidth={1.5} fill="transparent" animationDuration={1600} />
                  <Area type="monotone" dataKey="earnings" stroke="#3B82F6" strokeWidth={2.5} fill="url(#earnFill)" animationDuration={1800} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TiltCard>
        </section>
      )}

      {/* Platform breakdown */}
      {platformEarnings.length > 0 && (
        <section className="space-y-6">
          <SectionHeading eyebrow="Breakdown" title="Platform earnings" />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {platformEarnings.map((p, i) => {
              const color = getColor(p.platform);
              const meta = platformMeta[p.platform as keyof typeof platformMeta];
              return (
                <TiltCard key={p.platform} delay={i * 0.08} glow={color}>
                  <div className="flex items-center gap-3">
                    <PlatformMark name={p.platform} color={color} />
                    <div>
                      <p className="text-sm font-semibold">{p.platform}</p>
                      <p className="text-[11px] text-muted-foreground">{p.job_count} jobs</p>
                    </div>
                  </div>
                  <p className="mt-6 text-2xl font-bold tracking-tight">
                    <CountUp value={p.amount} prefix="₹" duration={1.5} />
                  </p>
                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min((p.amount / (platformEarnings[0]?.amount || 1)) * 100, 100)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${color}, ${color}66)` }}
                    />
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent jobs */}
      {jobs.length > 0 && (
        <section className="space-y-6">
          <SectionHeading eyebrow="Activity" title="Recent jobs" />
          <div className="space-y-3">
            {jobs.map((job, i) => {
              const color = getColor(job.platform);
              const meta = platformMeta[job.platform as keyof typeof platformMeta];
              const statusColor = statusMeta[job.status as keyof typeof statusMeta]?.color ?? "#3B82F6";
              const statusLabel = statusMeta[job.status as keyof typeof statusMeta]?.label ?? job.status;
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ x: 6 }}
                  className="flex flex-wrap items-center gap-4 rounded-3xl glass px-5 py-4 transition-colors hover:border-primary/30"
                >
                  <PlatformMark name={job.platform} color={color} size={40} />
                  <div className="min-w-[120px] flex-1">
                    <p className="text-sm font-semibold">{job.platform}</p>
                    <p className="text-[11px] text-muted-foreground">{job.id} · {job.date}</p>
                  </div>
                  <div className="hidden text-sm text-muted-foreground sm:block">{job.distance} km</div>
                  <div className="hidden text-sm text-muted-foreground sm:block">{job.minutes} min</div>
                  <div className="text-base font-bold">₹{job.fare}</div>
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-semibold"
                    style={{ color: statusColor, background: `${statusColor}1f`, border: `1px solid ${statusColor}44` }}
                  >
                    {statusLabel}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty state */}
      {jobs.length === 0 && !data && (
        <div className="rounded-3xl glass py-24 text-center">
          <p className="text-lg font-semibold">No jobs logged yet</p>
          <p className="mt-2 text-sm text-muted-foreground">Head to Log Job to add your first gig.</p>
        </div>
      )}
    </div>
  );
}
