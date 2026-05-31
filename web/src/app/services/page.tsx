import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { LOCALE_COOKIE_KEY, resolveLocale } from "@/i18n";

type PageLocale = "fr" | "ru";

export const metadata: Metadata = {
  title: "Services web, automatisation IA et support IT local | AzurSysTech",
  description:
    "Sites web, agents IA, formulaires intelligents et support IT local pour petites entreprises à Nice et dans les environs.",
};

const CONTENT = {
  fr: {
    eyebrow: "AzurSysTech / services",
    title: "Sites web, automatisation IA et support IT local pour petites entreprises",
    intro:
      "Le coeur de l'offre : créer un point d'entrée clair pour vos demandes clients, puis automatiser les étapes répétitives sans perdre le contrôle humain.",
    primaryTitle: "Services principaux",
    primaryEyebrow: "Offres prioritaires",
    primaryIntro:
      "Ces offres sont pensées pour recevoir, qualifier et suivre les demandes entrantes.",
    secondaryTitle: "Support IT local",
    secondaryIntro:
      "Le support IT reste disponible quand l'environnement technique bloque le travail ou le projet.",
    packagesTitle: "Formats de départ",
    pagesTitle: "Pages détaillées",
    faqTitle: "Questions fréquentes",
    ctaTitle: "Par où commencer",
    ctaText:
      "Pour un projet web ou automatisation, remplissez le brief. Pour une demande simple ou support IT, utilisez la page contact.",
    briefCta: "Décrire un projet",
    contactCta: "Contact rapide",
    openPage: "Voir la page",
    primaryServices: [
      {
        href: "/services/websites",
        title: "Site web avec formulaire qui fonctionne",
        description:
          "Landing page ou site vitrine conçu pour expliquer l'offre, recevoir les demandes et notifier le propriétaire.",
        pricing: "à partir de 400 €",
      },
      {
        href: "/services/automation",
        title: "Automatisation IA des demandes entrantes",
        description:
          "Agent IA, formulaire ou chat pour qualifier les demandes, préparer un résumé et déclencher une notification.",
        pricing: "à partir de 800 €",
      },
      {
        href: "/brief",
        title: "Bundle site + intake automatisé",
        description:
          "Un site, une entrée de demande claire et un premier flux automatisé pour ne plus perdre les prospects.",
        pricing: "à partir de 600 €",
      },
    ],
    supportServices: [
      {
        title: "Mise en ordre technique",
        description: "Wi-Fi, imprimantes, postes de travail et réseau local pour petites structures.",
        pricing: "sur demande",
      },
      {
        title: "Assistance sur site",
        description: "Aide locale à Nice et alentours quand un blocage matériel ou réseau empêche d'avancer.",
        pricing: "à partir de 50 €",
      },
    ],
    packages: [
      {
        title: "Projet court",
        audience: "Un site simple, une page service ou une amélioration ciblée.",
        items: ["brief court", "structure de page", "formulaire ou CTA", "mise en ligne"],
      },
      {
        title: "Intake manager v1",
        audience: "Un flux pour recevoir, qualifier et transmettre les demandes clients.",
        items: ["chat ou formulaire", "règles de sécurité", "notification", "stockage structuré"],
      },
      {
        title: "Support IT complémentaire",
        audience: "Quand le site ou l'automatisation dépend d'un environnement local stable.",
        items: ["diagnostic", "réseau", "imprimantes", "postes de travail"],
      },
    ],
    detailedPages: [
      {
        href: "/services/websites",
        title: "Sites web pour petites entreprises",
        description: "Site ou landing page orienté demandes clients, avec formulaire et notifications.",
      },
      {
        href: "/services/automation",
        title: "Automatisation IA",
        description: "Agent IA et flux de qualification pour demandes entrantes et tâches répétitives.",
      },
      {
        href: "/services/tpe-setup",
        title: "Support IT TPE",
        description: "Postes de travail, réseau, Wi-Fi et imprimantes pour petites structures.",
      },
    ],
    faqs: [
      {
        question: "Dois-je choisir entre formulaire et brief ?",
        answer:
          "Non. Le formulaire suffit pour un premier contact. Le brief aide quand le projet concerne un site, un agent IA ou un flux métier.",
      },
      {
        question: "Le support IT disparaît-il ?",
        answer:
          "Non. Il devient secondaire dans le positionnement, mais reste utile pour les clients locaux et les projets qui dépendent d'une base technique fiable.",
      },
      {
        question: "Pourquoi les prix sont-ils indiqués comme repères ?",
        answer:
          "Parce que le volume dépend du contenu, des outils existants et du niveau d'automatisation. Le brief sert à cadrer la première estimation.",
      },
    ],
  },
  ru: {
    eyebrow: "AzurSysTech / услуги",
    title: "Сайты, AI-автоматизация и локальная IT-поддержка для малого бизнеса",
    intro:
      "Главная задача: сделать понятный вход для обращений клиентов, а затем автоматизировать повторяющиеся шаги без потери человеческого контроля.",
    primaryTitle: "Основные услуги",
    primaryEyebrow: "Приоритетные предложения",
    primaryIntro: "Эти услуги помогают принимать, уточнять и отслеживать входящие заявки.",
    secondaryTitle: "Локальная IT-поддержка",
    secondaryIntro:
      "IT-поддержка остается доступной, когда техническая среда мешает работе или запуску проекта.",
    packagesTitle: "Стартовые форматы",
    pagesTitle: "Подробные страницы",
    faqTitle: "Частые вопросы",
    ctaTitle: "С чего начать",
    ctaText:
      "Для сайта или автоматизации заполните бриф. Для простой заявки или IT-поддержки используйте страницу контактов.",
    briefCta: "Описать проект",
    contactCta: "Быстрая заявка",
    openPage: "Перейти",
    primaryServices: [
      {
        href: "/services/websites",
        title: "Сайт с рабочей формой заявки",
        description:
          "Лендинг или сайт-визитка, который объясняет услугу, принимает обращения и отправляет уведомление владельцу.",
        pricing: "от 400 €",
      },
      {
        href: "/services/automation",
        title: "AI-автоматизация входящих заявок",
        description:
          "AI-агент, форма или чат для первичного уточнения, подготовки резюме и уведомления.",
        pricing: "от 800 €",
      },
      {
        href: "/brief",
        title: "Комплект: сайт + автоматизированный intake",
        description:
          "Сайт, понятный вход для заявки и первый автоматизированный поток, чтобы не терять клиентов.",
        pricing: "от 600 €",
      },
    ],
    supportServices: [
      {
        title: "Техническое наведение порядка",
        description: "Wi-Fi, принтеры, рабочие места и локальная сеть для небольших организаций.",
        pricing: "по запросу",
      },
      {
        title: "Выездная помощь",
        description: "Локальная помощь в Ницце и рядом, если оборудование или сеть мешают работе.",
        pricing: "от 50 €",
      },
    ],
    packages: [
      {
        title: "Короткий проект",
        audience: "Простой сайт, страница услуги или точечное улучшение.",
        items: ["короткий бриф", "структура страницы", "форма или CTA", "публикация"],
      },
      {
        title: "Intake manager v1",
        audience: "Поток для приема, уточнения и передачи заявок клиентов.",
        items: ["чат или форма", "правила безопасности", "уведомление", "структурированное хранение"],
      },
      {
        title: "Дополнительная IT-поддержка",
        audience: "Когда сайт или автоматизация зависят от стабильной локальной техники.",
        items: ["диагностика", "сеть", "принтеры", "рабочие места"],
      },
    ],
    detailedPages: [
      {
        href: "/services/websites",
        title: "Сайты для малого бизнеса",
        description: "Сайт или лендинг для приема заявок, с формой и уведомлениями.",
      },
      {
        href: "/services/automation",
        title: "AI-автоматизация",
        description: "AI-агент и поток уточнения для входящих заявок и повторяющихся задач.",
      },
      {
        href: "/services/tpe-setup",
        title: "IT-поддержка TPE",
        description: "Рабочие места, сеть, Wi-Fi и принтеры для небольших организаций.",
      },
    ],
    faqs: [
      {
        question: "Что выбрать: форму или бриф?",
        answer:
          "Формы достаточно для первого контакта. Бриф полезен, если речь о сайте, AI-агенте или бизнес-процессе.",
      },
      {
        question: "IT-поддержка больше не актуальна?",
        answer:
          "Актуальна, но теперь это вторичная часть позиционирования. Она важна для локальных клиентов и проектов, где нужна стабильная техническая база.",
      },
      {
        question: "Почему цены указаны как ориентиры?",
        answer:
          "Объем зависит от контента, текущих инструментов и уровня автоматизации. Бриф помогает подготовить первую оценку.",
      },
    ],
  },
} as const;

