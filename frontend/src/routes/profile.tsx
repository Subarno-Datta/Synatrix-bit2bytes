import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Award, Target, TrendingUp } from "lucide-react";
import { CountUp, PlatformMark, SectionHeading, TiltCard } from "@/components/gig/primitives";
import { badges, platformMeta } from "@/lib/gig-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — GigShield" },
      {
        name: "description",
        content:
          "Your GigShield profile: daily earning goal, preferred platforms, lifetime jobs and achievement badges.",
      },
      { property: "og:title", content: "Profile — GigShield" },
      {
        property: "og:description",
        content: "Goals, preferred platforms and fairness stats for your gig career.",
      },
    ],
  }),
  component: Profile,
});

const preferred = ["Swiggy", "Uber", "Rapido", "Blinkit"] as const;

function Profile() {
  const goalProgress = 68;

  return (
    <div className="space-y-14">
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
                <CountUp value={1284} />
              </p>
              <p className="text-[11px] text-muted-foreground">Jobs completed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#22C55E]">
                <CountUp value={92} suffix="%" />
              </p>
              <p className="text-[11px] text-muted-foreground">Avg fairness</p>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-6 lg:grid-cols-2">
        <TiltCard glow="#22C55E" className="p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-[#22C55E]/40 bg-[#22C55E]/15 text-[#22C55E]">
              <Target className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Daily earning goal</p>
              <p className="text-[11px] text-muted-foreground">₹1,500 target</p>
            </div>
          </div>
          <p className="mt-7 text-4xl font-extrabold tracking-tight">
            <CountUp value={1020} prefix="₹" />
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
            {goalProgress}% of today&apos;s goal · ₹480 to go
          </p>
        </TiltCard>

        <TiltCard glow="#06B6D4" delay={0.1} className="p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-[#06B6D4]/40 bg-[#06B6D4]/15 text-[#06B6D4]">
              <TrendingUp className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Preferred platforms</p>
              <p className="text-[11px] text-muted-foreground">Ranked by fairness rate</p>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            {preferred.map((p) => (
              <div
                key={p}
                className="flex items-center gap-2.5 rounded-2xl border border-border bg-white/[0.04] py-2 pl-2 pr-4"
              >
                <PlatformMark name={p} color={platformMeta[p].color} size={32} />
                <span className="text-xs font-medium">{p}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Uber holds the highest fairness rate at 96%, Rapido the lowest at 81%.
          </p>
        </TiltCard>
      </section>

      <section className="space-y-6">
        <SectionHeading eyebrow="Milestones" title="Achievement badges" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {badges.map((b, i) => (
            <TiltCard key={b.name} delay={i * 0.08} glow={b.color} className="p-6">
              <div className="flex items-center gap-4">
                <span
                  className="grid h-12 w-12 place-items-center rounded-2xl"
                  style={{
                    background: `linear-gradient(140deg, ${b.color}40, ${b.color}10)`,
                    border: `1px solid ${b.color}55`,
                    color: b.color,
                  }}
                >
                  <Award className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold">{b.name}</p>
                  <p className="text-[11px] text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>
    </div>
  );
}
