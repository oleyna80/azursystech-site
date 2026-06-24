import type { ReactNode } from "react";

type Demo = {
  slug: string;
  title: string;
  category: string;
  siteType: string;
  businessFunction: string;
  automationBadge: string;
  badge?: "new";
  demoUrl: string;
};

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  demos: readonly Demo[];
};

const TILE_MARKS: Record<string, ReactNode> = {
  plomberie: (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-12 w-12">
      <circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M18 35h13V22h15v8h-7v13H24v8h-6V35z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="46" cy="43" r="5" fill="none" stroke="currentColor" strokeWidth="4" />
    </svg>
  ),
  "salon-beaute": (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-12 w-12">
      <circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M38 11c-8 8-15 13-15 24 0 9 6 16 15 18-3-4-3-8 1-13 5-7 5-16-1-29z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path d="M25 42c-6-1-10-5-11-11" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
  bistrot: (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-12 w-12">
      <circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M21 17v16m-6-16v16m12-16v16m-6 0v16" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M39 17h8v32m-8-32c-4 8-4 16 0 22h8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  ),
  "bijoux-artisanaux": (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-12 w-12">
      <circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M17 25l8-9h14l8 9-15 22-15-22z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path d="M17 25h30M25 16l7 31 7-31" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  ),
  assurance: (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-12 w-12">
      <circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M20 26l12-7 12 7v9c0 9-5 14-12 18-7-4-12-9-12-18v-9z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path d="M26 34l4 4 9-10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  comptabilite: (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-12 w-12">
      <circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M32 15v34M18 23h28M22 23l-8 16h16l-8-16zm20 0l-8 16h16l-8-16z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  ),
};

export function ShowcaseSection({
  eyebrow,
  title,
  intro,
  demos,
}: Props) {
  return (
    <section id="websites" className="bg-[#081120] py-20 text-white md:py-28">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#4f8cff]">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl md:leading-[1.02]">
            {title}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68">
            {intro}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {demos.map((demo) => (
            <a
              key={demo.slug}
              href={demo.demoUrl}
              className="group relative flex min-h-[330px] flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#121a2b] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] transition duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 hover:border-[#4f8cff]/55 hover:bg-[#151f34] hover:shadow-[0_28px_80px_rgba(7,17,34,0.42)] active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:min-h-[370px]"
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent" />

              <div className="flex items-start gap-4 text-white">
                <span className="mt-1 shrink-0 transition duration-200 group-hover:text-[#4f8cff]">
                  {TILE_MARKS[demo.slug] ?? TILE_MARKS.plomberie}
                </span>
                <h3 className="text-3xl font-extrabold leading-[0.92] tracking-normal text-white md:text-4xl">
                  {demo.title}
                </h3>
              </div>

              <div>
                {demo.badge === "new" && (
                  <span className="mb-4 inline-flex rounded-full border border-[#4f8cff]/30 bg-[#4f8cff]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#7badff]">
                    new
                  </span>
                )}
                <p className="text-sm font-bold text-[#4f8cff]">
                  {demo.category}
                </p>
                <h4 className="mt-3 text-xl font-extrabold tracking-tight text-white">
                  {demo.title}
                </h4>
                <p className="mt-3 max-w-[29rem] text-base leading-7 text-white/76">
                  {demo.businessFunction}
                </p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-white/52">
                    {demo.automationBadge}
                  </span>
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/70 transition duration-200 group-hover:border-[#4f8cff]/60 group-hover:bg-[#4f8cff] group-hover:text-white">
                    {">"}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
