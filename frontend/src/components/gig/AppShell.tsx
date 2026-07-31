import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  Bell,
  Command,
  Gauge,
  History,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  Search,
  Sparkles,
  UserRound,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { AmbientBackground } from "./AmbientBackground";
import { cn } from "@/lib/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const nav = [
  { to: "/", label: "Dashboard", icon: Gauge },
  { to: "/log-job", label: "Log Job", icon: PlusCircle },
  { to: "/history", label: "History", icon: History },
  { to: "/copilot", label: "AI Copilot", icon: Sparkles },
  { to: "/profile", label: "Profile", icon: UserRound },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative min-h-screen">
      <AmbientBackground />

      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1, width: open ? 264 : 84 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-y-0 left-0 z-40 hidden flex-col gap-2 border-r border-border/70 bg-[oklch(0.16_0.034_266/0.72)] p-4 backdrop-blur-2xl lg:flex"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center gap-3 px-2 pt-2"
        >
          <div
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl"
            style={{
              background: "var(--gradient-brand)",
              boxShadow: "0 14px 40px -18px #3B82F6",
            }}
          >
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <AnimatePresence>
            {open ? (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="leading-tight"
              >
                <p className="text-[15px] font-bold tracking-tight">GigShield</p>
                <p className="text-[11px] text-muted-foreground">Fair pay, verified</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>

        <nav className="flex flex-1 flex-col gap-1.5">
          {nav.map((item, i) => {
            const active = pathname === item.to;
            return (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }}
              >
                <Link
                  to={item.to}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                    active && "text-foreground",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-2xl border border-border bg-white/5"
                      style={{ boxShadow: "0 14px 40px -26px #3B82F6" }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <item.icon
                    className={cn(
                      "relative h-[18px] w-[18px] shrink-0 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110",
                      active && "text-primary",
                    )}
                  />
                  {open ? <span className="relative">{item.label}</span> : null}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
        >
          {open ? <PanelLeftClose className="h-[18px] w-[18px]" /> : <PanelLeftOpen className="h-[18px] w-[18px]" />}
          {open ? "Collapse" : null}
        </button>
      </motion.aside>

      <div
        className="transition-[padding] duration-500 lg:pl-[var(--sidebar-w)]"
        style={{ ["--sidebar-w" as string]: open ? "264px" : "84px" }}
      >
        <motion.header
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 bg-[oklch(0.14_0.036_267/0.6)] px-5 py-3.5 backdrop-blur-2xl md:px-10"
        >
          <button
            onClick={() => setPaletteOpen(true)}
            className="group flex flex-1 items-center gap-2 rounded-2xl border border-border bg-white/[0.04] px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-white/[0.06] md:max-w-md"
          >
            <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="flex-1 text-left">Search jobs, platforms, insights…</span>
            <kbd className="hidden items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-[10px] md:flex">
              <Command className="h-3 w-3" />K
            </kbd>
          </button>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.08, rotate: -8 }}
              whileTap={{ scale: 0.94 }}
              className="relative grid h-10 w-10 place-items-center rounded-2xl border border-border bg-white/[0.04]"
            >
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#EF4444] shadow-[0_0_10px_#EF4444]" />
            </motion.button>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-white/[0.04] py-1.5 pl-1.5 pr-3.5">
              <div
                className="grid h-8 w-8 place-items-center rounded-xl text-xs font-bold text-white"
                style={{ background: "var(--gradient-brand)" }}
              >
                AR
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-xs font-semibold">Arjun Rao</p>
                <p className="text-[10px] text-muted-foreground">Pro member</p>
              </div>
            </div>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-[1400px] px-5 pb-24 pt-8 md:px-10 md:pt-12"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>

      <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
        <CommandInput placeholder="Jump to…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {nav.map((item) => (
              <CommandItem key={item.to} value={item.label} onSelect={() => setPaletteOpen(false)} asChild>
                <Link to={item.to} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
