import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { LOCALE_COOKIE_KEY, resolveLocale } from "@/i18n";

type ThankYouLocale = "fr" | "ru";

const CONTACT = {
  phoneDisplay: "+33 7 80 72 09 94",
  phoneHref: "tel:+33780720994",
  whatsappDisplay: "+33 7 80 72 09 94",
  whatsappHref: "https://wa.me/33780720994",
  email: "contact@azursystech.fr",
};

const THANK_YOU_COPY = {
  fr: {
    meta: {
      title: "Demande reçue | AzurSysTech",
      description:
        "Confirmation d’envoi de la demande AzurSysTech et prochains pas pour le contact et la clarification du besoin.",
    },
    eyebrow: "AzurSysTech",
    title: "Merci, nous avons bien reçu la demande",
    intro:
      "Nous avons reçu votre message et nous reviendrons vers vous pour clarifier les détails et définir le prochain pas adapté au besoin.",
    nextTitle: "Ce qui se passe ensuite",
    nextSteps: [
      "Nous relisons la description du besoin et les coordonnées laissées dans la demande.",
      "Si nécessaire, nous clarifions quelques points par le canal de contact le plus pratique.",
      "Une fois le besoin clarifié, nous passons au prochain pas le plus sûr et le plus compréhensible.",
    ],
    urgentTitle: "Si la demande est urgente",
    urgentText:
      "Vous pouvez aussi nous joindre directement sur WhatsApp ou par téléphone. Cela permet d’éclaircir plus vite les détails des demandes urgentes.",
    fallbackTitle: "Canaux de secours",
    fallbackText:
      "Si vous devez compléter la demande ou changer de canal, utilisez l’une des options ci-dessous.",
    contactPageCta: "Ouvrir la page contact",
    callCta: `Appeler : ${CONTACT.phoneDisplay}`,
    whatsappCta: `WhatsApp : ${CONTACT.whatsappDisplay}`,
    emailCta: `Email : ${CONTACT.email}`,
    routesTitle: "Liens utiles",
    routesText:
      "En attendant notre retour, vous pouvez consulter les sections utiles et préparer des informations complémentaires sur le besoin.",
    servicesCta: "Services",
    businessCta: "Pour les entreprises",
    homeCta: "Accueil",
    faqCta: "FAQ",
  },
  ru: {
    meta: {
      title: "Заявку получили | AzurSysTech",
      description:
        "Подтверждение отправки заявки AzurSysTech и следующие шаги по уточнению задачи и контакту.",
    },
    eyebrow: "AzurSysTech",
    title: "Спасибо, заявку получили",
    intro:
      "Мы получили ваше обращение и вернёмся к вам, чтобы уточнить детали и согласовать следующий шаг по задаче.",
    nextTitle: "Что дальше",
    nextSteps: [
      "Проверяем описание задачи и контактные данные из заявки.",
      "При необходимости уточняем несколько деталей по удобному каналу связи.",
      "После уточнения переходим к безопасному и понятному следующему шагу.",
    ],
    urgentTitle: "Если вопрос срочный",
    urgentText:
      "Можно дополнительно связаться напрямую через WhatsApp или по телефону. Это помогает быстрее уточнить детали по срочным обращениям.",
    fallbackTitle: "Резервные способы связи",
    fallbackText:
      "Если нужно дополнить заявку или сменить канал общения, используйте любой вариант ниже.",
    contactPageCta: "Перейти на страницу контактов",
    callCta: `Позвонить: ${CONTACT.phoneDisplay}`,
    whatsappCta: `WhatsApp: ${CONTACT.whatsappDisplay}`,
    emailCta: `Email: ${CONTACT.email}`,
    routesTitle: "Полезные маршруты",
    routesText:
      "Пока ожидаете ответ, можно посмотреть нужный раздел и подготовить дополнительную информацию по задаче.",
    servicesCta: "Услуги",
    businessCta: "Для бизнеса",
    homeCta: "Главная",
    faqCta: "FAQ",
  },
} as const satisfies Record<
  ThankYouLocale,
  {
    meta: Metadata;
    eyebrow: string;
    title: string;
    intro: string;
    nextTitle: string;
    nextSteps: string[];
    urgentTitle: string;
    urgentText: string;
    fallbackTitle: string;
    fallbackText: string;
    contactPageCta: string;
    callCta: string;
    whatsappCta: string;
    emailCta: string;
    routesTitle: string;
    routesText: string;
    servicesCta: string;
    businessCta: string;
    homeCta: string;
    faqCta: string;
  }
>;

function resolveThankYouLocale(value?: string | null): ThankYouLocale {
  return resolveLocale(value) === "ru" ? "ru" : "fr";
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolveThankYouLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);

  return THANK_YOU_COPY[locale].meta;
}

export default async function ThankYouPage() {
  const cookieStore = await cookies();
  const locale = resolveThankYouLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);
  const copy = THANK_YOU_COPY[locale];

  return (
    <main className="min-h-screen bg-[#F6F1E8] px-4 py-8 text-[#1F2A37] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">{copy.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-3xl leading-tight sm:text-4xl">{copy.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#1F2A37]/90">{copy.intro}</p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <h2 className="font-serif text-2xl">{copy.nextTitle}</h2>
          <ul className="mt-4 grid gap-3 text-sm leading-6 text-[#1F2A37]/90 sm:text-base">
            {copy.nextSteps.map((step, index) => (
              <li key={step} className="rounded-xl border border-[#D8D0C4] bg-[#FFFDFC] px-4 py-3">
                {index + 1}. {step}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <h2 className="font-serif text-2xl">{copy.urgentTitle}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#1F2A37]/90">{copy.urgentText}</p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <h2 className="font-serif text-2xl">{copy.fallbackTitle}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#1F2A37]/90">{copy.fallbackText}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="/contact"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-4 py-3 text-sm font-semibold text-[#1F2A37] transition hover:bg-[#F6F1E8]"
            >
              {copy.contactPageCta}
            </Link>
            <a
              href={CONTACT.phoneHref}
              className="rounded-lg bg-[#1F6F78] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#185A61]"
            >
              {copy.callCta}
            </a>
            <a
              href={CONTACT.whatsappHref}
              className="rounded-lg border border-[#C96F4A] bg-[#FFF3EE] px-4 py-3 text-sm font-semibold text-[#8A4A2F] transition hover:bg-[#FBE8DF]"
            >
              {copy.whatsappCta}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-4 py-3 text-sm font-semibold text-[#1F2A37] transition hover:bg-[#F6F1E8]"
            >
              {copy.emailCta}
            </a>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <h2 className="font-serif text-2xl">{copy.routesTitle}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#1F2A37]/90">{copy.routesText}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/services"
              className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#185A61]"
            >
              {copy.servicesCta}
            </Link>
            <Link
              href="/business"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] transition hover:bg-[#F6F1E8]"
            >
              {copy.businessCta}
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] transition hover:bg-[#F6F1E8]"
            >
              {copy.homeCta}
            </Link>
            <Link
              href="/faq"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] transition hover:bg-[#F6F1E8]"
            >
              {copy.faqCta}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
