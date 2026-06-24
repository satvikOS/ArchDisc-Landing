import type { Solid3DVariant } from "@/components/artifacts/Solid3D";

export type SpecRow = { label: string; value: string };
export type Room = { title: string; body: string };

export type Dossier = {
  key: "forge" | "studio" | "archie";
  codename: string;
  designation: string;
  role: string;
  tagline: string;
  intro: string;
  what: string;
  specs: SpecRow[];
  rooms: Room[];
  whyVeiled: string;
  showProbe: boolean;
  variant: Solid3DVariant;
  metaTitle: string;
  metaDescription: string;
};

/**
 * Per-system content for the classified dossiers. Grounded in what each system
 * actually is — described truthfully, framed as not-yet-public. No invented
 * benchmark numbers.
 */
export const DOSSIERS: Record<string, Dossier> = {
  forge: {
    key: "forge",
    codename: "Forge",
    designation: "SYS-01",
    role: "The kernel",
    tagline: "Solids made to be made.",
    intro:
      "Mechanical CAD on a real geometry kernel — not a viewer, not a toy. Sketch, model, assemble, simulate, and draw, with Archie working the tools beside you.",
    what:
      "Forge runs a native geometry kernel built from source — the lineage serious CAD is built on. Every shape is a real solid with an editable history, valid enough to hand to a machine shop.",
    specs: [
      { label: "Geometry kernel", value: "Native OpenCASCADE · from source" },
      { label: "Sketch solver", value: "Real constraints · planegcs" },
      { label: "Assemblies", value: "Thousands of components" },
      { label: "Analysis", value: "FEA — static · modal · thermal" },
      { label: "Manufacturing", value: "CAM toolpaths · GD&T drawings" },
      { label: "Interop", value: "STEP · IGES · DXF" },
      { label: "Where it runs", value: "Local · your own machine" },
    ],
    rooms: [
      { title: "The kernel", body: "Booleans, fillets, shells, sweeps, lofts — real operations on real B-rep solids, healed and validated." },
      { title: "The sketcher", body: "Dimensioned, constrained 2D that solves the way the constraint engines in professional CAD do." },
      { title: "Assemblies", body: "Mates, instances, and large trees that stay responsive as the part count climbs." },
      { title: "Simulation", body: "Put a load on it before you cut metal — static, modal, and thermal studies in the same file." },
      { title: "CAM & drawings", body: "Toolpaths and proper engineering drawings, with tolerances, out the other side." },
      { title: "Interop", body: "Bring geometry in and send it out in the formats the rest of the shop already speaks." },
    ],
    whyVeiled:
      "Real CAD is unforgiving — a kernel either produces a valid solid or it lies to you. We're not opening the doors until ours never lies.",
    showProbe: true,
    variant: "bracket",
    metaTitle: "Forge — the kernel, classified",
    metaDescription:
      "Forge is mechanical CAD on a native, from-source geometry kernel — real sketching, assemblies, FEA, CAM and drawings, driven by Archie. Not yet public. Request clearance.",
  },
  studio: {
    key: "studio",
    codename: "Studio",
    designation: "SYS-02",
    role: "The surface",
    tagline: "Where it comes together.",
    intro:
      "A creation environment for everything around the part — scenes, materials, light, and motion — with Archie arranging the room as you describe it.",
    what:
      "Studio is the surface where ideas get composed and shown: a real-time viewport, physically-based materials, and a deep set of creation tools, all reachable in plain language.",
    specs: [
      { label: "Viewport", value: "Real-time" },
      { label: "Materials", value: "Physically-based (PBR)" },
      { label: "Disciplines", value: "Model · shade · light · motion" },
      { label: "Driver", value: "Archie · the tool registry" },
      { label: "Output", value: "Renders · scenes · sequences" },
      { label: "Where it runs", value: "Local · your own machine" },
    ],
    rooms: [
      { title: "The scene", body: "Compose objects, cameras, and environments in a viewport that responds as fast as you think." },
      { title: "Materials", body: "Physically-based surfaces that read like the real thing under real light." },
      { title: "Light", body: "Set a mood with lighting that behaves — then capture it." },
      { title: "Motion", body: "Bring the scene to life: sequences and movement, directed in words." },
      { title: "Archie drives", body: "Describe the room; the tools move. The same model that builds parts arranges scenes." },
    ],
    whyVeiled:
      "A studio is chaos until opening night — half-built sets, paint still wet. Ours is mid-installation, and we'd rather you saw it finished.",
    showProbe: false,
    variant: "knot",
    metaTitle: "Studio — the surface, classified",
    metaDescription:
      "Studio is ArchDisc's creation surface — real-time scenes, PBR materials, light and motion, arranged by Archie in plain language. Not yet public. Request clearance.",
  },
  archie: {
    key: "archie",
    codename: "Archie",
    designation: "SYS-00",
    role: "The model",
    tagline: "The hand on the tools.",
    intro:
      "Archie is the model at the center of everything — the thing that turns a sentence into precise tool-calls and drives Forge and Studio like a collaborator who never tires.",
    what:
      "Archie is a local model fleet, not a far-away API. It reads what you want, plans the operations, and calls the real tools — keeping the geometry valid and the whole thing on your own machine.",
    specs: [
      { label: "Locality", value: "On-device · local fleet" },
      { label: "Hardware", value: "Native for Apple Silicon" },
      { label: "Interface", value: "Typed tool-calls" },
      { label: "Specialisation", value: "Per-discipline adapters" },
      { label: "Privacy", value: "Nothing leaves your machine" },
      { label: "Drives", value: "Forge · Studio" },
    ],
    rooms: [
      { title: "Language → geometry", body: "Plain description in, a sequence of precise operations out — not pixels, but parts." },
      { title: "Tool-calls", body: "Archie speaks the same typed schema the tools expose, so every move is real and inspectable." },
      { title: "Local & private", body: "The model runs where your work lives. No upload, no exhaust, no one watching." },
      { title: "Coherence", body: "It checks its own work — validity, intent, and the editable tree it leaves behind." },
      { title: "Drives both", body: "One model, two rooms: it builds in Forge and composes in Studio." },
    ],
    whyVeiled:
      "A model is only as good as its last bad answer. Archie is still in training, and we'll unveil it when it stops surprising us in the wrong ways.",
    showProbe: true,
    variant: "vessel",
    metaTitle: "Archie — the model, classified",
    metaDescription:
      "Archie is ArchDisc's local model fleet — it turns plain language into precise, inspectable tool-calls and drives Forge and Studio on your own machine. Not yet public. Request clearance.",
  },
};
