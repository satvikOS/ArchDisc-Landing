/**
 * Centralized, ground-truth copy for the ArchDisc landing page.
 * Every line is specific and codebase-evidenced — no generic SaaS filler,
 * no unverified bench numbers, no fake customer logos.
 * TODO(satvik): confirm APP_URL (real open / download entry point) and the
 *   production domain in app/layout.tsx (metadataBase).
 */

export const APP_URL = "https://app.archdisc.com";
export const WATCH_URL = APP_URL; // "See Archie build" / "Watch it work"

export const nav = {
  links: [
    { href: "#top", label: "Platform" },
    { href: "#studio", label: "Studio" },
    { href: "#forge", label: "Forge" },
    { href: "#archie", label: "Archie" },
    { href: "#precision", label: "Precision" },
    { href: "#", label: "Docs" },
  ],
  cta: "Open ArchDisc",
};

export const hero = {
  eyebrow: "Meet Archie · your local design copilot",
  headlineLines: ["Describe it.", "Archie builds it."],
  headline: "Describe it. Archie builds it.",
  subhead:
    "ArchDisc is an AI-native design platform with one copilot at its center. Speak in plain language; Archie turns intent into structured tool-calls that drive a real 3D engine and a native CAD kernel — parametric, validated, manufacturable. It all runs on a local model fleet, so nothing leaves your machine.",
  primaryCta: "Open ArchDisc",
  secondaryCta: "See Archie build",
  micro:
    "Free to open · Native for Apple Silicon · No cloud, no API keys, nothing leaves your machine.",
};

export const trust = {
  label: "Built on substance, not a demo",
  items: [
    {
      label: "Native CAD kernel",
      body: "OpenCASCADE 7.9.3, compiled from source. Real B-rep solids, no WASM in the geometry path.",
    },
    {
      label: "Local model fleet",
      body: "Archie runs on-device. Your prompts and your geometry never leave your machine.",
    },
    {
      label: "Real scale",
      body: "Organized assemblies past 100,000 components — structured, not confetti.",
    },
    {
      label: "Real simulation",
      body: "Structural, modal, thermal, buckling, and fatigue FEA on the solids you design.",
    },
    {
      label: "Two surfaces, one copilot",
      body: "Full 3D content creation and mechanical CAD, driven by the same Archie.",
    },
  ],
  closing: "No cloud round-trips. No per-token bill. No data leaving the room.",
};

export const pillars = {
  eyebrow: "One universe, one copilot",
  title: "Archie is the spine. Studio and Forge are the surfaces it acts on.",
  intro:
    "ArchDisc unifies creative 3D and precision engineering under a single AI copilot. You don't switch tools — you change intent.",
  cards: [
    {
      id: "studio",
      motif: "mesh" as const,
      kicker: "3D content creation",
      title: "Studio",
      body: "Modeling, sculpting, UV, shading, animation, rendering, compositing, and simulation — Blender-, Maya-, and Houdini-class breadth. Ask Archie for a scene and watch it compose, light, and frame the shot.",
      proof: "modeling · sculpt · animation · sim · render",
      link: "Explore Studio",
    },
    {
      id: "forge",
      motif: "sketch" as const,
      kicker: "Native parametric CAD",
      title: "Forge",
      body: "A from-source C++ kernel on OpenCASCADE 7.9.3 — parametric sketching with a real constraint solver, assemblies, FEA, CAM, and drawings with GD&T. Native B-rep geometry that's manufacturable, not just renderable.",
      proof: "sketcher · assemblies · FEA · CAM · STEP / DXF",
      link: "Explore Forge",
    },
    {
      id: "archie",
      motif: "caret" as const,
      kicker: "The AI copilot",
      title: "Archie",
      body: "One copilot drives both surfaces through structured tool-calls. It reasons about geometry, picks the right operation, builds it parametrically, then verifies the result before handing it back. Local, fast, private — and every step is a call you can read.",
      proof: "local fleet · validated tool-calls · editable history",
      link: "Meet Archie",
    },
  ],
};