async function getPageLocale(): Promise<PageLocale> {
  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value) === "ru" ? "ru" : "fr";
}

export default async function ServicesPage() {
  const locale = await getPageLocale();
  const copy = CONTENT[locale];

  return (
    <main className="bg-[#F6F1E8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">
            {copy.eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-3xl text-[#1F2A37] sm:text-4xl">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-[#1F2A37]/90">
            {copy.intro}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/brief"
              className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white hover:bg-[#185A61]"
            >
              {copy.briefCta}
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
            >
              {copy.contactCta}
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#C96F4A]">
            {copy.primaryEyebrow}
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[#1F2A37]">{copy.primaryTitle}</h2>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-[#1F2A37]/75">
            {copy.primaryIntro}
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {copy.primaryServices.map((service) => (
              <article key={service.title} className="rounded-xl border border-[#D8D0C4] p-5">
                <h3 className="text-lg font-semibold text-[#1F2A37]">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#1F2A37]/90">{service.description}</p>
                <p className="mt-4 text-sm font-medium text-[#1F6F78]">{service.pricing}</p>
                <Link href={service.href} className="mt-4 inline-block text-sm font-semibold text-[#1F6F78] underline">
                  {copy.openPage}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">{copy.secondaryTitle}</h2>
          <p className="mt-3 max-w-4xl text-[#1F2A37]/90">{copy.secondaryIntro}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {copy.supportServices.map((service) => (
              <article key={service.title} className="rounded-xl border border-[#D8D0C4] p-5">
                <h3 className="text-lg font-semibold text-[#1F2A37]">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#1F2A37]/90">{service.description}</p>
                <p className="mt-4 text-sm font-medium text-[#1F6F78]">{service.pricing}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">{copy.packagesTitle}</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {copy.packages.map((pkg) => (
              <article key={pkg.title} className="rounded-xl border border-[#D8D0C4] p-5">
                <h3 className="text-lg font-semibold text-[#1F2A37]">{pkg.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#1F2A37]/90">{pkg.audience}</p>
                <ul className="mt-4 grid gap-2 text-sm text-[#1F2A37]/90">
                  {pkg.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">{copy.pagesTitle}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {copy.detailedPages.map((page) => (
              <article key={page.href} className="rounded-xl border border-[#D8D0C4] p-5">
                <h3 className="text-lg font-semibold text-[#1F2A37]">{page.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#1F2A37]/90">{page.description}</p>
                <Link href={page.href} className="mt-4 inline-block text-sm font-semibold text-[#1F6F78] underline">
                  {copy.openPage}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">{copy.faqTitle}</h2>
          <div className="mt-5 grid gap-4">
            {copy.faqs.map((item) => (
              <article key={item.question} className="rounded-xl border border-[#D8D0C4] p-5">
                <h3 className="font-semibold text-[#1F2A37]">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-[#1F2A37]/90">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">{copy.ctaTitle}</h2>
          <p className="mt-3 max-w-4xl text-[#1F2A37]/90">{copy.ctaText}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/brief"
              className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white hover:bg-[#185A61]"
            >
              {copy.briefCta}
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
            >
              {copy.contactCta}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
