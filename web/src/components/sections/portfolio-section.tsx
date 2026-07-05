import type { PortfolioProject } from "@/lib/portfolio-data";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  projects: readonly PortfolioProject[];
};

export function PortfolioSection({ eyebrow, title, intro, projects }: Props) {
  return (
    <section className="bg-[#081120] py-20 text-white md:py-28">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#4f8cff]">
            {eyebrow}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl md:leading-[1.02]">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68">{intro}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <PortfolioCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
