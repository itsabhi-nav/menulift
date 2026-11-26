/** Splits text into masked words (class .w) so GSAP can slide them up. */
export function Words({
  text,
  className = "",
  wordClass = "",
}: {
  text: string;
  className?: string;
  wordClass?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={i}>
            <span className="inline-block overflow-hidden pb-[0.16em] -mb-[0.16em] align-bottom">
              <span className={`w inline-block will-change-transform ${wordClass}`}>{w}</span>
            </span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Words that light up one by one as the section scrolls (class .sw). */
export function ScrubWords({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.split(" ").map((w, i) => (
          <span key={i}>
            <span className="sw inline-block opacity-100">{w}</span>{" "}
          </span>
        ))}
      </span>
    </span>
  );
}
