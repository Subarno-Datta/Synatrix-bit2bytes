import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Check, CloudUpload, Keyboard, ScanLine, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { CountUp, SectionHeading, TiltCard } from "@/components/gig/primitives";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/log-job")({
  head: () => ({
    meta: [
      { title: "Log a Job — RideRight" },
      {
        name: "description",
        content: "Add a gig manually or drop a payout screenshot and let RideRight OCR read it.",
      },
      { property: "og:title", content: "Log a Job — RideRight" },
      {
        property: "og:description",
        content: "Manual entry or AI screenshot scanning for your gig payouts.",
      },
    ],
  }),
  component: LogJob,
});

type Mode = "none" | "manual" | "upload";

function LogJob() {
  const [mode, setMode] = useState<Mode>("none");

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl glass px-7 py-14 text-center md:px-16 md:py-20"
      >
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-[#3B82F6]/25 blur-[120px]" />
        <span className="relative inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.04] px-3 py-1 text-[11px] text-muted-foreground">
          <Sparkles className="h-3 w-3 text-[#8B5CF6]" /> Powered by RideRight OCR
        </span>
        <h1 className="relative mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight md:text-6xl">
          How would you like to log <span className="text-gradient">today&apos;s job?</span>
        </h1>
        <p className="relative mx-auto mt-5 max-w-lg text-[15px] text-muted-foreground">
          Two ways in, one fairness verdict out. Takes under ten seconds either way.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChoiceCard
          active={mode === "manual"}
          onClick={() => setMode("manual")}
          icon={<Keyboard className="h-6 w-6" />}
          tint="#3B82F6"
          title="Manual Entry"
          desc="Type the fare, distance and time. Best when the app already closed."
          delay={0.05}
        />
        <ChoiceCard
          active={mode === "upload"}
          onClick={() => setMode("upload")}
          icon={<CloudUpload className="h-6 w-6" />}
          tint="#8B5CF6"
          title="Upload Screenshot"
          desc="Drop your payout screenshot. Our scanner extracts every value."
          delay={0.15}
        />
      </div>

      <AnimatePresence mode="wait">
        {mode === "manual" ? <ManualForm key="manual" /> : null}
        {mode === "upload" ? <UploadFlow key="upload" /> : null}
      </AnimatePresence>
    </div>
  );
}

function ChoiceCard({
  icon,
  title,
  desc,
  tint,
  onClick,
  active,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tint: string;
  onClick: () => void;
  active: boolean;
  delay: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.985 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl glass p-8 text-left transition-all duration-300",
        active && "border-primary/45",
      )}
      style={active ? { boxShadow: `0 0 0 1px ${tint}66, 0 34px 80px -44px ${tint}` } : undefined}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
        style={{ background: tint }}
      />
      <div
        className="relative grid h-14 w-14 place-items-center rounded-2xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105"
        style={{
          background: `linear-gradient(140deg, ${tint}40, ${tint}12)`,
          border: `1px solid ${tint}55`,
          color: tint,
        }}
      >
        {icon}
      </div>
      <h3 className="relative mt-7 text-xl font-bold tracking-tight">{title}</h3>
      <p className="relative mt-2 max-w-sm text-sm text-muted-foreground">{desc}</p>
    </motion.button>
  );
}

const fields = [
  { id: "platform", label: "Platform", placeholder: "Swiggy" },
  { id: "fare", label: "Fare (₹)", placeholder: "148" },
  { id: "distance", label: "Distance (km)", placeholder: "6.2" },
  { id: "time", label: "Time (min)", placeholder: "24" },
  { id: "date", label: "Date", placeholder: "31 Jul 2026" },
];

function ManualForm() {
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSaving(true);
    try {
      const res = await fetch("http://localhost:8000/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: fd.get("platform"),
          fare: parseFloat(fd.get("fare") as string),
          distance: parseFloat(fd.get("distance") as string),
          minutes: parseFloat(fd.get("time") as string),
          date: fd.get("date") as string,
        }),
      });
      const data = await res.json();
      toast.success("Job saved", {
        description: `Fairness verdict: ${data.job.status} · ${data.job.fairness_pct}% of expected fare`,
      });
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error("Failed to save job", { description: "Check that the backend is running." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 46 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleSubmit}
      className="rounded-3xl glass p-7 md:p-10"
    >
      <SectionHeading eyebrow="Manual entry" title="Tell us about the gig" />
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {fields.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.07, duration: 0.5 }}
            className={cn("space-y-2", f.id === "date" && "md:col-span-2")}
          >
            <Label htmlFor={f.id} className="text-xs text-muted-foreground">
              {f.label}
            </Label>
            <Input
              id={f.id}
              name={f.id}
              placeholder={f.placeholder}
              className="h-12 rounded-2xl border-border bg-white/[0.04] px-4 text-sm transition-all duration-300 hover:border-primary/30 focus-visible:ring-primary/40"
            />
          </motion.div>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={saving}
        className="mt-8 w-full rounded-2xl px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-60 md:w-auto"
        style={{
          background: "var(--gradient-brand)",
          backgroundSize: "200% 200%",
          animation: "shimmer-x 4s linear infinite alternate",
          boxShadow: "0 20px 50px -24px #3B82F6",
        }}
      >
        {saving ? "Saving…" : "Save job"}
      </motion.button>
    </motion.form>
  );
}

