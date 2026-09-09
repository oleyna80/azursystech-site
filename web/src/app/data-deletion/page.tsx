import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { LOCALE_COOKIE_KEY, resolveLocale } from "@/i18n";
import { LEGAL_CONTACT } from "@/lib/legal-content";

const BASE_URL = "https://azursystech.fr";

type DeletionLocale = "fr" | "ru" | "en";

type DeletionSection = {
  title: string;
  paragraphs: string[];
  items?: string[];
};

const DATA_DELETION_PAGE = {
  fr: {
    meta: {
      title: "Suppression des données | AzurSysTech",
      description:
        "Instructions pour demander la suppression des données personnelles transmises à AzurSysTech via le site, le chat ou les canaux de contact.",
    },
    eyebrow: "AzurSysTech",
    title: "Suppression des données",
    intro:
      "Si vous souhaitez demander la suppression de vos données personnelles, suivez les instructions ci-dessous.",
    sections: [
      {
        title: "1. Objet de cette page",
        paragraphs: [
          "Cette page explique comment demander la suppression des données personnelles que vous avez transmises à AzurSysTech via le site, le formulaire, le chat, l'email, le téléphone ou WhatsApp.",
          "Elle est fournie notamment pour répondre aux exigences de services tiers tels que Meta ou Facebook lorsqu'un lien public de suppression des données est demandé.",
        ],
      },
      {
        title: "2. Comment faire une demande",
        paragraphs: [
          "Pour demander la suppression de vos données, envoyez un message à AzurSysTech par email ou WhatsApp en indiquant clairement qu'il s'agit d'une demande de suppression des données.",
        ],
        items: [
          `Email : ${LEGAL_CONTACT.email}`,
          `WhatsApp : ${LEGAL_CONTACT.whatsappDisplay}`,
        ],
      },
      {
        title: "3. Informations à fournir",
        paragraphs: ["Pour traiter votre demande plus vite, merci de préciser si possible :"],
        items: [
          "votre nom ou le nom utilisé lors de la prise de contact",
          "l'adresse email ou le numéro de téléphone concerné",
          "la date approximative de votre demande ou de votre échange",
          "tout élément utile pour identifier les données à supprimer",
        ],
      },
      {
        title: "4. Vérification et traitement",
        paragraphs: [
          "AzurSysTech peut demander des informations complémentaires raisonnables pour vérifier que la demande provient bien de la personne concernée ou de son représentant autorisé.",
          "Si la demande est recevable, les données seront supprimées ou anonymisées dans la mesure permise par la loi et par les contraintes techniques applicables.",
        ],
      },
      {
        title: "5. Limites légales",
        paragraphs: [
          "Certaines données peuvent devoir être conservées lorsqu'une obligation légale, comptable, contractuelle ou de sécurité l'impose.",
          "Dans ce cas, les données concernées ne seront conservées que dans la limite nécessaire à cette obligation.",
        ],
      },
      {
        title: "6. Informations complémentaires",
        paragraphs: [
          "Pour en savoir plus sur la collecte et le traitement des données, vous pouvez consulter la politique de confidentialité et les mentions légales du site.",
        ],
      },
    ] as DeletionSection[],
    privacyLink: "Politique de confidentialité",
    legalLink: "Mentions légales",
  },
  ru: {
    meta: {
      title: "Удаление данных | AzurSysTech",
      description:
        "Инструкции по запросу удаления персональных данных, переданных AzurSysTech через сайт, форму или каналы связи.",
    },
    eyebrow: "AzurSysTech",
    title: "Удаление персональных данных",
    intro:
      "Если вы хотите запросить удаление ваших персональных данных, следуйте инструкциям ниже.",
    sections: [
      {
        title: "1. Назначение страницы",
        paragraphs: [
          "Эта страница объясняет, как запросить удаление персональных данных, которые вы передали AzurSysTech через сайт, форму, чат, email, телефон или WhatsApp.",
          "Страница создана в том числе для соответствия требованиям сторонних сервисов, таких как Meta/Facebook, где требуется публичная ссылка на инструкцию по удалению данных.",
        ],
      },
      {
        title: "2. Как подать запрос",
        paragraphs: [
          "Для запроса удаления данных отправьте сообщение в AzurSysTech по электронной почте или в WhatsApp с явным указанием темы «Запрос на удаление данных».",
        ],
        items: [
          `Email: ${LEGAL_CONTACT.email}`,
          `WhatsApp: ${LEGAL_CONTACT.whatsappDisplay}`,
        ],
      },
      {
        title: "3. Данные для указания в запросе",
        paragraphs: ["Чтобы мы быстрее обработали запрос, укажите, пожалуйста:"],
        items: [
          "ваше имя, указанное при первом обращении",
          "адрес электронной почты или номер телефона",
          "примерную дату обращения",
          "любые дополнительные сведения для идентификации данных",
        ],
      },
      {
        title: "4. Проверка и исполнение",
        paragraphs: [
          "AzurSysTech может запросить разумные уточнения для подтверждения личности заявителя.",
          "При подтверждении законности запроса данные будут удалены или обезличены в установленные законом сроки.",
        ],
      },
      {
        title: "5. Законные ограничения",
        paragraphs: [
          "Отдельные данные могут сохраняться, если это требуется по закону, для целей бухгалтерского учёта или безопасности.",
          "В таких случаях данные сохраняются исключительно в пределах, предусмотренных законом.",
        ],
      },
      {
        title: "6. Дополнительная информация",
        paragraphs: [
          "Подробнее об обработке данных читайте в Политике конфиденциальности и Правовой информации.",
        ],
      },
    ] as DeletionSection[],
    privacyLink: "Политика конфиденциальности",
    legalLink: "Правовая информация",
  },
  en: {
    meta: {
      title: "Data deletion | AzurSysTech",
      description:
        "Instructions on how to request deletion of personal data submitted to AzurSysTech via website, intake forms, or contact channels.",
    },
    eyebrow: "AzurSysTech",
    title: "Data Deletion Request",
    intro:
      "If you wish to request the deletion of your personal data, please follow the instructions below.",
    sections: [
      {
        title: "1. Purpose of this Page",
        paragraphs: [
          "This page explains how to request the deletion of personal data provided to AzurSysTech via the website, intake forms, chat assistants, email, phone, or WhatsApp.",
          "It is also provided to comply with platform requirements (such as Meta/Facebook Data Deletion Callback requirements) where a public data deletion URL is required.",
        ],
      },
      {
        title: "2. How to Submit a Request",
        paragraphs: [
          "To request the deletion of your data, send a message to AzurSysTech via email or WhatsApp clearly stating that you are requesting data deletion.",
        ],
        items: [
          `Email: ${LEGAL_CONTACT.email}`,
          `WhatsApp: ${LEGAL_CONTACT.whatsappDisplay}`,
        ],
      },
      {
        title: "3. Information to Provide",
        paragraphs: ["To process your request promptly, please provide:"],
        items: [
          "your name as provided during initial contact",
          "the relevant email address or phone number",
          "approximate date of your interaction",
          "any relevant context to identify the data to be deleted",
        ],
      },
      {
        title: "4. Verification & Processing",
        paragraphs: [
          "AzurSysTech may request reasonable additional information to verify the identity of the requester.",
          "Upon validation, data will be permanently deleted or anonymized within statutory timeframes.",
        ],
      },
      {
        title: "5. Statutory Limitations",
        paragraphs: [
          "Certain records may need to be retained where required by statutory, accounting, contractual, or security obligations.",
          "In such cases, data is retained strictly to the extent required by applicable law.",
        ],
      },
      {
        title: "6. Further Information",
        paragraphs: [
          "For further details on data processing, please consult our privacy policy and legal notices.",
        ],
      },
    ] as DeletionSection[],
    privacyLink: "Privacy policy",
    legalLink: "Legal information",
  },
} as const satisfies Record<
  DeletionLocale,
  {
    meta: Metadata;
    eyebrow: string;
    title: string;
    intro: string;
    sections: DeletionSection[];
    privacyLink: string;
    legalLink: string;
  }
