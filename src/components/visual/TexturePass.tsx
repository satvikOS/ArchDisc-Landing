/** One cheap, fixed, monochrome texture pass: rag-paper/sensor grain + a value-only
 *  corner vignette. Replaces the old Grain. Never animates; masked off nothing
 *  (pointer-events-none, behind content). */
export function TexturePass() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          opacity: 0.022,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(125% 105% at 50% 36%, transparent 58%, rgba(17,21,28,0.05) 100%)",
        }}
      />
    </>
  );
}
