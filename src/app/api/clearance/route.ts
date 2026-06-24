import { NextResponse } from "next/server";

/**
 * POST /api/clearance — the "request clearance" (waitlist) endpoint.
 *
 * Fully functional with zero backend: validates input, applies a best-effort
 * in-memory rate limit, and accepts the request. If CLEARANCE_WEBHOOK_URL is
 * set in the environment, each accepted request is forwarded there (Slack /
 * Zapier / email relay / sheet) — otherwise it is simply acknowledged.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const VALID_INTERESTS = new Set(["forge", "studio", "archie", "all"]);

// Best-effort per-instance rate limit (5 requests / 10 min / IP).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  // Prune stale entries so the map can't grow unbounded (time-based, not a wipe).
  if (hits.size > 2000) {
    for (const [key, ts] of hits) {
      const live = ts.filter((t) => now - t < WINDOW_MS);
      if (live.length) hits.set(key, live);
      else hits.delete(key);
    }
  }
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // Honeypot: silently accept bots without forwarding.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true, code: codeFor("bot") });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const name = String(body.name ?? "").trim().slice(0, 120);
  const role = String(body.role ?? "").trim().slice(0, 120);
  let interest = String(body.interest ?? "all").trim().toLowerCase();
  if (!VALID_INTERESTS.has(interest)) interest = "all";

  const record = {
    email,
    name: name || null,
    role: role || null,
    interest,
    ip,
    ua: req.headers.get("user-agent") ?? null,
    at: new Date().toISOString(),
  };

  const webhook = process.env.CLEARANCE_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ source: "archdisc/access", ...record }),
        signal: AbortSignal.timeout(4000),
      });
    } catch {
      // Never fail the visitor because a downstream relay hiccuped.
    }
  }

  return NextResponse.json({ ok: true, code: codeFor(email), interest });
}

/** A deterministic, shareable "clearance code" so the success state feels real. */
function codeFor(seed: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const n = (h >>> 0).toString(36).toUpperCase().padStart(6, "0").slice(0, 6);
  return `AD-${n}`;
}

export function GET() {
  return NextResponse.json(
    { ok: true, service: "clearance", method: "POST" },
    { status: 200 },
  );
}
