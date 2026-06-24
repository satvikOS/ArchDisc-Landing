import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * A framed industry image, unified into the dull-monochrome world via the
 * .plate-img treatment (desaturate + contrast) and a faint clay color wash.
 * The parent sizes it; the image fills.
 */
export function Plate({
  src,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  position = "center",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  position?: string;
}) {
  return (
    <div className={cn("plate-wash relative overflow-hidden bg-night", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="plate-img object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  );
}
