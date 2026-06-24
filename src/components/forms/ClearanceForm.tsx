"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "ok" | "error";
const INTERESTS = [
  { key: "all", label: "Everything" },
  { key: "forge", label: "Forge" },
  { key: "studio", label: "Studio" },
  { key: "archie", label: "Archie" },
];

/** Request-clearance (waitlist) form → POST /api/clearance. `full` shows the
 *  name/role/interest fields; otherwise it's a single-line email capture. */
export function ClearanceForm({
  full = false,
  defaultInterest = "all",
  className,
}: {
  full?: boolean;
  defaultInterest?: string;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [interest, setInterest] = useState(defaultInterest);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/clearance", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          name: data.get("name") || undefined,
          role: data.get("role") || undefined,
          interest,
          company: data.get("company") || undefined, // honeypot
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setStatus("error");
        setMessage(json.error ?? "Something went wrong. Try again.");
        return;
      }
      setStatus("ok");
      setCode(json.code ?? "");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  if (status === "ok") {
    return (
      <div
        className={cn(
          "rounded-xl border border-signal/30 bg-surface/70 p-6 backdrop-blur-sm",
          className,
        )}
      >
        <div className="flex items-center gap-2 text-signal">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-signal/15">
            <Check size={16} />
          </span>
          <span className="font-display text-h4 text-ink">You&rsquo;re on the list.</span>
        </div>
        <p className="mt-3 text-body-sm text-muted">
          Clearance request received. When the signal goes live, you&rsquo;ll be among the
          first through the door.
        </p>
        {code && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2 font-mono text-[13px] tracking-[0.1em] text-ink">
            <span className="text-faint">CLEARANCE</span>
            <span className="iris-text font-semibold">{code}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)} noValidate>
      {/* honeypot — visually hidden, off the tab order */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {full && (
        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          <Field name="name" label="Name" placeholder="Ada Lovelace" />
          <Field name="role" label="What you build" placeholder="Mechanical engineer" />
        </div>
      )}

      {full && (
        <div className="mb-3">
          <span className="u-label mb-2 block text-faint">Most interested in</span>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((it) => (
              <button
                key={it.key}
                type="button"
                aria-pressed={interest === it.key}
                onClick={() => setInterest(it.key)}
                className={cn(
                  "rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors",
                  interest === it.key
                    ? "border-transparent iris-fill text-white"
                    : "border-line text-muted hover:border-ink/30 hover:text-ink",
                )}
              >
                {it.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@where-you-build.com"
          aria-label="Email address"
          className="h-12 min-w-0 flex-1 rounded-xl border border-line-strong bg-surface px-4 text-[15px] text-ink placeholder:text-faint focus:border-iris-magenta/50 focus:outline-none focus:ring-2 focus:ring-iris-magenta/20"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="iris-fill group inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-medium text-white transition-transform [background-size:160%_160%] hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-12px_rgba(216,60,200,0.55)] disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Request clearance"}
          <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <p
        className={cn(
          "mt-2.5 text-body-sm",
          status === "error" ? "text-iris-coral" : "text-faint",
        )}
      >
        {status === "error"
          ? message
          : "No spam. One signal when the door opens. Nothing leaves your machine."}
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  placeholder,
}: {
  name: string;
  label: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="u-label mb-1.5 block text-faint">{label}</span>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        autoComplete="off"
        className="h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-[14px] text-ink placeholder:text-faint focus:border-iris-magenta/50 focus:outline-none focus:ring-2 focus:ring-iris-magenta/20"
      />
    </label>
  );
}
