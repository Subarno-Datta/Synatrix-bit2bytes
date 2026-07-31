import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, Clock3, Layers, ShieldAlert, Wallet } from "lucide-react";
import { CountUp, PlatformMark, SectionHeading, TiltCard } from "@/components/gig/primitives";
import { jobs, platformEarnings, platformMeta, statusMeta, weekly } from "@/lib/gig-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — GigShield" },
      {
        name: "description",
        content:
          "See total earnings, hours worked, platform breakdown and AI-flagged unfair payouts in one dashboard.",
      },
      { property: "og:title", content: "Dashboard — GigShield" },
      {
        property: "og:description",
        content: "Unified gig earnings dashboard with AI fair-pay detection.",
      },
    ],
  }),
  component: Dashboard,
});

const statCards = [
  { label: "Total Earnings", value: 7430, prefix: "₹", icon: Wallet, tint: "#3B82F6", trend: "+12.4% vs last week" },
  { label: "Hours Worked", value: 46, suffix: "h", icon: Clock3, tint: "#06B6D4", trend: "+3.1% vs last week" },
  { label: "Platforms Used", value: 4, icon: Layers, tint: "#8B5CF6", trend: "Swiggy leads at 33%" },
  { label: "Flagged Jobs", value: 6, icon: ShieldAlert, tint: "#EF4444", trend: "₹438 potentially lost" },
];

function Dashboard() {
  return (
    <div className="space-y-16">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] shadow-[0_0_10px_#22C55E]" />
            Live sync across 4 platforms
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Every rupee you earn,
            <br />
            <span className="text-gradient">verified for fairness.</span>
          </h1>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            GigShield reads your payouts across Swiggy, Uber, Rapido and Blinkit, then flags the
            gigs that paid you less than they should have.
          </p>
        </motion.div>

        <TiltCard delay={0.2} glow="#8B5CF6" className="rounded-3xl p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            GigShield Score
          </p>
          <div className="mt-4 flex items-end gap-4">
            <p className="text-6xl font-extrabold tracking-tight">
              <CountUp value={91} />
            </p>
            <span className="mb-2 text-sm text-muted-foreground">/ 100</span>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "91%" }}
              transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full"
              style={{ background: "var(--gradient-brand)" }}
            />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Higher than 78% of gig workers in Bengaluru this week.
          </p>
        </TiltCard>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s, i) => (
          <TiltCard key={s.label} delay={0.1 + i * 0.09} glow={s.tint}>
            <div className="flex items-start justify-between">
              <div
                className="grid h-11 w-11 place-items-center rounded-2xl transition-transform duration-300 group-hover:rotate-6"
                style={{
                  background: `linear-gradient(140deg, ${s.tint}40, ${s.tint}10)`,
                  border: `1px solid ${s.tint}50`,
                  color: s.tint,
                }}
              >
                <s.icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-6 text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">
              <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} duration={1.6} />
            </p>
            <p className="mt-2 text-[11px] text-muted-foreground">{s.trend}</p>
          </TiltCard>
        ))}
      </section>

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
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ stroke: "rgba(255,255,255,0.15)" }}
                  contentStyle={{
                    background: "rgba(16,24,40,0.92)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 16,
                    backdropFilter: "blur(12px)",
                    color: "white",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="fair"
                  stroke="#8B5CF6"
                  strokeDasharray="5 5"
                  strokeWidth={1.5}
                  fill="transparent"
                  animationDuration={1600}
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fill="url(#earnFill)"
                  animationDuration={1800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TiltCard>
      </section>

      <section className="space-y-6">
        <SectionHeading eyebrow="Breakdown" title="Platform earnings" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {platformEarnings.map((p, i) => {
            const meta = platformMeta[p.platform];
            const up = p.change >= 0;
            return (
              <TiltCard key={p.platform} delay={i * 0.08} glow={meta.color}>
                <div className="flex items-center gap-3">
                  <PlatformMark name={p.platform} color={meta.color} />
                  <div>
                    <p className="text-sm font-semibold">{p.platform}</p>
                    <p className="text-[11px] text-muted-foreground">{p.progress}% of goal</p>
                  </div>
                </div>
                <p className="mt-6 text-2xl font-bold tracking-tight">
                  <CountUp value={p.amount} prefix="₹" duration={1.5} />
                </p>
                <p
                  className="mt-1 text-xs font-medium"
                  style={{ color: up ? "#22C55E" : "#EF4444" }}
                >
                  {up ? "▲" : "▼"} {Math.abs(p.change)}% this week
                </p>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${p.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${meta.color}, ${meta.color}66)` }}
                  />
                </div>
              </TiltCard>
            );
          })}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading eyebrow="Activity" title="Recent jobs" />
        <div className="space-y-3">
          {jobs.slice(0, 6).map((job, i) => {
            const meta = platformMeta[job.platform];
            const status = statusMeta[job.status];
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
                <PlatformMark name={job.platform} color={meta.color} size={40} />
                <div className="min-w-[120px] flex-1">
                  <p className="text-sm font-semibold">{job.platform}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {job.id} · {job.date}
                  </p>
                </div>
                <div className="hidden text-sm text-muted-foreground sm:block">
                  {job.distance} km
                </div>
                <div className="hidden text-sm text-muted-foreground sm:block">
                  {job.minutes} min
                </div>
                <div className="text-base font-bold">₹{job.fare}</div>
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-semibold"
                  style={{
                    color: status.color,
                    background: `${status.color}1f`,
                    border: `1px solid ${status.color}44`,
                  }}
                >
                  {status.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
