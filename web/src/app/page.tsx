import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { HomeContactSection } from "@/components/sections/home-contact";
import { getPageMeta, LOCALE_COOKIE_KEY, resolveLocale } from "@/i18n";

type HomeLocale = "fr" | "ru";

const CONTACT = {
  whatsappHref: "https://wa.me/33780720994",
};

const HOME_CONTENT = {
  fr: {
    location: "Nice et alentours",
    heroTitle: "Assistance technique pour les petites entreprises",
    heroIntro:
      "Postes de travail, Wi-Fi, imprimantes, réseau local et assistance sur site pour bureaux, cabinets et commerces.",
    primaryCta: "Demander un devis",
    secondaryCta: "Écrire sur WhatsApp",
    businessEyebrow: "Pour les petites entreprises",
    businessTitle: "Nous résolvons les problèmes techniques courants qui bloquent le travail",
    businessIntro:
      "Nous mettons de l’ordre dans les postes de travail, les imprimantes, le Wi-Fi et le réseau local. L’objectif est de rendre l’environnement utilisable, sans complexité inutile.",
    workspaceTitle: "Postes de travail",
    workspaceItems: [
      "préparation de nouveaux postes",
      "connexion des ordinateurs et périphériques",
      "configuration de base du système et des logiciels",
      "connexion des imprimantes et accès partagé",
    ],
    networkTitle: "Réseau et support",
    networkItems: [
      "Wi-Fi et organisation simple du réseau",
      "diagnostic des pannes sur site",
      "réseau local et matériel pour petite structure",
      "mise en ordre progressive, sans complexité inutile",
    ],
    businessCta: "Discuter du besoin",
    businessImageAlt: "Espace de travail pour une petite entreprise",
    automationEyebrow: "Automatisation et IA",
    automationTitle: "Automatisation, IA et outils numériques pour le travail quotidien",
    automationIntro:
      "Nous aidons à réduire la routine manuelle, structurer les flux et accélérer le travail sans créer une infrastructure lourde.",
    automationPoints: [
      {
        title: "Bots, assistants et agents IA",
        desc: "Pour les tâches répétitives, les réponses rapides et le premier traitement des demandes.",
      },
      {
        title: "Flux de travail pour demandes et informations",
        desc: "Pour que les demandes, messages et données ne se perdent pas entre email, messageries et tableaux.",
      },
      {
        title: "Sites simples et pages projet",
        desc: "Petits sites et pages pour services locaux, projets ou besoins de travail.",
      },
      {
        title: "Intégrations et petits outils",
        desc: "Petits programmes et connexions de services lorsqu’il faut un résultat concret.",
      },
    ],
    automationCta: "Découvrir l’automatisation avec l’IA",
    automationImageAlt: "Illustration d’automatisation et d’IA",
    howEyebrow: "Comment nous travaillons",
    howTitle: "Un processus clair, sans étapes inutiles",
    howSteps: [
      { step: "01", title: "Vous décrivez le besoin", desc: "Formulaire, WhatsApp ou assistant de chat." },
      { step: "02", title: "Nous clarifions les détails", desc: "Nombre d’appareils, déplacement nécessaire et point de départ." },
      { step: "03", title: "Nous mettons en place une solution utile", desc: "Nous configurons, connectons, corrigeons et vérifions." },
      { step: "04", title: "Suite des actions", desc: "Si le besoin est plus large, nous le découpons en étapes sans promesses excessives." },
    ],
    pricingEyebrow: "Repères de prix",
    pricingTitle: "Des repères de départ compréhensibles",
    pricingIntro:
      "Pour les petites demandes, nous pouvons donner une base de prix. Pour une mise en place plus large, nous précisons après une courte description du besoin.",
    pricingCta: "Demander une estimation",
    pricingNote: "Aucun engagement de délai ni de prix exact avant clarification du besoin.",
    pricingItems: [
      { title: "Assistance sur site et diagnostic", price: "à partir de 50 €" },
      { title: "Wi-Fi, imprimantes, connexion d’appareils", price: "à partir de 70 €" },
      { title: "Nouveau PC ou poste de travail", price: "à partir de 80–90 €" },
      { title: "Petit environnement IT pour entreprise", price: "sur demande" },
      { title: "Automatisation, IA et processus numériques", price: "à discuter" },
    ],
    faqEyebrow: "Questions fréquentes",
    faqTitle: "Réponses courtes aux questions les plus fréquentes",
    faqs: [
      { q: "Intervenez-vous seulement à Nice ?", a: "Nous intervenons à Nice et dans un rayon d’environ 30 km." },
      { q: "Aidez-vous seulement les entreprises ?", a: "Le focus principal est le business, mais vous pouvez aussi nous écrire pour un besoin hors entreprise." },
      { q: "Pouvez-vous intervenir pour le Wi-Fi et l’imprimante ?", a: "Oui. C’est l’une des demandes les plus fréquentes et les plus concrètes." },
      { q: "Puis-je d’abord décrire le besoin par message ?", a: "Oui. C’est le format préféré pour une première évaluation." },
      { q: "Vous faites seulement du dépannage ?", a: "Non. Nous configurons aussi des postes, le réseau, les imprimantes et l’environnement IT de base." },
    ],
    faqCta: "Poser une question",
  },
  ru: {
    location: "Ницца и окрестности",
    heroTitle: "Техническая помощь для малого бизнеса",
    heroIntro:
      "Рабочие места, Wi-Fi, принтеры, локальная сеть и выездная помощь для офисов, кабинетов и магазинов.",
    primaryCta: "Оставить заявку",
    secondaryCta: "Написать в WhatsApp",
    businessEyebrow: "Для малого бизнеса",
    businessTitle: "Решаем обычные технические задачи, которые мешают работе",
    businessIntro:
      "Настраиваем рабочие места, принтеры, Wi-Fi и локальную сеть. Не усложняем процесс, а приводим технику и рабочую среду в порядок.",
    workspaceTitle: "Рабочие места",
    workspaceItems: [
      "подготовка новых рабочих мест",
      "подключение компьютеров и периферии",
      "базовая настройка системы и программ",
      "подключение принтеров и общего доступа",
    ],
    networkTitle: "Сеть и поддержка",
    networkItems: [
      "Wi-Fi и базовая организация сети",
      "диагностика сбоев на месте",
      "локальная сеть и техника для малого бизнеса",
      "пошаговое наведение порядка без лишней сложности",
    ],
    businessCta: "Обсудить задачу",
    businessImageAlt: "Рабочая среда для небольшого бизнеса",
    automationEyebrow: "Автоматизация и ИИ",
    automationTitle: "Автоматизация, ИИ и цифровые инструменты для повседневной работы",
    automationIntro:
      "Помогаем убрать ручную рутину, навести порядок в процессах и ускорить работу без сложной инфраструктуры и лишней перегрузки.",
    automationPoints: [
      {
        title: "Боты, ассистенты и ИИ-агенты",
        desc: "Для повторяющихся задач, быстрых ответов и первичной обработки запросов.",
      },
      {
        title: "Рабочие процессы для заявок и информации",
        desc: "Чтобы заявки, сообщения и данные не терялись между почтой, мессенджерами и таблицами.",
      },
      {
        title: "Простые сайты и страницы под проект",
        desc: "Небольшие сайты и страницы для локальных услуг, проектов и рабочих задач.",
      },
      {
        title: "Интеграции и небольшие инструменты",
        desc: "Небольшие программы и связки сервисов там, где нужен реальный рабочий результат.",
      },
    ],
    automationCta: "Узнать об автоматизации с ИИ",
    automationImageAlt: "Иллюстрация автоматизации и ИИ",
    howEyebrow: "Как мы работаем",
    howTitle: "Понятный процесс без лишних шагов",
    howSteps: [
      { step: "01", title: "Вы описываете задачу", desc: "Форма, WhatsApp или чат-помощник." },
      { step: "02", title: "Мы уточняем детали", desc: "Уточняем, сколько устройств, нужен ли выезд и с чего начать." },
      { step: "03", title: "Делаем рабочее решение", desc: "Настраиваем, подключаем, исправляем и проверяем на месте." },
      { step: "04", title: "Следующий шаг", desc: "Если задача больше, раскладываем по шагам без лишних обещаний." },
    ],
    pricingEyebrow: "Стартовые цены",
    pricingTitle: "Понятные стартовые ориентиры",
    pricingIntro:
      "Для небольших задач можно назвать стартовую цену. Для малого бизнеса и более широкой настройки итог уточняется после короткого описания задачи.",
    pricingCta: "Запросить оценку",
    pricingNote: "Без обещаний по срокам и точной цене до уточнения задачи.",
    pricingItems: [
      { title: "Выездная помощь и диагностика", price: "от 50 €" },
      { title: "Wi-Fi, принтеры, подключение устройств", price: "от 70 €" },
      { title: "Новый ПК или рабочее место", price: "от 80-90 €" },
      { title: "Небольшая рабочая среда для малого бизнеса", price: "по запросу" },
      { title: "Автоматизация, ИИ и цифровые процессы", price: "обсуждается" },
    ],
    faqEyebrow: "Частые вопросы",
    faqTitle: "Короткие ответы на частые вопросы",
    faqs: [
      { q: "Вы работаете только по Ницце?", a: "Работаем в Ницце и в радиусе до 30 км." },
      { q: "Вы помогаете только бизнесу?", a: "Основной фокус — бизнес, но если задача не связана с ним, тоже можно написать." },
      { q: "Можно ли вызвать вас для настройки Wi-Fi и принтера?", a: "Да. Это одна из самых частых и практических задач." },
      { q: "Можно ли сначала описать задачу в сообщении?", a: "Да, это предпочтительный формат для первичной оценки." },
      { q: "Вы делаете только ремонт?", a: "Нет. Кроме ремонта и диагностики настраиваем рабочие места, сеть, принтеры и базовую техническую среду." },
    ],
    faqCta: "Задать свой вопрос",
  },
} as const;

