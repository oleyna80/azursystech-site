import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { LOCALE_COOKIE_KEY, resolveLocale } from "@/i18n";
import { LEGAL_CONTACT, LEGAL_HOSTING } from "@/lib/legal-content";

type LegalLocale = "fr" | "ru" | "en";

type DefinitionItem = {
  label: string;
  value: string;
  href?: string;
};

type LegalSection = {
  title: string;
  paragraphs?: string[];
  definitions?: DefinitionItem[];
};

const LEGAL_PAGE = {
  fr: {
    meta: {
      title: "Mentions légales | AzurSysTech",
      description:
        "Mentions légales d’AzurSysTech : identification du site, éditeur, hébergement, contact et cadre juridique applicable en France.",
    },
    eyebrow: "AzurSysTech",
    title: "Mentions légales",
    intro:
      "Cette page contient les informations obligatoires concernant le site AzurSysTech et son propriétaire, conformément au droit applicable en France.",
    sections: [
      {
        title: "1. Identification du site",
        definitions: [
          { label: "Domaine", value: "azursystech.fr" },
          { label: "Marque publique", value: "AzurSysTech" },
          {
            label: "Objet du site",
            value:
              "Présentation des services informatiques et réception des demandes via le formulaire du site, le téléphone, WhatsApp et l’email.",
          },
        ],
      },
      {
        title: "2. Propriétaire du site",
        definitions: [
          { label: "Entrepreneur", value: "Dmitrii OLEINIK" },
          { label: "Statut", value: "Entrepreneur individuel (micro-entrepreneur)" },
          { label: "SIREN", value: "940 870 140" },
          { label: "SIRET", value: "940 870 140 00016" },
          { label: "Code APE / NAF", value: "6201Z — Programmation informatique" },
          { label: "Adresse professionnelle", value: "9 AV EMMANUEL BRIDAULT, 06000 NICE, France" },
        ],
      },
      {
        title: "3. Coordonnées",
        definitions: [
          { label: "Email", value: LEGAL_CONTACT.email, href: `mailto:${LEGAL_CONTACT.email}` },
          { label: "Téléphone", value: LEGAL_CONTACT.phoneDisplay, href: LEGAL_CONTACT.phoneHref },
          { label: "WhatsApp", value: LEGAL_CONTACT.whatsappDisplay, href: LEGAL_CONTACT.whatsappHref },
        ],
      },
      {
        title: "4. Responsable de la publication",
        paragraphs: [
          "Le responsable de la publication du contenu du site est Dmitrii OLEINIK. Les contenus sont publiés au nom de la marque AzurSysTech.",
        ],
      },
      {
        title: "5. Hébergement",
        definitions: [
          { label: "Hébergeur", value: LEGAL_HOSTING.provider },
          { label: "Adresse de l’hébergeur", value: LEGAL_HOSTING.address },
          { label: "Site web", value: LEGAL_HOSTING.website, href: LEGAL_HOSTING.website },
        ],
      },
      {
        title: "6. Propriété intellectuelle",
        paragraphs: [
          "Les textes, la structure du site, les éléments visuels, le logo, les graphismes et les autres contenus publiés sur le site AzurSysTech sont protégés par le droit applicable en matière de propriété intellectuelle.",
          "Toute copie, reproduction, diffusion ou réutilisation sans autorisation préalable est interdite, sauf dans les cas expressément prévus par la loi.",
        ],
      },
      {
        title: "7. Limitation de responsabilité",
        paragraphs: [
          "AzurSysTech s’efforce de publier des informations exactes et à jour. Les informations du site sont toutefois fournies à titre informatif et peuvent évoluer.",
          "Le propriétaire du site n’est pas responsable des conséquences directes ou indirectes liées à l’utilisation des informations du site sans vérification complémentaire, sauf disposition impérative contraire.",
        ],
      },
      {
        title: "8. Liens externes",
        paragraphs: [
          "Le site peut contenir des liens vers des ressources externes. AzurSysTech n’est pas responsable du contenu des sites tiers accessibles par ces liens.",
        ],
      },
      {
        title: "9. Droit applicable",
        paragraphs: ["Le site et son contenu sont régis par le droit applicable en France."],
      },
      {
        title: "10. Protection des données",
        paragraphs: [
          "Les informations détaillées sur la collecte, l’utilisation et la protection des données personnelles sont publiées sur la page de politique de confidentialité.",
        ],
      },
      {
        title: "11. Informations complémentaires",
        paragraphs: [
          "Si certaines mentions obligatoires doivent être précisées ou mises à jour en raison d’évolutions légales, administratives ou techniques, cette page sera ajustée en conséquence.",
        ],
      },
    ] as LegalSection[],
    privacyPrefix:
      "Les informations détaillées sur la collecte, l’utilisation et la protection des données personnelles sont publiées sur la page de ",
    privacyLink: "politique de confidentialité",
    privacySuffix: ".",
  },
  ru: {
    meta: {
      title: "Правовая информация | AzurSysTech",
      description:
        "Правовая информация об AzurSysTech: владелец сайта, контактные данные, хостинг и правовые условия использования сайта во Франции.",
    },
    eyebrow: "AzurSysTech",
    title: "Правовая информация",
    intro:
      "Эта страница содержит обязательные сведения о сайте AzurSysTech и его владельце в соответствии с применимым правом Франции.",
    sections: [
      {
        title: "1. Идентификация сайта",
        definitions: [
          { label: "Домен", value: "azursystech.fr" },
          { label: "Публичный бренд", value: "AzurSysTech" },
          {
            label: "Назначение сайта",
            value: "Информирование об IT-услугах и приём обращений через форму сайта, телефон, WhatsApp и email.",
          },
        ],
      },
      {
        title: "2. Владелец сайта",
        definitions: [
          { label: "Предприниматель", value: "Dmitrii OLEINIK" },
          { label: "Статус", value: "Entrepreneur individuel (micro-entrepreneur)" },
          { label: "SIREN", value: "940 870 140" },
          { label: "SIRET", value: "940 870 140 00016" },
          { label: "Код APE / NAF", value: "6201Z — Programmation informatique" },
          { label: "Профессиональный адрес", value: "9 AV EMMANUEL BRIDAULT, 06000 NICE, France" },
        ],
      },
      {
        title: "3. Контактные данные",
        definitions: [
          { label: "Email", value: LEGAL_CONTACT.email, href: `mailto:${LEGAL_CONTACT.email}` },
          { label: "Телефон", value: LEGAL_CONTACT.phoneDisplay, href: LEGAL_CONTACT.phoneHref },
          { label: "WhatsApp", value: LEGAL_CONTACT.whatsappDisplay, href: LEGAL_CONTACT.whatsappHref },
        ],
      },
      {
        title: "4. Ответственный за публикацию",
        paragraphs: [
          "Ответственный за публикацию материалов сайта: Dmitrii OLEINIK. Все материалы сайта публикуются от имени бренда AzurSysTech.",
        ],
      },
      {
        title: "5. Хостинг",
        definitions: [
          { label: "Провайдер", value: LEGAL_HOSTING.provider },
          { label: "Адрес провайдера", value: LEGAL_HOSTING.address },
          { label: "Сайт провайдера", value: LEGAL_HOSTING.website, href: LEGAL_HOSTING.website },
        ],
      },
      {
        title: "6. Интеллектуальная собственность",
        paragraphs: [
          "Все тексты, структура сайта, визуальные элементы, логотип, графика и иные материалы, размещённые на сайте AzurSysTech, защищены применимым законодательством об интеллектуальной собственности.",
          "Любое копирование, воспроизведение, распространение или использование материалов сайта без предварительного разрешения запрещено, кроме случаев, прямо допускаемых законом.",
        ],
      },
      {
        title: "7. Ограничение ответственности",
        paragraphs: [
          "AzurSysTech стремится размещать на сайте точную и актуальную информацию. Однако сведения, размещённые на сайте, предоставляются исключительно в информационных целях и могут изменяться.",
          "Владелец сайта не несёт ответственности за прямые или косвенные последствия использования информации сайта без дополнительного подтверждения, если иное не предусмотрено обязательными нормами закона.",
        ],
      },
      {
        title: "8. Внешние ссылки",
        paragraphs: [
          "Сайт может содержать ссылки на внешние ресурсы. AzurSysTech не несёт ответственности за содержание внешних сайтов, доступных по этим ссылкам.",
        ],
      },
      {
        title: "9. Применимое право",
        paragraphs: ["Сайт и его содержание регулируются применимым правом Франции."],
      },
      {
        title: "10. Защита персональных данных",
        paragraphs: [
          "Подробная информация о сборе, использовании и защите персональных данных опубликована на странице политики конфиденциальности.",
        ],
      },
      {
        title: "11. Дополнительная информация",
        paragraphs: [
          "Если отдельные обязательные сведения подлежат уточнению или обновлению в силу изменений законодательства, административных данных или технической инфраструктуры сайта, соответствующая информация будет обновлена на этой странице.",
        ],
      },
    ] as LegalSection[],
    privacyPrefix:
      "Подробная информация о сборе, использовании и защите персональных данных опубликована на странице ",
    privacyLink: "политики конфиденциальности",
    privacySuffix: ".",
  },
  en: {
    meta: {
      title: "Legal information | AzurSysTech",
      description:
        "Legal notices for AzurSysTech: site identification, publisher, hosting, contact details, and applicable legal framework in France.",
    },
    eyebrow: "AzurSysTech",
    title: "Legal Information",
    intro:
      "This page contains mandatory legal information regarding the AzurSysTech website and its operator, pursuant to applicable French law.",
    sections: [
      {
        title: "1. Website Identification",
        definitions: [
          { label: "Domain", value: "azursystech.fr" },
          { label: "Brand name", value: "AzurSysTech" },
          {
            label: "Purpose",
            value:
              "Presentation of IT services and reception of enquiries via website forms, telephone, WhatsApp, and email.",
          },
        ],
      },
      {
        title: "2. Website Operator",
        definitions: [
          { label: "Operator", value: "Dmitrii OLEINIK" },
          { label: "Legal form", value: "Entrepreneur individuel (micro-entrepreneur)" },
          { label: "SIREN", value: "940 870 140" },
          { label: "SIRET", value: "940 870 140 00016" },
          { label: "APE / NAF code", value: "6201Z — Computer programming activities" },
          { label: "Business address", value: "9 AV EMMANUEL BRIDAULT, 06000 NICE, France" },
        ],
      },
      {
        title: "3. Contact Details",
        definitions: [
          { label: "Email", value: LEGAL_CONTACT.email, href: `mailto:${LEGAL_CONTACT.email}` },
          { label: "Phone", value: LEGAL_CONTACT.phoneDisplay, href: LEGAL_CONTACT.phoneHref },
          { label: "WhatsApp", value: LEGAL_CONTACT.whatsappDisplay, href: LEGAL_CONTACT.whatsappHref },
        ],
      },
      {
        title: "4. Publication Director",
        paragraphs: [
          "The publication director of this website is Dmitrii OLEINIK. Content is published under the AzurSysTech brand name.",
        ],
      },
      {
        title: "5. Hosting",
        definitions: [
          { label: "Hosting provider", value: LEGAL_HOSTING.provider },
          { label: "Provider address", value: LEGAL_HOSTING.address },
          { label: "Website", value: LEGAL_HOSTING.website, href: LEGAL_HOSTING.website },
        ],
      },
      {
        title: "6. Intellectual Property",
        paragraphs: [
          "All texts, site structure, visual assets, logos, graphics, and other content published on the AzurSysTech website are protected by applicable intellectual property legislation.",
          "Any reproduction, distribution, or reuse without prior written authorization is prohibited, except as expressly permitted by law.",
        ],
      },
      {
        title: "7. Limitation of Liability",
        paragraphs: [
          "AzurSysTech strives to maintain accurate and up-to-date information. However, information is provided for general reference and may be updated without prior notice.",
          "The website operator shall not be liable for direct or indirect consequences arising from the use of site content without prior verification, unless otherwise provided by mandatory law.",
        ],
      },
      {
        title: "8. External Links",
        paragraphs: [
          "The site may contain links to external resources. AzurSysTech is not responsible for the content of third-party websites accessed via these links.",
        ],
      },
      {
        title: "9. Applicable Law",
        paragraphs: ["This website and its content are governed by the laws of France."],
      },
      {
        title: "10. Data Protection",
        paragraphs: [
          "Detailed information regarding the collection, use, and protection of personal data is provided on our privacy policy page.",
        ],
      },
      {
        title: "11. Additional Information",
        paragraphs: [
          "Should any mandatory disclosures require clarification or updates due to legal, administrative, or technical changes, this page will be updated accordingly.",
        ],
      },
    ] as LegalSection[],
    privacyPrefix:
      "Detailed information regarding the collection, use, and protection of personal data is provided on our ",
    privacyLink: "privacy policy page",
    privacySuffix: ".",
  },
} as const satisfies Record<
  LegalLocale,
  {
    meta: Metadata;
    eyebrow: string;
    title: string;
    intro: string;
    sections: LegalSection[];
    privacyPrefix: string;
    privacyLink: string;
    privacySuffix: string;
  }
