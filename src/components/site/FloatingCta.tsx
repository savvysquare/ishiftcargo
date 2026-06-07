import { Phone } from "lucide-react";
import { SITE } from "@/lib/site";

export function FloatingCta() {
  return (
    <a
      href={SITE.phoneHref}
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[var(--teal)] px-5 py-3.5 text-sm font-semibold text-white shadow-lift transition-all hover:-translate-y-0.5 lg:hidden"
      aria-label="Call iShiftCargo"
    >
      <Phone className="h-4 w-4" /> Call us
    </a>
  );
}
