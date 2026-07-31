import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, Sparkles } from "lucide-react";
import { CountUp, SectionHeading, TiltCard } from "@/components/gig/primitives";

export const Route = createFileRoute("/copilot")({
  head: () => ({
    meta: [
      { title: "AI Copilot — RideRight" },
      { name: "description", content: "Ask RideRight's AI copilot why a gig was flagged, compare platforms and find your best earning windows." },
      { property: "og:title", content: "AI Copilot — RideRight" },
      { property: "og:description", content: "A financial advisor for gig workers, powered by your own payout data." },
    ],
  }),
  component: Copilot,
});

const toneColor = {
  primary: "#3B82F6",
  cyan: "#06B6D4",
  purple: "#8B5CF6",
  warning: "#F59E0B",
} as const;

type InsightTone = keyof typeof toneColor;

type InsightCard = { title: string; body: string; tone: InsightTone };

type FlaggedJob = {
  id: string; platform: string; fare: number; expected: number;
  fairness_pct: number; distance: number; minutes: number;
};

function useInsights() {
  const [summary, setSummary] = useState("");
  const [weekData, setWeekData] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("http://localhost:8000/api/insights")
      .then((r) => r.json())
      .then((d) => {
        setSummary(d.summary ?? "");
        setWeekData(d.week_data ?? {});
      })
      .catch(() => {});
  }, []);

  return { summary, weekData };
}

function useFlaggedJob() {
  const [job, setJob] = useState<FlaggedJob | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/jobs?limit=100")
      .then((r) => r.json())
      .then((d) => {
        const jobs: FlaggedJob[] = d.jobs ?? [];
        const flagged = jobs.filter((j) => j.fare < j.expected);
        if (flagged.length > 0) {
          const worst = flagged.reduce((a, b) => (a.fairness_pct < b.fairness_pct ? a : b));
          setJob(worst);
        }
      })
      .catch(() => {});
  }, []);

  return job;
}

// Build insight cards from real week data
function buildInsights(weekData: Record<string, number>): InsightCard[] {
  const cards: InsightCard[] = [];
  const { total_earned, flagged_count, total_jobs, total_hours, worst_day, worst_day_ratio } = weekData as any;

  if (total_earned > 0) {
    cards.push({
      title: `₹${total_earned?.toLocaleString("en-IN")} earned this period`,
      body: `Across ${total_jobs} gigs totalling ${total_hours}h of work.`,
      tone: "primary",
    });
  }
  if (flagged_count > 0) {
    cards.push({
      title: `${flagged_count} underpaid gig${flagged_count > 1 ? "s" : ""} detected`,
      body: `${Math.round((flagged_count / (total_jobs || 1)) * 100)}% of your jobs were below the fair-pay baseline.`,
      tone: "warning",
    });
  }
  if (worst_day && worst_day !== "N/A") {
    cards.push({
      title: `Worst day: ${worst_day}`,
      body: `Average fairness was only ${worst_day_ratio}% — consider avoiding that time slot.`,
      tone: "purple",
    });
  }
  if (total_hours > 0) {
    cards.push({
      title: `₹${Math.round(total_earned / total_hours)}/hr average`,
      body: "Compare this across platforms in the chat below to find your best earning window.",
      tone: "cyan",
    });
  }
  return cards;
}

function useTypewriter(text: string) {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    if (!text) return;
    setDisplay("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setDisplay(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [text]);
  return display;
}

function Copilot() {
  const { summary, weekData } = useInsights();
  const insightCards = buildInsights(weekData);

  return (
    <div className="space-y-16">
      <HeroOrb summary={summary} />

      {insightCards.length > 0 && (
        <section className="space-y-6">
          <SectionHeading eyebrow="Signals" title="AI insight cards" />
          <div className="grid gap-5 md:grid-cols-2">
            {insightCards.map((ins, i) => (
              <TiltCard key={ins.title} delay={i * 0.1} glow={toneColor[ins.tone]}>
                <div
                  className="grid h-10 w-10 place-items-center rounded-2xl"
                  style={{
                    background: `linear-gradient(140deg, ${toneColor[ins.tone]}40, ${toneColor[ins.tone]}10)`,
                    border: `1px solid ${toneColor[ins.tone]}50`,
                    color: toneColor[ins.tone],
                  }}
                >
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight">{ins.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ins.body}</p>
              </TiltCard>
            ))}
          </div>
        </section>
      )}

      <FairnessAnalysis />
      <ChatPanel />
    </div>
  );
}

function HeroOrb({ summary }: { summary: string }) {
  const typed = useTypewriter(
    summary || "Analysing your gigs… log some jobs to get your weekly briefing."
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative grid gap-10 overflow-hidden rounded-3xl glass px-7 py-12 md:grid-cols-[0.8fr_1.2fr] md:items-center md:px-14 md:py-16"
    >
      <div className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#8B5CF6]/30 blur-[110px]" />
      <div className="relative mx-auto">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative grid h-44 w-44 place-items-center rounded-full"
          style={{
            background: "conic-gradient(from 0deg, #3B82F6, #06B6D4, #8B5CF6, #3B82F6)",
            filter: "blur(0.4px)",
            boxShadow: "0 0 90px -10px #3B82F6",
          }}
        >
          <div className="grid h-32 w-32 place-items-center rounded-full bg-[#060816]/85 backdrop-blur-xl">
            <Bot className="h-10 w-10 text-primary" />
          </div>
        </motion.div>
      </div>
      <div className="relative">
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Weekly briefing
        </span>
        <p className="mt-4 whitespace-pre-line text-xl font-semibold leading-relaxed tracking-tight md:text-[26px]">
          {typed}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.7, repeat: Infinity }}
            className="ml-0.5 inline-block h-6 w-[3px] translate-y-1 bg-primary"
          />
        </p>
      </div>
    </motion.section>
  );
}