>;

function resolveDeletionLocale(value?: string | null): DeletionLocale {
  const resolved = resolveLocale(value);
  return resolved === "ru" ? "ru" : resolved === "en" ? "en" : "fr";
}

type DataDeletionPageProps = {
  searchParams?: Promise<{ locale?: string }>;
};

export async function generateMetadata(props: DataDeletionPageProps): Promise<Metadata> {
  const cookieStore = await cookies();
  const searchParams = await props.searchParams;
  const locale = resolveDeletionLocale(searchParams?.locale || cookieStore.get(LOCALE_COOKIE_KEY)?.value);

  return {
    ...DATA_DELETION_PAGE[locale].meta,
    alternates: { canonical: `${BASE_URL}/data-deletion` },
  };
}

export default async function DataDeletionPage(props: DataDeletionPageProps) {
  const cookieStore = await cookies();
  const searchParams = await props.searchParams;
  const locale = resolveDeletionLocale(searchParams?.locale || cookieStore.get(LOCALE_COOKIE_KEY)?.value);
  const copy = DATA_DELETION_PAGE[locale];

  return (
    <main className="bg-[#F6F1E8] px-6 py-12 text-[#1F2A37]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">{copy.eyebrow}</p>
          <div className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
            <h1 className="font-serif text-3xl sm:text-4xl">{copy.title}</h1>
            <p className="text-base leading-7 text-[#1F2A37]/90">{copy.intro}</p>
          </div>
        </header>

        {copy.sections.map((section, index) => (
          <section
            key={section.title}
            className={`flex flex-col gap-4 ${index < copy.sections.length - 1 ? "border-b border-[#D8D0C4] pb-8" : ""}`}
          >
            <h2 className="font-serif text-2xl">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="leading-7 text-[#1F2A37]/90">
                {paragraph}
              </p>
            ))}
            {section.items ? (
              <ul className="grid gap-2 text-[#1F2A37]/90">
                {section.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section className="flex flex-wrap gap-4 pt-2 text-sm font-medium">
          <Link className="text-[#1F6F78] underline" href="/privacy">
            {copy.privacyLink}
          </Link>
          <Link className="text-[#1F6F78] underline" href="/legal">
            {copy.legalLink}
          </Link>
          <a className="text-[#1F6F78] underline" href={`mailto:${LEGAL_CONTACT.email}`}>
            {LEGAL_CONTACT.email}
          </a>
        </section>
      </div>
    </main>
  );
}
