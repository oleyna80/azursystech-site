import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { YouTubeEmbed } from "@/components/portfolio/youtube-embed";
import { getAllSlugs, getProject } from "@/lib/portfolio-data";

const BASE_URL = "https://azursystech.fr";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const url = `${BASE_URL}/portfolio/${project.slug}`;
  return {
    title: `${project.title} — Portfolio | AzurSysTech`,
    description: project.shortDescription,
    alternates: {
      canonical: url,
      languages: { fr: url, "x-default": url },
    },
  };
}

export default async function PortfolioProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className="bg-[#081120] pt-16 text-white md:pt-20">
      <div className="container mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-24">
        <Link
          href="/portfolio"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/60 transition hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 rotate-180" aria-hidden="true">
            <path fill="currentColor" d="M5 11h11.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H5v-2z" />
          </svg>
          Portfolio
        </Link>

        <div className="mb-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#4f8cff]/30 bg-[#4f8cff]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#7badff]"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.02]">
          {project.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68">
          {project.shortDescription}
        </p>

        <div className="mt-10">
          <YouTubeEmbed youtubeId={project.youtubeId} title={project.title} />
        </div>

        <p className="mt-12 text-lg leading-8 text-white/80">{project.review.intro}</p>

        <section className="mt-12">
          <h2 className="text-2xl font-extrabold tracking-tight">Capacités du site</h2>
          <ul className="mt-5 space-y-3">
            {project.review.capabilities.map((item) => (
              <li key={item} className="flex gap-3 text-base leading-7 text-white/76">
                <span className="mt-0.5 text-[#4f8cff]" aria-hidden="true">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-extrabold tracking-tight">
            Automatisation des processus métier
          </h2>
          <ul className="mt-5 space-y-3">
            {project.review.automationPoints.map((item) => (
              <li key={item} className="flex gap-3 text-base leading-7 text-white/76">
                <span className="mt-0.5 text-[#4f8cff]" aria-hidden="true">
                  →
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-14 flex flex-wrap items-center gap-4">
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              className="inline-flex items-center gap-2 rounded-full bg-[#4f8cff] px-7 py-3.5 text-base font-bold text-white shadow-premium-soft transition-transform duration-150 ease-out active:scale-[0.97] hover:bg-[#4f8cff]/90"
            >
              Voir la démo
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="currentColor" d="M5 11h11.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H5v-2z" />
              </svg>
            </a>
          ) : null}
          <Link
            href="/brief"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-base font-bold text-white transition hover:bg-white/10"
          >
            Décrire un projet similaire
          </Link>
        </div>
      </div>
    </main>
  );
}