export const how = {
  eyebrow: "Intent in, geometry out",
  title: "From a sentence to a solid in four moves.",
  intro:
    "No black box. Archie plans, then emits the exact parametric operations the kernel runs. You can read every call, edit any dimension, and the feature tree stays live.",
  steps: [
    {
      n: "01",
      label: "Describe",
      title: "You describe it",
      body: '"A wall-mount bracket, 100 mm wide, two M6 holes 60 mm apart, 4 mm wall, fillet the inside corners." Plain language — no menus, no parameters to hunt for.',
    },
    {
      n: "02",
      label: "Reason",
      title: "Archie plans",
      body: "The local model resolves the intent into named parameters and an ordered feature plan — structured tool-calls you can inspect before anything is drawn.",
    },
    {
      n: "03",
      label: "Build",
      title: "The kernel builds it",
      body: "Archie emits the exact operations the kernel runs — readable, ordered, and parametric.",
      code: [
        "sketch.rect(width=100, height=40)",
        "part.extrude(distance=4)",
        'part.holes(d=6, pitch=60, std="M6")',
        "part.filletEdges(ids=[inner], r=3)",
        "part.shell(thickness=4)",
        "heal.checkValidity() → valid",
      ],
    },
    {
      n: "04",
      label: "Verify",
      title: "Verify & tune",
      body: "A coherence gate checks the solid — valid topology — and self-corrects if something's off before you ever see it. Then every value becomes editable: change the wall from 4 to 3 and the part re-solves locally. No second prompt.",
    },
  ],
  closing:
    "Other text-to-CAD tools hand you disposable script. Archie hands you an editable feature tree the kernel already validated.",
};

export const precision = {
  eyebrow: "Why you can trust the geometry",
  title: "AI-native doesn't mean approximate.",
  intro:
    "The magic is the copilot. The substance underneath is a real engineering stack — the same class of kernel and math that production CAD runs on.",
  proofs: [
    {
      stat: "7.9.3",
      label: "OpenCASCADE, from source",
      body: "A native C++ B-rep kernel compiled from source — no WASM shim, no browser sandbox tax. True solids, NURBS surfacing, sweeps, lofts, drafts, and variable fillets. Solids you can export to STEP and send to a shop.",
      footnote: "forge-kernel.node · native B-rep + NURBS",
    },
    {
      stat: "100,000",
      label: "Components per assembly",
      body: "Organized industrial assemblies past one hundred thousand components — racks, machine rows, tank farms — packed into structure, not confetti, with real mates and live spatial queries.",
      footnote: "zoned · queryable · stays responsive",
    },
    {
      stat: "0",
      label: "Cloud round-trips",
      body: "Archie runs on a local model fleet — DeepSeek-R1-distilled, fine-tuned per discipline, served on your own machine. No API keys, no per-token bill, private by default and fast because there is no round-trip.",
      footnote: "on-device inference · your geometry stays home",
    },
    {
      stat: "REAL",
      label: "Simulation, on the same solids",
      body: "Linear-static, modal, thermal, buckling, and fatigue FEA — with contact — run on the geometry you designed. Archie can build a part, simulate it, read the result, and propose a fix.",
      footnote: "linear-static · modal · thermal · buckling · fatigue",
    },
  ],
  closing:
    "Every operation Archie calls is a real kernel feature — editable, exportable, and built to be made.",
};

export const showcase = {
  eyebrow: "Made with Archie",
  title: "One prompt each. No retouching.",
  intro:
    "Every frame below was driven by Archie and built by the kernel — then exported as STEP or glTF. No filters, no stock, just geometry.",
  tiles: [
    { id: "facility", kind: "facility" as const, prompt: "A zoned pallet warehouse, 100k-part scale.", output: "Forge · zoned assembly", feature: true },
    { id: "sculpt", kind: "sculpt" as const, prompt: "A 60 mm shelled vase, filleted rim.", output: "Studio · wireframe-over-clay" },
    { id: "assembly", kind: "assembly" as const, prompt: "An S-duct transition, circular to rectangular.", output: "Forge · sectioned w/ hatching" },
    { id: "pattern", kind: "pattern" as const, prompt: "A planetary gear ring, 12 teeth.", output: "Forge · parametric pattern" },
    { id: "sim", kind: "sim" as const, prompt: "Bracket under load.", output: "FEA · greyscale von Mises" },
    { id: "drawing", kind: "drawing" as const, prompt: "GD&T sheet for the bracket.", output: "Forge · title block + FCF" },
  ],
  caption: "Every frame above started as a sentence.",
};

