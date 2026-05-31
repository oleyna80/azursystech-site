import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { LOCALE_COOKIE_KEY, resolveLocale } from "@/i18n";

type PageLocale = "fr" | "ru";

export const metadata: Metadata = {
  title: "Site web pour petite entreprise à Nice | AzurSysTech",
  description:
    "Landing page ou site vitrine avec formulaire, notifications et option d'automatisation des demandes pour TPE et indépendants.",
};

const CONTENT = {
  fr: {
    eyebrow: "AzurSysTech — Sites web",
    title: "Un site web prêt à recevoir des clients, pas seulement à exister",
    intro:
      "Landing page ou site vitrine avec formulaire clair, notification et possibilité de connecter un agent IA pour qualifier les demandes entrantes.",
    audienceTitle: "Pour qui",
    situationsTitle: "Situations typiques",
    helpTitle: "Ce qu'on met en place",
    whyTitle: "Pourquoi ce format",
    pricingTitle: "Repères de départ",
    faqTitle: "Questions fréquentes",
    nextTitle: "Prochaine étape",
    briefCta: "Décrire mon projet",
    automationCta: "Voir l'automatisation",
    servicesCta: "Tous les services",
    audience: [
      "Commerce, cabinet ou studio qui n'a pas encore de site clair.",
      "Indépendant qui veut une présence web simple et utile.",
      "TPE qui veut connecter le site à un flux de traitement des demandes.",
      "Structure locale qui veut être trouvée et contactée plus facilement.",
    ],
    situations: [
      "Pas de site web, ou un site existant sans formulaire fonctionnel.",
      "Les clients ne comprennent pas clairement ce que vous proposez.",
      "Le site existe mais ne génère pas de demandes exploitables.",
      "Les emails de formulaire se perdent dans une boîte non suivie.",
    ],
    helpItems: [
      "Landing page ou site vitrine en français et russe si nécessaire.",
      "Formulaire de contact avec champs adaptés à l'activité.",
      "Notification au propriétaire quand une demande arrive.",
      "Structure SEO locale de base : title, meta, contenu clair et balisage sémantique.",
      "Connexion optionnelle vers un agent IA ou un brief projet.",
    ],
    whyItems: [
      "Le site est pensé pour recevoir des demandes, pas seulement pour présenter l'activité.",
      "La structure et le texte sont adaptés au métier, pas copiés depuis un template générique.",
      "Le périmètre reste simple : un résultat utile avant les extensions.",
      "Le site peut devenir la porte d'entrée d'un flux automatisé.",
    ],
    pricingItems: [
      "Landing page + formulaire + notification — à partir de 400 €.",
      "Site vitrine multi-pages — à partir de 600 €.",
      "Bundle site + automatisation des demandes entrantes — à partir de 600 €.",
      "Maintenance et mises à jour — sur demande.",
    ],
    pricingNote:
      "Le montant exact dépend du contenu, du nombre de pages, des langues et des intégrations.",
    faqs: [
      {
        question: "Combien de temps faut-il pour mettre le site en ligne ?",
        answer:
          "Le délai dépend du contenu, du nombre de pages et des intégrations. Il est confirmé après lecture du brief.",
      },
      {
        question: "Dois-je fournir les textes ?",
        answer:
          "Pas obligatoirement. On peut préparer une première version à partir du brief, puis vous la validez.",
      },
      {
        question: "Peut-on connecter le formulaire à nos outils ?",
        answer:
          "Oui. Selon le besoin, on peut connecter Google Sheets, Notion, un CRM léger ou une notification interne.",
      },
    ],
    nextText:
      "Décrivez votre activité, vos clients et le type de demandes que le site doit recevoir. Quelques lignes suffisent pour cadrer le premier périmètre.",
  },
  ru: {
    eyebrow: "AzurSysTech — сайты",
    title: "Сайт, который помогает получать клиентов, а не просто существует",
    intro:
      "Лендинг или сайт-визитка с понятной формой, уведомлением и возможностью подключить AI-агента для первичного уточнения заявок.",
    audienceTitle: "Для кого",
    situationsTitle: "Типовые ситуации",
    helpTitle: "Что внедряем",
    whyTitle: "Почему такой формат",
    pricingTitle: "Стартовые ориентиры",
    faqTitle: "Частые вопросы",
    nextTitle: "Следующий шаг",
    briefCta: "Описать проект",
    automationCta: "Смотреть автоматизацию",
    servicesCta: "Все услуги",
    audience: [
      "Магазин, кабинет или студия, у которых нет понятного сайта.",
      "Предприниматель, которому нужна простая и полезная онлайн-точка.",
      "Малый бизнес, который хочет связать сайт с обработкой заявок.",
      "Локальная услуга, которую клиенты должны проще находить и понимать.",
    ],
    situations: [
      "Сайта нет или форма на текущем сайте работает плохо.",
      "Клиентам неясно, что именно вы предлагаете и как связаться.",
      "Сайт есть, но он не приносит понятных заявок.",
      "Письма из формы теряются в почте и не попадают в рабочий процесс.",
    ],
    helpItems: [
      "Лендинг или сайт-визитка на французском и русском при необходимости.",
      "Контактная форма с полями под вашу деятельность.",
      "Уведомление владельцу при новом обращении.",
      "Базовая локальная SEO-структура: title, meta, понятный текст и семантика.",
      "Опциональная связка с AI-агентом или проектным брифом.",
    ],
    whyItems: [
      "Сайт проектируется для приема заявок, а не только для презентации.",
      "Структура и тексты адаптируются под нишу, а не копируются из шаблона.",
      "Первые рамки остаются простыми: сначала рабочий результат, потом расширения.",
      "Сайт может стать входной точкой для автоматизированного потока.",
    ],
    pricingItems: [
      "Лендинг + форма + уведомление — от 400 €.",
      "Сайт-визитка на несколько страниц — от 600 €.",
      "Сайт + автоматизация входящих заявок — от 600 €.",
      "Поддержка и обновления — по запросу.",
    ],
    pricingNote:
      "Точная сумма зависит от контента, количества страниц, языков и интеграций.",
    faqs: [
      {
        question: "Сколько времени занимает запуск сайта?",
        answer:
          "Срок зависит от контента, количества страниц и интеграций. Его можно подтвердить только после просмотра брифа.",
      },
      {
        question: "Мне нужно самому писать тексты?",
        answer:
          "Не обязательно. Можно подготовить первую версию на основе брифа, а затем согласовать ее с вами.",
      },
      {
        question: "Можно подключить форму к моим инструментам?",
        answer:
          "Да. В зависимости от задачи можно подключить Google Sheets, Notion, легкую CRM или внутреннее уведомление.",
      },
    ],
    nextText:
      "Опишите деятельность, клиентов и тип заявок, которые должен принимать сайт. Нескольких строк достаточно для первого определения рамок.",
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

export default async function WebsitesServicePage() {
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
            <Link href="/services/automation" className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]">
              {copy.automationCta}
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