function FairnessAnalysis() {
  const job = useFlaggedJob();
  const score = job ? Math.round(job.fairness_pct) : null;
  const r = 64;
  const c = 2 * Math.PI * r;

  if (!job || score === null) return null;

  const diff = job.fare - job.expected;

  return (
    <section className="space-y-6">
      <SectionHeading eyebrow="Deep dive" title={`Fairness analysis · ${job.id}`} />
      <TiltCard className="p-8 md:p-10">
        <div className="grid gap-10 md:grid-cols-[auto_1fr] md:items-center">
          <div className="relative mx-auto grid h-44 w-44 place-items-center">
            <svg width="176" height="176" className="-rotate-90">
              <circle cx="88" cy="88" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
              <motion.circle
                cx="88" cy="88" r={r}
                stroke="url(#ring)" strokeWidth="12" strokeLinecap="round" fill="none"
                strokeDasharray={c}
                initial={{ strokeDashoffset: c }}
                whileInView={{ strokeDashoffset: c - (c * score) / 100 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              />
              <defs>
                <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="60%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute text-center">
              <p className="text-4xl font-extrabold"><CountUp value={score} /></p>
              <p className="text-[11px] text-muted-foreground">Fairness score</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Expected fare", value: `₹${job.expected}`, tint: "#06B6D4" },
              { label: "Actual fare", value: `₹${job.fare}`, tint: "#F59E0B" },
              { label: "Difference", value: `${diff >= 0 ? "+" : "−"}₹${Math.abs(diff).toFixed(0)}`, tint: diff >= 0 ? "#22C55E" : "#EF4444" },
            ].map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 * i, duration: 0.5 }}
                className="rounded-2xl border border-border bg-white/[0.04] p-5"
              >
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="mt-2 text-2xl font-bold" style={{ color: m.tint }}>{m.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </TiltCard>
    </section>
  );
}

const suggestions = [
  "Why was this ride flagged?",
  "Compare all my platforms.",
  "Show earning trends.",
  "Which platform is best?",
];

type Msg = { role: "user" | "ai"; text: string };

function ChatPanel() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Ask me anything about your gigs, payouts or platform strategy." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "ai", text: data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "AI temporarily unavailable. Please try again." }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <section className="space-y-6">
      <SectionHeading eyebrow="Chat" title="Talk to your copilot" />
      <div className="rounded-3xl glass p-6 md:p-8">
        <div className="flex max-h-[440px] min-h-[260px] flex-col gap-4 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={m.role === "user" ? "flex justify-end" : "flex gap-3"}
              >
                {m.role === "ai" ? (
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                ) : null}
                <p className={m.role === "user"
                  ? "max-w-[80%] rounded-3xl rounded-br-lg bg-primary px-5 py-3 text-sm leading-relaxed text-primary-foreground"
                  : "max-w-[85%] text-sm leading-relaxed text-foreground/90"
                }>
                  {m.text}
                </p>
              </motion.div>
            ))}
            {typing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-sm text-muted-foreground">
                {[0, 1, 2].map((d) => (
                  <motion.span key={d} animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }} className="h-1.5 w-1.5 rounded-full bg-primary" />
                ))}
                Thinking…
              </motion.div>
            ) : null}
          </AnimatePresence>
          <div ref={endRef} />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <motion.button key={s} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} onClick={() => send(s)}
              className="rounded-full border border-border bg-white/[0.04] px-4 py-2 text-xs text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-foreground">
              {s}
            </motion.button>
          ))}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-white/[0.04] p-2 pl-5 transition-all duration-300 focus-within:border-primary/40 focus-within:shadow-[0_0_0_1px_oklch(0.623_0.188_259.8/0.15),0_12px_30px_-18px_oklch(0.623_0.188_259.8/0.5)]"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a payout, platform or trend…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }} type="submit"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white" style={{ background: "var(--gradient-brand)" }}>
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        </form>
      </div>
    </section>
  );
}