>;

function resolveLegalLocale(value?: string | null): LegalLocale {
  const resolved = resolveLocale(value);
  return resolved === "ru" ? "ru" : resolved === "en" ? "en" : "fr";
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolveLegalLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);

  return LEGAL_PAGE[locale].meta;
}

export default async function LegalPage() {
  const cookieStore = await cookies();
  const locale = resolveLegalLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);
  const copy = LEGAL_PAGE[locale];

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
            {section.definitions ? (
              <dl className="grid gap-3 text-[#1F2A37]/90">
                {section.definitions.map((item) => (
                  <div key={item.label}>
                    <dt className="text-sm text-[#1F2A37]/70">{item.label}</dt>
                    <dd className={item.href ? "" : "font-medium"}>
                      {item.href ? (
                        <a className="font-medium text-[#1F6F78] underline" href={item.href}>
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {section.paragraphs?.map((paragraph, paragraphIndex) => {
              const isPrivacySection = index === 9 && paragraphIndex === 0;
              return (
                <p key={paragraph} className="leading-7 text-[#1F2A37]/90">
                  {isPrivacySection ? (
                    <>
                      {copy.privacyPrefix}
                      <Link className="font-medium text-[#1F6F78] underline" href="/privacy">
                        {copy.privacyLink}
                      </Link>
                      {copy.privacySuffix}
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              );
            })}
          </section>
        ))}
      </div>
    </main>
  );
}
