import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Award, Target, TrendingUp } from "lucide-react";
import { CountUp, PlatformMark, SectionHeading, TiltCard } from "@/components/gig/primitives";
import { badges } from "@/lib/gig-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — RideRight" },
      { name: "description", content: "Your RideRight profile: daily earning goal, preferred platforms, lifetime jobs and achievement badges." },
      { property: "og:title", content: "Profile — RideRight" },
      { property: "og:description", content: "Goals, preferred platforms and fairness stats for your gig career." },
    ],
  }),
  component: Profile,
});

const PLATFORM_COLORS: Record<string, string> = {
  Swiggy: "#F59E0B", Zomato: "#EF4444", Uber: "#22C55E",
  Rapido: "#8B5CF6", Blinkit: "#06B6D4",
};
const getColor = (p: string) => PLATFORM_COLORS[p] ?? "#3B82F6";

const DAILY_GOAL = 1500;

type ProfileData = {
  total_jobs: number;
  avg_fairness: number;
  total_earnings: number;
  today_earnings: number;
  platforms: { platform: string; avg_fairness: number; total_earnings: number; job_count: number }[];
  most_flagged_job: { id: string; platform: string; fare: number; expected: number; fairness_pct: number } | null;
};

function Profile() {
  const [data, setData] = useState<ProfileData | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/profile")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const totalJobs = data?.total_jobs ?? 0;
  const avgFairness = data?.avg_fairness ?? 0;
  const todayEarnings = data?.today_earnings ?? 0;
  const goalProgress = Math.min(Math.round((todayEarnings / DAILY_GOAL) * 100), 100);
  const toGo = Math.max(DAILY_GOAL - todayEarnings, 0);
  const platforms = data?.platforms ?? [];

  // derive initials from top platform or fallback
  const topPlatform = platforms[0]?.platform ?? "";

  return (
    <div className="space-y-14">
      {/* Hero card */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl glass p-8 md:p-12"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#3B82F6]/25 blur-[110px]" />
        <div className="relative flex flex-wrap items-center gap-7">
          <motion.div
            whileHover={{ rotate: 4, scale: 1.04 }}
            className="grid h-24 w-24 place-items-center rounded-3xl text-2xl font-extrabold text-white"
            style={{ background: "var(--gradient-brand)", boxShadow: "0 26px 70px -30px #3B82F6" }}
          >
            AR
          </motion.div>
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Arjun Rao</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Bengaluru · Gig worker since 2023 · Pro member
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-bold">
                <CountUp value={totalJobs} />
              </p>
              <p className="text-[11px] text-muted-foreground">Jobs completed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#22C55E]">
                <CountUp value={avgFairness} suffix="%" decimals={1} />
              </p>
              <p className="text-[11px] text-muted-foreground">Avg fairness</p>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-6 lg:grid-cols-2">
        {/* Daily goal */}
        <TiltCard glow="#22C55E" className="p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-[#22C55E]/40 bg-[#22C55E]/15 text-[#22C55E]">
              <Target className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Daily earning goal</p>
              <p className="text-[11px] text-muted-foreground">₹{DAILY_GOAL.toLocaleString("en-IN")} target</p>
            </div>
          </div>
          <p className="mt-7 text-4xl font-extrabold tracking-tight">
            <CountUp value={todayEarnings} prefix="₹" />
          </p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${goalProgress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #22C55E, #06B6D4)" }}
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {goalProgress}% of today&apos;s goal
            {toGo > 0 ? ` · ₹${toGo.toLocaleString("en-IN")} to go` : " · Goal reached! 🎉"}
          </p>
        </TiltCard>

        {/* Preferred platforms */}
        <TiltCard glow="#06B6D4" delay={0.1} className="p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-[#06B6D4]/40 bg-[#06B6D4]/15 text-[#06B6D4]">
              <TrendingUp className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Platforms</p>
              <p className="text-[11px] text-muted-foreground">Ranked by fairness rate</p>
            </div>
          </div>
          {platforms.length > 0 ? (
            <>
              <div className="mt-7 flex flex-wrap gap-3">
                {platforms.map((p) => (
                  <div
                    key={p.platform}
                    className="flex items-center gap-2.5 rounded-2xl border border-border bg-white/[0.04] py-2 pl-2 pr-4 transition-all duration-300 hover:border-primary/30 hover:bg-white/[0.06]"
                  >
                    <PlatformMark name={p.platform} color={getColor(p.platform)} size={32} />
                    <div>
                      <p className="text-xs font-medium">{p.platform}</p>
                      <p className="text-[10px] text-muted-foreground">{p.avg_fairness}% fair</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-muted-foreground">
                {platforms[0].platform} leads at {platforms[0].avg_fairness}% fairness
                {platforms.length > 1 ? `, ${platforms[platforms.length - 1].platform} lowest at ${platforms[platforms.length - 1].avg_fairness}%` : ""}.
              </p>
            </>
          ) : (
            <p className="mt-7 text-sm text-muted-foreground">Log some jobs to see platform rankings.</p>
          )}
        </TiltCard>
      </section>

      {/* Badges */}
      <section className="space-y-6">
        <SectionHeading eyebrow="Milestones" title="Achievement badges" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {badges.map((b, i) => {
            // unlock logic based on real data
            const unlocked =
              (b.name === "Fair Play" && avgFairness >= 90) ||
              (b.name === "Multi-Platform" && platforms.length >= 4) ||
              (b.name === "Dispute Winner" && (data?.most_flagged_job !== null)) ||
              (b.name === "Marathon" && (data?.total_jobs ?? 0) >= 10) ||
              (b.name === "Night Owl" && (data?.total_jobs ?? 0) >= 20);

            return (
              <TiltCard key={b.name} delay={i * 0.08} glow={unlocked ? b.color : "#ffffff22"} className="p-6">
                <div className="flex items-center gap-4">
                  <span
                    className="grid h-12 w-12 place-items-center rounded-2xl"
                    style={{
                      background: unlocked ? `linear-gradient(140deg, ${b.color}40, ${b.color}10)` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${unlocked ? b.color + "55" : "rgba(255,255,255,0.08)"}`,
                      color: unlocked ? b.color : "rgba(255,255,255,0.25)",
                    }}
                  >
                    <Award className="h-5 w-5" />
                  </span>
                  <div>
                    <p className={`text-sm font-bold ${!unlocked && "text-muted-foreground"}`}>{b.name}</p>
                    <p className="text-[11px] text-muted-foreground">{b.desc}</p>
                  </div>
                  {unlocked && (
                    <span className="ml-auto rounded-full bg-[#22C55E]/15 px-2 py-0.5 text-[10px] font-semibold text-[#22C55E]">
                      Unlocked
                    </span>
                  )}
                </div>
              </TiltCard>
            );
          })}
        </div>
      </section>
    </div>
  );
}
