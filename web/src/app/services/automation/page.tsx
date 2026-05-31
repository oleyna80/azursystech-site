import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { LOCALE_COOKIE_KEY, resolveLocale } from "@/i18n";

type PageLocale = "fr" | "ru";

export const metadata: Metadata = {
  title: "Automatisation IA pour petites entreprises à Nice | AzurSysTech",
  description:
    "Agent IA pour demandes entrantes, notifications, brief et intégration légère aux outils existants pour TPE et indépendants.",
};

const CONTENT = {
  fr: {
    eyebrow: "AzurSysTech — Automatisation IA",
    title: "Automatisez la réception et le traitement de vos demandes entrantes",
    intro:
      "Un agent IA ou un formulaire intelligent aide à comprendre le besoin, proposer le bon chemin et transmettre une demande structurée sans promettre prix, délais ou décisions commerciales.",
    audienceTitle: "Pour qui",
    situationsTitle: "Situations typiques",
    helpTitle: "Ce qu'on met en place",
    whyTitle: "Pourquoi ce format",
    pricingTitle: "Repères de départ",
    faqTitle: "Questions fréquentes",
    nextTitle: "Prochaine étape",
    briefCta: "Décrire mon projet",
    servicesCta: "Tous les services",
    useCasesCta: "Voir les cas d'usage IA",
    audience: [
      "Commerce, cabinet ou studio qui reçoit des demandes par plusieurs canaux.",
      "Indépendant ou TPE qui veut arrêter de traiter manuellement chaque demande.",
      "Petite équipe sans responsable technique dédié.",
      "Structure avec un flux répétitif de demandes, appels ou formulaires.",
    ],
    situations: [
      "Les demandes arrivent par plusieurs canaux sans format commun.",
      "Chaque nouvelle demande demande une saisie manuelle dans un tableur.",
      "Les leads sont perdus faute de traitement rapide.",
      "Il est difficile de savoir quelles demandes méritent une réponse prioritaire.",
    ],
    helpItems: [
      "Agent IA qui oriente le visiteur sans collecter de contacts dans le chat.",
      "Contact form CTA pour les demandes simples et brief optionnel pour les projets d'automatisation.",
      "Résumé structuré transmis au propriétaire quand une demande est prête.",
      "Intégration possible vers Google Sheets, Notion ou CRM léger.",
      "Limites explicites : pas de prix, de délais ou de décisions commerciales automatiques.",
    ],
    whyItems: [
      "On commence par un seul processus, pas par une refonte complète.",
      "Le système reste contrôlable : l'IA prépare, l'humain décide.",
      "Le résultat se mesure sur le temps de traitement et la qualité des demandes.",
      "Le flux peut évoluer ensuite vers d'autres canaux quand l'intégration est prête.",
    ],
    pricingItems: [
      "Agent IA pour demandes entrantes — à partir de 800 €.",
      "Site + formulaire + intake automatisé — à partir de 600 €.",
      "Notifications internes — selon le canal et l'intégration.",
      "Maintenance et ajustements — sur demande.",
    ],
    pricingNote:
      "Le montant exact est confirmé après description du flux, des canaux et des outils existants.",
    faqs: [
      {
        question: "Faut-il changer tout l'existant pour automatiser ?",
        answer:
          "Non. Dans la plupart des cas, on automatise d'abord un seul processus existant.",
      },
      {
        question: "L'agent IA peut-il répondre seul aux clients ?",
        answer:
          "Oui pour des réponses cadrées et l'orientation. Pour les prix, les délais et les cas non standard, un humain reste nécessaire.",
      },
      {
        question: "Par où commencer si plusieurs processus posent problème ?",
        answer:
          "On choisit le processus qui consomme le plus de temps ou fait perdre le plus de demandes, puis on valide ce premier flux.",
      },
    ],
    nextText:
      "Décrivez votre flux actuel via le brief : activité, canal de contact, questions fréquentes, outils déjà utilisés. Cela suffit pour proposer un premier cadrage.",
  },
  ru: {
    eyebrow: "AzurSysTech — AI-автоматизация",
    title: "Автоматизируйте прием и первичную обработку входящих заявок",
    intro:
      "AI-агент или умная форма помогают понять запрос, выбрать правильный следующий шаг и передать структурированную заявку без обещаний цены, сроков или коммерческих решений.",
    audienceTitle: "Для кого",
    situationsTitle: "Типовые ситуации",
    helpTitle: "Что внедряем",
    whyTitle: "Почему такой формат",
    pricingTitle: "Стартовые ориентиры",
    faqTitle: "Частые вопросы",
    nextTitle: "Следующий шаг",
    briefCta: "Описать проект",
    servicesCta: "Все услуги",
    useCasesCta: "Смотреть AI-сценарии",
    audience: [
      "Магазин, кабинет или студия, которые получают заявки из разных каналов.",
      "Предприниматель или малый бизнес, где каждое обращение обрабатывается вручную.",
      "Небольшая команда без отдельного технического специалиста.",
      "Бизнес с повторяющимися заявками, звонками или формами.",
    ],
    situations: [
      "Заявки приходят из разных каналов без единого формата.",
      "Каждое обращение приходится вручную переносить в таблицу.",
      "Лиды теряются из-за медленной первичной обработки.",
      "Непонятно, какие обращения требуют первоочередного ответа.",
    ],
    helpItems: [
      "AI-агент ориентирует посетителя, не собирая контакты в чате.",
      "Контактная форма для простых заявок и опциональный бриф для автоматизации.",
      "Структурированное резюме передается владельцу, когда заявка готова.",
      "Возможна связка с Google Sheets, Notion или легкой CRM.",
      "Явные ограничения: без автоматических цен, сроков и коммерческих решений.",
    ],
    whyItems: [
      "Начинаем с одного процесса, а не с перестройки всего бизнеса.",
      "Система остается управляемой: AI готовит, человек принимает решения.",
      "Результат измеряется временем обработки и качеством заявок.",
      "Поток можно позже расширить на другие каналы, когда интеграция готова.",
    ],
    pricingItems: [
      "AI-агент для входящих заявок — от 800 €.",
      "Сайт + форма + автоматизированный intake — от 600 €.",
      "Внутренние уведомления — зависит от канала и интеграции.",
      "Поддержка и доработка — по запросу.",
    ],
    pricingNote:
      "Точная сумма определяется после описания процесса, каналов и текущих инструментов.",
    faqs: [
      {
        question: "Нужно менять всё, чтобы начать автоматизацию?",
        answer: "Нет. Обычно разумнее начать с одного существующего процесса.",
      },
      {
        question: "AI-агент может сам отвечать клиентам?",
        answer:
          "Да, если ответы заранее ограничены. Цены, сроки и нестандартные случаи остаются за человеком.",
      },
      {
        question: "С чего начать, если проблемных процессов несколько?",
        answer:
          "Выбираем процесс, который съедает больше всего времени или теряет больше всего заявок, и проверяем первый поток.",
      },
    ],
    nextText:
      "Опишите текущий поток через бриф: деятельность, канал связи, частые вопросы, текущие инструменты. Этого достаточно для первого определения рамок.",
  },
} as const;

