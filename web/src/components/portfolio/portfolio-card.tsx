import Link from "next/link";
import type { PortfolioLocale, PortfolioProject } from "@/lib/portfolio-data";
import { ytThumbUrl } from "@/lib/portfolio-data";

export function portfolioProjectHref(locale: PortfolioLocale, slug: string) {
  return `/${locale}/portfolio/${slug}`;
}

export function PortfolioCard({
  locale,
  project,
  learnMoreLabel = "En savoir plus",
}: {
  locale: PortfolioLocale;
  project: PortfolioProject;
  learnMoreLabel?: string;
}) {
  return (
    <Link
      href={portfolioProjectHref(locale, project.slug)}
      className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#121a2b] shadow-[0_20px_60px_rgba(0,0,0,0.22)] transition duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 hover:border-[#4f8cff]/55 hover:bg-[#151f34] hover:shadow-[0_28px_80px_rgba(7,17,34,0.42)] active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <span className="relative block aspect-video overflow-hidden">
        <img
          src={ytThumbUrl(project.youtubeId)}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.03]"
        />
        <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition duration-200 group-hover:bg-[#4f8cff]">
          <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" aria-hidden="true">
            <path fill="currentColor" d="M8 5v14l11-7L8 5z" />
          </svg>
        </span>
      </span>

      <span className="flex flex-1 flex-col p-5">
        <span className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#4f8cff]/30 bg-[#4f8cff]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#7badff]"
            >
              {tag}
            </span>
          ))}
        </span>
        <span className="mt-4 block text-2xl font-extrabold tracking-tight text-white">
          {project.title}
        </span>
        <span className="mt-3 block flex-1 text-base leading-7 text-white/76">
          {project.shortDescription}
        </span>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#4f8cff] transition group-hover:text-[#7badff]">
          {learnMoreLabel}
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path fill="currentColor" d="M5 11h11.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H5v-2z" />
          </svg>
        </span>
      </span>
    </Link>
  );
}
