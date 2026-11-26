import { LoopVideo } from "./LoopVideo";

export function PageHeader({ title, sub, video }: { title: string; sub: string; video?: string }) {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      {video && (
        <>
          <LoopVideo id={video} className="opacity-45" />
          <span className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/20" aria-hidden />
        </>
      )}
      <div className="relative mx-auto max-w-[1360px] px-4 pb-12 pt-12 sm:px-8 sm:pb-32 sm:pt-32">
        <h1 className="max-w-[18ch] text-[44px] leading-[1] sm:text-[80px]">{title}</h1>
        <p className="mt-6 max-w-[52ch] text-[18px] leading-relaxed text-slate-light sm:text-[21px]">{sub}</p>
      </div>
    </section>
  );
}