async function getPageLocale(): Promise<PageLocale> {
  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value) === "ru" ? "ru" : "fr";
}

function ListSection({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
      <h2 className="font-serif text-2xl text-[#1F2A37]">{title}</h2>
      <ul className="mt-5 grid gap-3 text-[#1F2A37]/90 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="rounded-lg border border-[#D8D0C4] p-4">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function AutomationServicePage() {
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
            <Link href="/brief" className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white hover:bg-[#185A61]">
              {copy.briefCta}
            </Link>
            <Link href="/ai-automation" className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]">
              {copy.useCasesCta}
            </Link>
          </div>
        </section>

        <ListSection title={copy.audienceTitle} items={copy.audience} />
        <ListSection title={copy.situationsTitle} items={copy.situations} />
        <ListSection title={copy.helpTitle} items={copy.helpItems} />
        <ListSection title={copy.whyTitle} items={copy.whyItems} />

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">{copy.pricingTitle}</h2>
          <ul className="mt-5 grid gap-3 text-[#1F2A37]/90">
            {copy.pricingItems.map((item) => (
              <li key={item} className="rounded-lg border border-[#D8D0C4] p-4">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[#1F2A37]/70">{copy.pricingNote}</p>
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
          <h2 className="font-serif text-2xl text-[#1F2A37]">{copy.nextTitle}</h2>
          <p className="mt-3 max-w-4xl text-[#1F2A37]/90">{copy.nextText}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/brief" className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white hover:bg-[#185A61]">
              {copy.briefCta}
            </Link>
            <Link href="/services" className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]">
              {copy.servicesCta}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