export const specs = {
  eyebrow: "For people who read the spec sheet",
  title: "The questions a serious team asks.",
  rows: [
    { k: "Runs on", v: "Native desktop app for Apple Silicon Mac. Windows in progress." },
    { k: "Kernel", v: "OpenCASCADE 7.9.3, compiled from source. Native C++, no WASM." },
    { k: "Solids", v: "B-rep, NURBS surfacing, sweeps, lofts, drafts, variable fillets." },
    { k: "Assemblies", v: "Up to 100,000 components, real mates, live spatial queries." },
    { k: "Simulation", v: "Linear-static, modal, thermal, buckling, fatigue, with contact." },
    { k: "Sketching", v: "planegcs constraint solver with full DOF tracking." },
    { k: "Interop", v: "STEP, IGES, DXF, glTF, STL — in and out." },
    { k: "AI", v: "Local DeepSeek-R1-distilled fleet, per-discipline fine-tunes, structured tool-calls." },
    { k: "Privacy", v: "Inference runs on-device. No cloud, no telemetry of your geometry." },
    { k: "Cost", v: "Free to open. No API keys, no per-token charges." },
  ],
  faq: [
    {
      q: "Is this just text-to-CAD that spits out a script?",
      a: "No. Archie emits structured tool-calls into a real B-rep kernel and returns an editable feature tree — then verifies the solid before handing it back. You get geometry you can edit, simulate, and export, not disposable code.",
    },
    {
      q: "Will my models open in SolidWorks, NX, Creo, or Fusion?",
      a: "Yes. ArchDisc reads and writes native STEP, IGES, and DXF, so the model moves both directions without a lossy re-import.",
    },
    {
      q: "Do my designs or prompts leave my machine?",
      a: "No. The model fleet runs locally. Your geometry and your words stay on your hardware — private by default, and fast because there's no round-trip.",
    },
    {
      q: "Do I still have full manual control?",
      a: "Yes. Archie is a copilot, not a wall. Every operation lands in the normal feature tree and toolbars — drive it by hand any time.",
    },
    {
      q: "Is it really one app, or three glued together?",
      a: "One app, both surfaces. A Studio mesh and a Forge solid share the same workspace, and the same Archie moves between creative 3D and mechanical CAD.",
    },
    {
      q: "Is the simulation real or an estimate?",
      a: "Real FEA on real meshes — linear-static, modal, thermal, buckling, and fatigue, with contact. Archie can simulate a part and propose a fix from the result.",
    },
    {
      q: "What does it cost?",
      a: "Free to open and explore today. Paid tiers for production teams are coming.",
    },
  ],
};

export const finalCta = {
  eyebrow: "Ready when you are",
  headline: "Say it. Watch Archie build it.",
  subhead:
    "A local AI copilot, a real CAD kernel, and a full 3D studio — Studio, Forge, and Archie in one native app, on your machine, today.",
  primaryCta: "Open ArchDisc",
  secondaryCta: "Watch it work",
  micro:
    "Free to start · Native for Apple Silicon · Your work stays on your machine",
};

export const footer = {
  brand: "ArchDisc — describe it, Archie builds it.",
  columns: [
    {
      title: "Platform",
      links: [
        { label: "Overview", href: "#top" },
        { label: "Studio", href: "#studio" },
        { label: "Forge", href: "#forge" },
        { label: "Archie", href: "#archie" },
        { label: "Precision", href: "#precision" },
        { label: "Pricing", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Docs", href: "#" },
        { label: "Tool-call schema", href: "#" },
        { label: "Changelog", href: "#" },
        { label: "System requirements", href: "#" },
        { label: "Status", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Brand", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
        { label: "Licenses (OCCT LGPL)", href: "#" },
      ],
    },
  ],
  attribution: "Built on OpenCASCADE 7.9.3",
  bottomLine: "Monochrome by design.",
};
