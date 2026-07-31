import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Clock3, MapPin, Route as RouteIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PlatformMark, SectionHeading } from "@/components/gig/primitives";
import { jobs, platformMeta, statusMeta, type Fairness } from "@/lib/gig-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Job History — RideRight" },
      {
        name: "description",
        content: "Browse every logged gig with fare, distance, duration and AI fairness verdict.",
      },
      { property: "og:title", content: "Job History — RideRight" },
      {
        property: "og:description",
        content: "Every gig you logged, with fairness verdicts you can dispute.",
      },
    ],
  }),
  component: HistoryPage,
});

const filters: { key: "all" | Fairness; label: string }[] = [
  { key: "all", label: "All jobs" },
  { key: "fair", label: "Fair" },
  { key: "review", label: "Review" },
  { key: "underpaid", label: "Underpaid" },
];

function HistoryPage() {
  const [filter, setFilter] = useState<"all" | Fairness>("all");
  const visible = jobs.filter((j) => filter === "all" || j.status === filter);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Archive"
          title="Your job history"
          sub="Each card carries the AI verdict for that payout. Hover to open the full analysis."
        />
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <motion.button
              key={f.key}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full border border-border bg-white/[0.04] px-4 py-2 text-xs font-medium text-muted-foreground transition-all duration-300 hover:text-foreground",
                filter === f.key && "border-primary/50 bg-primary/15 text-foreground",
              )}
            >
              {f.label}
            </motion.button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-3xl glass py-24 text-center">
          <p className="text-lg font-semibold">Nothing here yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            No gigs match this filter — a good sign, actually.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((job, i) => {
            const meta = platformMeta[job.platform];
            const status = statusMeta[job.status];
            const diff = job.fare - job.expected;
            return (
              <motion.article
                key={job.id}
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-3xl glass p-6"
                style={{ ["--tint" as string]: status.color }}
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ boxShadow: `0 0 0 1px ${status.color}55, 0 34px 80px -46px ${status.color}` }}
                />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <PlatformMark name={job.platform} color={meta.color} />
                    <div>
                      <p className="text-sm font-semibold">{job.platform}</p>
                      <p className="text-[11px] text-muted-foreground">{job.date}</p>
                    </div>
                  </div>
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
                </div>

                <p className="relative mt-6 text-3xl font-bold tracking-tight">₹{job.fare}</p>
                <p
                  className="relative mt-1 text-xs"
                  style={{ color: diff >= 0 ? "#22C55E" : "#EF4444" }}
                >
                  {diff >= 0 ? "+" : "−"}₹{Math.abs(diff)} vs expected ₹{job.expected}
                </p>

                <div className="relative mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <RouteIcon className="h-3.5 w-3.5" /> {job.distance} km
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" /> {job.minutes} min
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {job.id}
                  </span>
                </div>

                <div className="relative mt-6 h-10 overflow-hidden">
                  <motion.button
                    onClick={async () => {
                      if (diff >= 0) {
                        toast(`AI analysis · ${job.id}`, { description: "Payout matched the distance/time model within tolerance." });
                        return;
                      }
                      try {
                        const res = await fetch("http://localhost:8000/api/complaint", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ job_id: job.id }),
                        });
                        const data = await res.json();
                        toast(`Dispute draft · ${job.id}`, { description: data.draft });
                      } catch {
                        toast(`AI analysis · ${job.id}`, { description: `Shortfall of ₹${Math.abs(diff)} detected — eligible to dispute.` });
                      }
                    }}
                    initial={false}
                    className="flex w-full translate-y-12 items-center justify-center gap-2 rounded-2xl border border-border bg-white/[0.06] py-2.5 text-xs font-semibold transition-transform duration-300 group-hover:translate-y-0"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#8B5CF6]" />
                    View AI analysis
                  </motion.button>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