function UploadFlow() {
  const [phase, setPhase] = useState<"idle" | "scanning" | "done">("idle");
  const [dragging, setDragging] = useState(false);
  const [scanned, setScanned] = useState<{ label: string; value: number; prefix?: string; suffix?: string; decimals?: number }[]>([]);
  const [verdict, setVerdict] = useState<{ status: string; pct: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    if (phase === "scanning") return;
    setPhase("scanning");
    setScanned([]);
    setVerdict(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("http://localhost:8000/api/jobs/scan", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      const job = data.job;
      setScanned([
        { label: "Fare", value: job.fare, prefix: "₹" },
        { label: "Distance", value: job.distance, suffix: " km", decimals: 1 },
        { label: "Time", value: job.minutes, suffix: " min" },
      ]);
      setVerdict({ status: job.status, pct: job.fairness_pct });
      setPhase("done");
      toast.success("Job saved successfully", {
        description: `Fairness verdict: ${job.status} · ${job.fairness_pct}% of expected fare`,
      });
    } catch {
      setPhase("idle");
      toast.error("Scan failed", { description: "Check that the backend is running." });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 46 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl glass p-7 md:p-10"
    >
      <SectionHeading eyebrow="Screenshot OCR" title="Drop your payout screenshot" />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
        }}
      />

      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
        onClick={() => fileRef.current?.click()}
        animate={{ scale: dragging ? 1.015 : 1 }}
        className={cn(
          "mt-8 cursor-pointer rounded-3xl border-2 border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center transition-all duration-300 hover:border-white/25 hover:bg-white/[0.045]",
          dragging && "border-primary/70 bg-primary/10",
        )}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-3xl border border-border bg-white/[0.05] text-primary"
        >
          <CloudUpload className="h-9 w-9" />
        </motion.div>
        <p className="mt-6 text-base font-semibold">Drag & drop or click to upload</p>
        <p className="mt-1 text-xs text-muted-foreground">PNG, JPG or HEIC up to 10 MB</p>
      </motion.div>

      <AnimatePresence>
        {phase !== "idle" ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
          >
            <motion.div
              layout
              className="relative overflow-hidden rounded-3xl border border-border bg-[#101828] p-6"
            >
              <div className="space-y-3">
                <div className="h-3 w-24 rounded-full bg-white/15" />
                <div className="h-9 w-40 rounded-xl bg-white/10" />
                <div className="h-3 w-32 rounded-full bg-white/10" />
                <div className="h-3 w-28 rounded-full bg-white/10" />
                <div className="mt-6 h-24 rounded-2xl bg-white/[0.06]" />
              </div>
              {phase === "scanning" ? (
                <motion.div
                  initial={{ top: "-10%" }}
                  animate={{ top: "110%" }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                  className="pointer-events-none absolute inset-x-0 h-16"
                  style={{
                    background: "linear-gradient(180deg, transparent, rgba(59,130,246,0.55), transparent)",
                    boxShadow: "0 0 40px 10px rgba(59,130,246,0.35)",
                  }}
                />
              ) : null}
              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <ScanLine className="h-4 w-4 text-primary" />
                {phase === "scanning" ? "Scanning image…" : "Scan complete"}
              </div>
            </motion.div>

            <div className="space-y-3">
              {scanned.map((d, i) => (
                <motion.div
                  key={d.label}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="flex items-center justify-between rounded-2xl border border-border bg-white/[0.04] px-5 py-4"
                >
                  <span className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#22C55E]/15 text-[#22C55E]">
                      <Check className="h-4 w-4" />
                    </span>
                    {d.label}
                  </span>
                  <span className="text-lg font-bold">
                    <CountUp value={d.value} prefix={d.prefix} suffix={d.suffix} decimals={d.decimals ?? 0} duration={1} />
                  </span>
                </motion.div>
              ))}

              <AnimatePresence>
                {phase === "done" && verdict ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="flex items-center gap-3 rounded-2xl border border-[#22C55E]/40 bg-[#22C55E]/10 px-5 py-4"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#22C55E] text-[#060816]">
                      <Check className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">Job saved successfully</p>
                      <p className="text-xs text-muted-foreground">
                        Fairness verdict: {verdict.status} · {verdict.pct}%
                      </p>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
