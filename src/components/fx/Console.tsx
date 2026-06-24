"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Line = { kind: "in" | "out" | "sys"; text: string };

const BANNER = [
  "ArchDisc // console — clearance terminal v0.3",
  'type "help" for commands · esc to close',
];

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];

export function Console() {
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [lines, setLines] = useState<Line[]>(() => BANNER.map((t) => ({ kind: "sys", text: t })));
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const router = useRouter();

  // Clear any pending navigation timers if the console ever unmounts.
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const nav = useCallback(
    (path: string) => {
      timers.current.push(
        setTimeout(() => {
          setOpen(false);
          router.push(path);
        }, 360),
      );
    },
    [router],
  );

  const push = useCallback((next: Line[]) => setLines((p) => [...p, ...next]), []);

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase();
      const out = (text: string): Line => ({ kind: "out", text });
      const echo: Line = { kind: "in", text: raw };
      if (!cmd) {
        push([echo]);
        return;
      }
      let res: Line[] = [];
      switch (cmd) {
        case "help":
          res = [
            "commands:",
            "  systems        list the three systems + status",
            "  forge / studio / archie    open a dossier",
            "  signal         time to public release",
            "  clearance      request access",
            "  whoami         your clearance level",
            "  unlock         attempt elevation",
            "  manifesto      read the manifesto",
            "  clear          wipe the buffer",
          ].map(out);
          break;
        case "systems":
        case "ls":
          res = [
            "SYS-01  forge   · native CAD kernel        [ classified ]",
            "SYS-02  studio  · creation surface         [ classified ]",
            "SYS-00  archie  · the model that drives it  [ classified ]",
          ].map(out);
          break;
        case "forge":
        case "studio":
        case "archie":
          res = [out(`routing → /${cmd} …`)];
          nav(`/${cmd}`);
          break;
        case "manifesto":
          res = [out("routing → /manifesto …")];
          nav("/manifesto");
          break;
        case "signal":
          res = [out("public signal: approaching. run `clearance` to be there first.")];
          break;
        case "clearance":
        case "access":
          res = [out("routing → /access …")];
          nav("/access");
          break;
        case "whoami":
          res = [out(unlocked ? "guest · clearance: GRANTED (you found the sequence)" : "guest · clearance: PENDING")];
          break;
        case "unlock":
          res = unlocked
            ? [out("already elevated. nice.")]
            : [out("denied. (hint: a very old code — up up down down …)")];
          break;
        case "sudo build":
        case "sudo":
          res = [out("permission denied: the kernel isn't yours to run yet. soon.")];
          break;
        case "decrypt":
          res = [out("everything here decrypts if you look at it long enough.")];
          break;
        case "clear":
          setLines([]);
          return;
        case "exit":
        case "close":
          setOpen(false);
          return;
        default:
          res = [out(`command not found: ${cmd} — try "help"`)];
      }
      push([echo, ...res]);
    },
    [push, nav, unlocked],
  );

  // Backtick toggles the console (unless typing in a field). Konami unlocks.
  useEffect(() => {
    let seq: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);

      if ((e.key === "`" || e.key === "~") && !typing) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") setOpen(false);

      if (!typing) {
        seq = [...seq, e.key].slice(-KONAMI.length);
        if (seq.join(",").toLowerCase() === KONAMI.join(",").toLowerCase()) {
          setUnlocked(true);
          setOpen(true);
          push([{ kind: "sys", text: "★ sequence accepted — clearance elevated (demo). welcome, operator." }]);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [push]);

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, open]);

  if (!open) {
    return unlocked ? (
      <span className="pointer-events-none fixed bottom-4 left-4 z-[60] rounded-full border border-signal/40 bg-vault/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-signal">
        clearance · granted
      </span>
    ) : null;
  }

  return (
    <div
      role="dialog"
      aria-label="ArchDisc console"
      className="fixed inset-x-0 bottom-0 z-[70] mx-auto max-w-3xl px-3 pb-3"
    >
      <div
        data-theme="vault"
        className="overflow-hidden rounded-xl border border-line-strong bg-vault/95 shadow-2xl backdrop-blur-md"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
            archdisc // console
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close console"
            className="font-mono text-[11px] text-muted hover:text-ink"
          >
            esc ✕
          </button>
        </div>
        <div ref={scrollRef} className="max-h-[44vh] overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed">
          {lines.map((l, i) => (
            <div
              key={i}
              className={
                l.kind === "in"
                  ? "text-ink"
                  : l.kind === "sys"
                    ? "text-signal"
                    : "whitespace-pre-wrap text-muted"
              }
            >
              {l.kind === "in" ? <span className="text-iris-magenta">› </span> : null}
              {l.text}
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(value);
            setValue("");
          }}
          className="flex items-center gap-2 border-t border-line px-4 py-2.5"
        >
          <span className="font-mono text-[12.5px] text-iris-magenta">›</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            placeholder="help"
            aria-label="Console input"
            className="min-w-0 flex-1 bg-transparent font-mono text-[12.5px] text-ink placeholder:text-faint focus:outline-none"
          />
        </form>
      </div>
    </div>
  );
}
