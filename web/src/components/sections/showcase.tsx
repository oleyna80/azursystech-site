import Link from "next/link";

type Demo = {
  slug: string;
  title: string;
  category: string;
  badge?: "new";
  demoUrl: string;
};

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  demos: readonly Demo[];
};

const PREVIEW_GRADIENTS: Record<string, string> = {
  plomberie: "from-[#1A3C5E] via-[#1A3C5E]/90 to-[#E0553F]/20",
  "salon-beaute": "from-[#8B6B5E] via-[#8B6B5E]/90 to-[#D4A574]/20",
  bistrot: "from-[#4A3222] via-[#4A3222]/90 to-[#C67C3C]/20",
  "bijoux-artisanaux": "from-[#1A1A1A] via-[#1A1A1A]/90 to-[#C9A96E]/20",
  assurance: "from-[#1F3D4F] via-[#1F3D4F]/90 to-[#2E7D6F]/20",
  comptabilite: "from-[#2D3748] via-[#2D3748]/90 to-[#5A7D6B]/20",
};

const PREVIEW_ICONS: Record<string, string> = {
  plomberie: "🔧",
  "salon-beaute": "✨",
  bistrot: "🍽️",
  "bijoux-artisanaux": "💎",
  assurance: "🛡️",
  comptabilite: "📊",
};

export function ShowcaseSection({
  eyebrow,
  title,
  intro,
  demos,
}: Props) {
  return (
    <section id="websites" className="bg-base py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-accent-terra/90">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-5xl md:leading-[1.02]">
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-graphite/72">
            {intro}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {demos.map((demo) => (
            <Link
              key={demo.slug}
              href={demo.demoUrl}
              className="group block rounded-xl bg-graphite shadow-lg transition duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-premium-soft active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:hover:translate-y-0"
            >
              {/* Preview — 16:10 themed placeholder with browser chrome */}
              <div
                className={`relative aspect-[16/10] overflow-hidden rounded-t-xl bg-gradient-to-br ${PREVIEW_GRADIENTS[demo.slug] ?? "from-graphite via-graphite/90 to-graphite/70"}`}
              >
                {/* Browser chrome */}
                <div className="absolute inset-x-0 top-0 flex items-center gap-1.5 border-b border-white/10 bg-black/20 px-3 py-2 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-white/25" />
                  <span className="h-2 w-2 rounded-full bg-white/25" />
                  <span className="h-2 w-2 rounded-full bg-white/25" />
                  <span className="ml-2 h-3 flex-1 rounded-sm bg-white/10 px-2 text-[8px] leading-3 text-white/25">{demo.slug}.fr</span>
                </div>
                {/* Emoji placeholder — behind chrome */}
                <span className="absolute inset-0 flex items-center justify-center text-4xl opacity-50 md:text-5xl md:opacity-40">
                  {PREVIEW_ICONS[demo.slug] ?? "🖥️"}
                </span>
                {demo.badge === "new" && (
                  <span className="absolute left-3 top-9 rounded-full bg-accent-teal px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                    new
                  </span>
                )}
              </div>

              {/* Card body */}
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-white/50">
                    {demo.category}
                  </p>
                  <h3 className="text-lg font-bold text-white">{demo.title}</h3>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:bg-accent-teal group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M5 11h11.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H5v-2z"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