function resolveHomeLocale(value: string | undefined): HomeLocale {
  return resolveLocale(value) === "ru" ? "ru" : "fr";
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolveHomeLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);
  return getPageMeta(locale, "/");
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = resolveHomeLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);
  const copy = HOME_CONTENT[locale];

  return (
    <main className="bg-base text-graphite">
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-graphite text-white">
        <img
          src="/hero.png"
          alt={copy.heroTitle}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,18,24,0.92)_0%,rgba(16,24,32,0.75)_45%,rgba(18,26,34,0.25)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.16),transparent_58%)] opacity-70" />

        <div className="container relative z-10 mx-auto flex min-h-[100svh] flex-col justify-end px-4 pb-12 pt-24 md:px-8 md:pb-20 md:pt-36">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-semibold tracking-[0.18em] text-white/85">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent-terra" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 2C8.1 2 5 5.2 5 9.1c0 4.8 6.2 12.1 6.4 12.4a.8.8 0 0 0 1.2 0c.2-.3 6.4-7.6 6.4-12.4C19 5.2 15.9 2 12 2zm0 10.1a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
                />
              </svg>
              {copy.location}
            </div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-white/60">AzurSysTech</p>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-white md:text-6xl md:leading-[0.98]">
              {copy.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-white/82">
              {copy.heroIntro}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-teal px-7 py-3.5 text-base font-bold text-white shadow-premium-soft transition-transform duration-200 hover:-translate-y-0.5 hover:bg-accent-teal/90 active:scale-95"
              >
                {copy.primaryCta}
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path fill="currentColor" d="M5 11h11.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H5v-2z" />
                </svg>
              </a>
              <a
                href={CONTACT.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/8 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/12"
              >
                {copy.secondaryCta}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="business" className="bg-base py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-accent-teal/90">
                {copy.businessEyebrow}
              </p>
              <h2 className="max-w-3xl text-3xl font-extrabold tracking-tight text-graphite md:text-5xl md:leading-[1.02]">
                {copy.businessTitle}
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-graphite/72">
                {copy.businessIntro}
              </p>

              <div className="mt-10 grid gap-8 border-t border-graphite/10 pt-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-graphite/55">
                    {copy.workspaceTitle}
                  </h3>
                  <ul className="space-y-4 text-base font-medium leading-7 text-graphite/80">
                    {copy.workspaceItems.map((item) => (
                      <li key={item} className="flex gap-3 transition duration-300 ease-out md:hover:-translate-y-0.5">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent-teal" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-graphite/55">
                    {copy.networkTitle}
                  </h3>
                  <ul className="space-y-4 text-base font-medium leading-7 text-graphite/80">
                    {copy.networkItems.map((item) => (
                      <li key={item} className="flex gap-3 transition duration-300 ease-out md:hover:-translate-y-0.5">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent-terra" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <a href="#contact" className="mt-10 inline-flex items-center gap-2 text-base font-bold text-accent-teal hover:text-graphite">
                {copy.businessCta}
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path fill="currentColor" d="M5 11h11.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H5v-2z" />
                </svg>
              </a>
            </div>

            <div className="overflow-hidden rounded-[2rem] bg-surface shadow-premium-soft ring-1 ring-graphite/5">
              <img src="/business.png" alt={copy.businessImageAlt} className="aspect-[4/3] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section id="automation" className="border-y border-graphite/8 bg-[#f5f1ea] py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-accent-terra/90">
                {copy.automationEyebrow}
              </p>
              <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-graphite md:text-5xl md:leading-[1.02]">
                {copy.automationTitle}
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-graphite/72">
                {copy.automationIntro}
              </p>

              <div className="mt-10 space-y-6 border-t border-graphite/10 pt-8">
                {copy.automationPoints.map((point) => (
                  <div
                    key={point.title}
                    className="group flex gap-4 rounded-[1.5rem] px-2 py-2 transition duration-300 ease-out md:hover:-translate-y-1 md:hover:scale-[1.03]"
                  >
                    <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-accent-teal shadow-premium-soft ring-1 ring-graphite/5 transition duration-300 ease-out group-hover:scale-110 group-hover:bg-accent-teal group-hover:text-white">
                      <span className="h-2.5 w-2.5 rounded-full bg-current" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-graphite">{point.title}</h3>
                      <p className="mt-1 max-w-xl text-base leading-7 text-graphite/70">{point.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/ai-automation"
                  className="inline-flex items-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-base font-bold text-white shadow-premium-soft transition-transform active:scale-95 hover:bg-graphite/90"
                >
                  {copy.automationCta}
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path fill="currentColor" d="M5 11h11.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H5v-2z" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -z-10 translate-x-5 translate-y-5 rounded-[2.5rem] bg-accent-terra/10 blur-2xl" />
              <div className="overflow-hidden rounded-[2rem] bg-surface shadow-premium-soft ring-1 ring-graphite/5">
                <img src="/automation-illustration.svg" alt={copy.automationImageAlt} className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-graphite py-20 text-white md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-14 max-w-2xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-accent-teal/90">{copy.howEyebrow}</p>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.02]">
              {copy.howTitle}
            </h2>
          </div>

          <div className="grid gap-8 border-t border-white/10 pt-8 md:grid-cols-4">
            {copy.howSteps.map((step) => (
              <div key={step.step} className="border-l border-white/10 pl-5 md:pl-6">
                <div className="mb-5 text-xs font-bold tracking-[0.22em] text-accent-teal">{step.step}</div>
                <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                <p className="text-base font-medium leading-7 text-white/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-graphite/5 bg-surface py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="max-w-xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-accent-terra/90">
                {copy.pricingEyebrow}
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-5xl md:leading-[1.02]">
                {copy.pricingTitle}
              </h2>
              <p className="mt-6 text-lg leading-8 text-graphite/72">
                {copy.pricingIntro}
              </p>
              <a
                href="#contact"
                className="mt-8 inline-flex rounded-full bg-graphite px-7 py-3.5 text-base font-bold text-white shadow-premium-soft transition-transform active:scale-95 hover:bg-graphite/90"
              >
                {copy.pricingCta}
              </a>
              <div className="mt-8 border-t border-graphite/8 pt-5 text-sm font-medium leading-6 text-graphite/55">
                {copy.pricingNote}
              </div>
            </div>

            <div className="border-t border-graphite/10">
              {copy.pricingItems.map((item) => (
                <div key={item.title} className="grid gap-2 border-b border-graphite/10 py-7 md:grid-cols-[1fr_auto] md:items-center">
                  <span className="pr-4 text-lg font-bold text-graphite">{item.title}</span>
                  <span className="text-2xl font-extrabold text-accent-teal">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-base py-20 md:py-28">
        <div className="container mx-auto max-w-3xl px-4 md:px-8">
          <div className="mb-12 text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-accent-teal/90">
              {copy.faqEyebrow}
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-4xl md:leading-[1.05]">
              {copy.faqTitle}
            </h2>
          </div>
          <div className="mb-10 space-y-4">
            {copy.faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-graphite/5 bg-surface shadow-premium-soft [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between rounded-2xl p-6 font-bold text-graphite outline-none transition duration-200 hover:bg-base/40 focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2">
                  {faq.q}
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-graphite/50 transition-transform group-open:-rotate-180">
                    <path fill="currentColor" d="M12 15.4 6.3 9.7l1.4-1.4L12 12.6l4.3-4.3 1.4 1.4z" />
                  </svg>
                </summary>
                <div className="mt-2 border-t border-graphite/5 p-6 pt-0 text-graphite/70">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
          <div className="flex justify-center">
            <a
              href="#contact"
              className="flex justify-center rounded-full bg-graphite px-6 py-3 text-center font-bold text-white shadow-premium-soft transition-transform active:scale-95 hover:bg-graphite/90"
            >
              {copy.faqCta}
            </a>
          </div>
        </div>
      </section>

      <HomeContactSection locale={locale} />
    </main>
  );
}
