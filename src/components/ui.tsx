import Link from "@/components/L";
import type { ReactNode } from "react";

type IconProps = { className?: string };
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const Check = ({ className = "h-4 w-4" }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
export const Cross = ({ className = "h-4 w-4" }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const Arrow = ({ className = "h-4 w-4" }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const Star = ({ className = "h-4 w-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.600-.9L12 2.5Z" />
  </svg>
);
export const Plus = ({ className = "h-4 w-4" }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const Menu = ({ className = "h-6 w-6" }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const Close = ({ className = "h-6 w-6" }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

/** Primary button. Chilli-free: accent on dark, ink on light. */
export function Cta({
  href,
  children,
  variant = "accent",
  className = "",
  onClick,
}: {
  href: string;
  children: ReactNode;
  variant?: "accent" | "ink" | "ghost";
  className?: string;
  onClick?: () => void;
}) {
  const styles = {
    accent:
      "bg-accent text-ink hover:bg-accent-deep shadow-[0_10px_30px_-10px_rgba(240,180,76,0.6)]",
    ink: "bg-ink text-paper hover:bg-ink-2",
    ghost:
      "border border-line-dark text-paper hover:border-accent hover:text-accent",
  }[variant];
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-7 text-[16px] font-bold transition-[transform,background-color,border-color,color,opacity,box-shadow] hover:-translate-y-0.5 ${styles} ${className}`}
    >
      {children}
      <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export function Section({
  id,
  tone,
  children,
  className = "",
}: {
  id?: string;
  tone: "ink" | "paper" | "sand" | "deep";
  children: ReactNode;
  className?: string;
}) {
  const t = {
    ink: "bg-ink text-paper",
    deep: "bg-[#000000] text-paper",
    paper: "bg-paper text-ink",
    sand: "bg-paper-2 text-ink",
  }[tone];
  return (
    <section id={id} className={`scroll-mt-16 py-12 sm:py-28 ${t} ${className}`}>
      <div className="mx-auto max-w-[1360px] px-4 sm:px-8">{children}</div>
    </section>
  );
}

export function Heading({
  children,
  sub,
  tone = "dark",
  className = "",
}: {
  children: ReactNode;
  sub?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <h2 className="text-[36px] font-extrabold leading-[1.05] sm:text-[52px]">
        {children}
      </h2>
      {sub && (
        <p
          className={`mt-5 max-w-[56ch] text-[17px] leading-relaxed sm:text-[19px] ${
            tone === "light" ? "text-slate" : "text-slate-light"
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/** The WhatsApp logo glyph (Simple Icons, CC0). Colour it with currentColor. */
export const WhatsApp = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);
