import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { BriefForm } from "@/components/brief/brief-form";
import { ErrorBoundary } from "@/components/error-boundary";
import { LOCALE_COOKIE_KEY } from "@/i18n";
import { resolveBriefLocale, type BriefLocale } from "@/lib/brief-submit";

const PAGE_COPY = {
  fr: {
    meta: {
      title: "Brief projet — site web et automatisation IA | AzurSysTech",
      description:
        "Décrivez votre projet d'automatisation ou de site web en quelques lignes. Un seul processus suffit pour commencer — sans engagement de prix ni de délai.",
    },
    eyebrow: "AzurSysTech / brief projet",
    title: "Décrivez votre projet — site, automatisation ou les deux",
    intro:
      "Quelques lignes suffisent : quel est votre flux actuel, ce qui bloque ou ce que vous voulez automatiser. Ça aide à identifier le premier processus à mettre en place et le prochain pas concret.",
    backCta: "Retour au détail de l'automatisation",
    directCta: "Contacter directement",
    noteTitle: "À garder en tête",
    noteItems: [
      "Ce n'est pas un cahier des charges complet",
      "Un seul processus ou besoin suffit",
      "Après l'envoi : revue manuelle, puis clarification du prochain pas",
    ],
    footerNote:
      "Après l'envoi, le brief part en revue manuelle. Nous l'utilisons pour clarifier le besoin et proposer un premier pas raisonnable. Cela ne vaut pas promesse de prix, de délai ou d'acceptation du projet.",
    formError:
      "Le formulaire est temporairement indisponible. Contactez-nous directement depuis le formulaire de la page d’accueil.",
  },
  ru: {
    meta: {
      title: "Бриф на проект — сайт и AI-автоматизация | AzurSysTech",
      description:
        "Опишите свой проект автоматизации или сайта в нескольких строках. Одного процесса достаточно, чтобы начать.",
    },
    eyebrow: "AzurSysTech / бриф проекта",
    title: "Опишите проект — сайт, автоматизация или всё вместе",
    intro:
      "Несколько строк достаточно: какой сейчас поток, что мешает или что хотите автоматизировать. Это поможет определить, с какого процесса начать и какой первый шаг будет разумным.",
    backCta: "Назад к описанию услуги",
    directCta: "Связаться напрямую",
    noteTitle: "Что важно помнить",
    noteItems: [
      "Это не полное техническое задание",
      "Достаточно одного процесса или потребности",
      "После отправки: ручная проверка и уточнение следующего шага",
    ],
    footerNote:
      "После отправки бриф попадёт на ручную проверку. Мы используем его, чтобы уточнить задачу и предложить разумный первый шаг. Это не обещание цены, сроков или принятия проекта.",
    formError: "Форма временно недоступна. Свяжитесь с нами напрямую через форму на главной странице.",
  },
} as const satisfies Record<BriefLocale, {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  intro: string;
  backCta: string;
  directCta: string;
  noteTitle: string;
  noteItems: string[];
  footerNote: string;
  formError: string;
}>;

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolveBriefLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);

  return PAGE_COPY[locale].meta;
}

export default async function BriefPage() {
  const cookieStore = await cookies();
  const locale = resolveBriefLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);
  const copy = PAGE_COPY[locale];
  return (
    <main className="bg-[#F3EFE7] text-[#172331]">
      <section className="overflow-hidden bg-[#172331] text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:items-end">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                {copy.eyebrow}
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                {copy.title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
                {copy.intro}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/#automation"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {copy.backCta}
                </Link>
                <Link
                  href={`/${locale}#contact`}
                  className="inline-flex items-center justify-center rounded-full bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(31,111,120,0.28)] transition-colors hover:bg-[#18565D]"
                >
                  {copy.directCta}
                </Link>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.18)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#75CCD1]">
                {copy.noteTitle}
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-white/76">
                {copy.noteItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="brief-form" className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <ErrorBoundary
            label="brief-form"
            fallback={
              <div className="rounded-[1.75rem] border border-[#D8D0C4] bg-[#FFFDF8] p-5 text-sm leading-6 text-[#5C6670] shadow-[0_18px_55px_rgba(23,35,49,0.08)] sm:p-6">
                {copy.formError}
              </div>
            }
          >
            <BriefForm locale={locale} />
          </ErrorBoundary>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
        <div className="mx-auto max-w-6xl border-t border-[#D8D0C4] pt-6 text-sm leading-6 text-[#5C6670]">
          {copy.footerNote}
        </div>
      </section>
    </main>
  );
}
