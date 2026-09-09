import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { LOCALE_COOKIE_KEY, resolveLocale } from "@/i18n";
import { LEGAL_CONTACT } from "@/lib/legal-content";

const BASE_URL = "https://azursystech.fr";

type PrivacyLocale = "fr" | "ru" | "en";

type PrivacySection = {
  title: string;
  intro?: string;
  paragraphs?: string[];
  items?: string[];
};

const PRIVACY_PAGE = {
  fr: {
    meta: {
      title: "Politique de confidentialité | AzurSysTech",
      description:
        "Politique de confidentialité d’AzurSysTech : données collectées, finalités, base de traitement, cookies et utilisation du formulaire et du chat.",
    },
    eyebrow: "AzurSysTech",
    title: "Politique de confidentialité",
    intro:
      "AzurSysTech respecte la confidentialité des utilisateurs du site et traite les données personnelles conformément au droit applicable, y compris le RGPD et le droit français en matière de protection des données.",
    sections: [
      {
        title: "1. Responsable du traitement",
        paragraphs: [
          "Le responsable du traitement est AzurSysTech. Les coordonnées du responsable et les informations juridiques générales figurent sur la page des mentions légales du site.",
        ],
      },
      {
        title: "2. Données susceptibles d’être collectées",
        intro:
          "Selon le mode de prise de contact, AzurSysTech peut collecter les informations suivantes :",
        items: [
          "nom",
          "numéro de téléphone",
          "adresse email",
          "ville",
          "type de demande (particulier / entreprise)",
          "description du besoin",
          "nombre d’appareils",
          "toute autre information transmise volontairement via le formulaire, le chat, l’email, le téléphone ou WhatsApp",
        ],
      },
      {
        title: "3. Finalités du traitement",
        intro: "Les données sont utilisées notamment pour :",
        items: [
          "traiter la demande entrante",
          "recontacter l’utilisateur",
          "clarifier le besoin",
          "organiser une intervention ou le prochain échange",
          "préparer une réponse commerciale ou assurer le suivi de la demande",
          "tenir un historique des échanges",
          "améliorer l’organisation du traitement des demandes",
        ],
      },
      {
        title: "4. Base juridique",
        intro: "Le traitement repose notamment sur :",
        items: [
          "les mesures nécessaires avant la conclusion d’un contrat à la demande de l’utilisateur",
          "l’exécution du contrat lorsque l’utilisateur devient client",
          "l’intérêt légitime d’AzurSysTech à organiser et suivre les demandes",
          "et, lorsque c’est nécessaire, le respect des obligations légales applicables",
        ],
      },
      {
        title: "5. Destinataires des données et services externes",
        intro:
          "Les données ne sont accessibles qu’aux personnes et services qui en ont besoin pour traiter la demande et faire fonctionner le site, notamment :",
        items: [
          "l’hébergeur du site",
          "les canaux de communication (email, téléphone, WhatsApp)",
          "les outils de traitement des demandes et de suivi interne",
          "les outils CRM s’ils sont effectivement utilisés",
          "les outils de mesure d’audience s’ils sont effectivement activés",
        ],
        paragraphs: [
          "AzurSysTech ne communique pas les données personnelles à des tiers en dehors de ces finalités, sauf obligation légale ou nécessité liée à la prestation.",
        ],
      },
      {
        title: "6. Durée de conservation",
        intro:
          "Les données personnelles sont conservées pendant la durée nécessaire aux finalités poursuivies, en tenant compte notamment :",
        items: [
          "du traitement de la demande",
          "des échanges ultérieurs avec le client",
          "des obligations contractuelles et comptables",
          "des durées légales obligatoires de conservation",
        ],
      },
      {
        title: "7. Droits de l’utilisateur",
        intro: "L’utilisateur peut notamment :",
        items: [
          "demander l’accès à ses données",
          "demander la rectification de données inexactes",
          "demander l’effacement des données dans les cas prévus par la loi",
          "demander la limitation du traitement",
          "s’opposer au traitement dans les cas prévus",
          "définir des directives relatives au sort de ses données après son décès lorsque le droit français le prévoit",
        ],
        paragraphs: [
          "L’utilisateur peut également saisir la CNIL s’il estime que ses droits ne sont pas respectés.",
        ],
      },
      {
        title: "8. Contact pour les questions de données",
        items: [
          `Email : ${LEGAL_CONTACT.email}`,
          `Téléphone / WhatsApp : ${LEGAL_CONTACT.whatsappDisplay}`,
        ],
      },
      {
        title: "9. Mesure d’audience",
        paragraphs: [
          "Le site peut utiliser des outils de mesure d’audience et d’analytics techniques pour comprendre la fréquentation, l’usage des pages et améliorer le service. Lorsque ces outils sont effectivement utilisés, ils sont configurés conformément aux règles applicables.",
        ],
      },
      {
        title: "Cookies et consentement",
        paragraphs: [
          "Les cookies analytics et les outils de mesure d’audience ne sont activés qu’après le consentement explicite de l’utilisateur. Avant ce consentement, ils ne se chargent pas et le site reste pleinement fonctionnel.",
        ],
      },
      {
        title: "10. Formulaire et chat",
        paragraphs: [
          "Les données transmises via le formulaire du site ou le chat d’assistance sont utilisées uniquement pour traiter la demande, préparer une réponse et enregistrer la demande dans le système de travail d’AzurSysTech.",
          "Le chat sert au premier niveau d’intake et ne fournit pas d’engagement commercial, juridique ou de calendrier définitif.",
        ],
      },
      {
        title: "11. Mentions légales associées",
        paragraphs: [
          "Les informations complémentaires sur le propriétaire du site, l’hébergement et les coordonnées sont disponibles sur la page des mentions légales.",
        ],
      },
    ] as PrivacySection[],
    legalPrefix:
      "Les informations complémentaires sur le propriétaire du site, l’hébergement et les coordonnées sont disponibles sur la page des ",
    legalLink: "mentions légales",
    legalSuffix: ".",
  },
  ru: {
    meta: {
      title: "Политика конфиденциальности | AzurSysTech",
      description:
        "Политика конфиденциальности AzurSysTech: какие данные собираются, для чего используются, на каком основании обрабатываются и как работают cookies и форма.",
    },
    eyebrow: "AzurSysTech",
    title: "Политика конфиденциальности",
    intro:
      "AzurSysTech уважает конфиденциальность пользователей сайта и обрабатывает персональные данные в соответствии с применимым законодательством, включая Регламент (ЕС) 2016/679 (RGPD) и французское право о защите персональных данных.",
    sections: [
      {
        title: "1. Кто отвечает за обработку данных",
        paragraphs: [
          "Ответственным за обработку данных является AzurSysTech. Контактные данные ответственного лица и правовая информация указаны на странице правовой информации сайта.",
        ],
      },
      {
        title: "2. Какие данные могут собираться",
        intro: "В зависимости от способа обращения AzurSysTech может собирать следующие данные:",
        items: [
          "имя",
          "номер телефона",
          "адрес электронной почты",
          "город",
          "тип обращения (частный клиент / бизнес)",
          "описание задачи",
          "количество устройств",
          "иные сведения, которые пользователь сам передаёт через форму, чат, email, телефон или WhatsApp",
        ],
      },
      {
        title: "3. Для чего собираются данные",
        intro: "Данные используются для следующих целей:",
        items: [
          "обработки входящего обращения",
          "связи с пользователем",
          "уточнения задачи",
          "организации выезда или дальнейшего взаимодействия",
          "подготовки коммерческого ответа или сопровождения заявки",
          "ведения истории обращений",
          "улучшения организации обработки запросов",
        ],
      },
      {
        title: "4. Правовая основа обработки",
        intro: "Обработка осуществляется на основании:",
        items: [
          "мер, необходимых до заключения договора по запросу пользователя",
          "исполнения договора, если пользователь становится клиентом",
          "законного интереса AzurSysTech в организации и сопровождении обращений",
          "а в соответствующих случаях — выполнения законных обязательств",
        ],
      },
      {
        title: "5. Получатели данных и внешние сервисы",
        intro:
          "Доступ к данным могут иметь только лица и сервисы, которым это необходимо для обработки обращения и работы сайта, в частности:",
        items: [
          "хостинг-провайдер сайта",
          "средства связи (email, телефон, WhatsApp)",
          "сервисы обработки заявок и внутреннего учёта",
          "CRM-инструменты, если они фактически используются",
          "инструменты аналитики сайта, если они фактически включены",
        ],
        paragraphs: [
          "AzurSysTech не раскрывает персональные данные третьим лицам вне этих целей, кроме случаев, предусмотренных законом или необходимых для оказания услуги.",
        ],
      },
      {
        title: "6. Срок хранения данных",
        intro:
          "Персональные данные хранятся не дольше, чем это необходимо для целей, ради которых они были собраны, с учётом:",
        items: [
          "обработки обращения",
          "последующей коммуникации с клиентом",
          "исполнения договорных и бухгалтерских обязательств",
          "выполнения обязательных сроков хранения, установленных законом",
        ],
      },
      {
        title: "7. Права пользователя",
        intro: "Пользователь имеет право:",
        items: [
          "запросить доступ к своим данным",
          "потребовать исправления неточных данных",
          "запросить удаление данных в случаях, предусмотренных законом",
          "ограничить обработку",
          "возразить против обработки в предусмотренных случаях",
          "определить инструкции по обращению с данными после смерти в случаях, предусмотренных французским правом",
        ],
        paragraphs: [
          "Пользователь также может подать жалобу в CNIL, если считает, что его права нарушены.",
        ],
      },
      {
        title: "8. Контакт по вопросам данных",
        items: [
          `Email: ${LEGAL_CONTACT.email}`,
          `Телефон / WhatsApp: ${LEGAL_CONTACT.whatsappDisplay}`,
        ],
      },
      {
        title: "9. Аналитика сайта",
        paragraphs: [
          "Сайт может использовать инструменты измерения аудитории и технической аналитики для понимания посещаемости, структуры использования сайта и улучшения его работы. Если такие инструменты фактически используются, они настраиваются и применяются в соответствии с применимыми правилами.",
        ],
      },
      {
        title: "Cookies и согласие",
        paragraphs: [
          "Аналитические cookies и инструменты измерения аудитории активируются только после явного согласия пользователя. До момента согласия такие инструменты не загружаются, а сайт продолжает работать без ограничений.",
        ],
      },
      {
        title: "10. Формы и чат",
        paragraphs: [
          "Данные, переданные через форму сайта или чат-помощник, используются только для обработки обращения, подготовки ответа и передачи заявки в рабочую систему AzurSysTech.",
          "Чат-помощник служит для первичного intake и не предоставляет окончательных коммерческих, юридических или календарных обязательств.",
        ],
      },
      {
        title: "11. Связанная правовая информация",
        paragraphs: [
          "Дополнительная информация о владельце сайта, хостинге и контактных данных доступна на странице правовой информации.",
        ],
      },
    ] as PrivacySection[],
    legalPrefix:
      "Дополнительная информация о владельце сайта, хостинге и контактных данных доступна на странице ",
    legalLink: "правовой информации",
    legalSuffix: ".",
  },
  en: {
    meta: {
      title: "Privacy policy | AzurSysTech",
      description:
        "Privacy policy of AzurSysTech: collected data, purposes, legal basis, cookies, and intake forms.",
    },
    eyebrow: "AzurSysTech",
    title: "Privacy Policy",
    intro:
      "AzurSysTech respects the privacy of website visitors and processes personal data in accordance with applicable legislation, including GDPR (Regulation EU 2016/679) and French data protection laws.",
    sections: [
      {
        title: "1. Data Controller",
        paragraphs: [
          "The data controller is AzurSysTech. Full contact information and legal details are available on our legal information page.",
        ],
      },
      {
        title: "2. Data We May Collect",
        intro: "Depending on how you contact us, AzurSysTech may collect the following information:",
        items: [
          "name",
          "phone number",
          "email address",
          "city / region",
          "client type (individual / business)",
          "project or workflow description",
          "team size or business scope",
          "any additional details voluntarily submitted via forms, email, telephone, or WhatsApp",
        ],
      },
      {
        title: "3. Purpose of Processing",
        intro: "Personal data is processed for the following purposes:",
        items: [
          "processing incoming enquiries and project briefs",
          "contacting the user for follow-up",
          "clarifying project scope and technical requirements",
          "scheduling discovery calls or project onboarding",
          "preparing proposals and providing client support",
          "maintaining communication history",
          "improving intake service quality",
        ],
      },
      {
        title: "4. Legal Basis for Processing",
        intro: "Processing is based on:",
        items: [
          "pre-contractual steps taken at the user's request",
          "contract performance when the user becomes a client",
          "legitimate interest of AzurSysTech in managing client communications",
          "and compliance with applicable legal obligations",
        ],
      },
      {
        title: "5. Data Recipients & External Services",
        intro:
          "Data is only accessible to personnel and service providers required for website operation and service delivery, including:",
        items: [
          "website hosting infrastructure",
          "communication channels (email, telephone, WhatsApp)",
          "internal workflow and ticketing systems",
          "CRM tools where actively deployed",
          "technical analytics where activated",
        ],
        paragraphs: [
          "AzurSysTech does not share personal data with unauthorized third parties, except as required by law or necessary for contracted services.",
        ],
      },
      {
        title: "6. Data Retention Period",
        intro:
          "Personal data is retained only as long as necessary for the specified purposes, taking into account:",
        items: [
          "enquiry and brief processing duration",
          "subsequent client communications",
          "contractual and accounting requirements",
          "statutory retention periods",
        ],
      },
      {
        title: "7. User Rights",
        intro: "Under applicable data protection laws, users have the right to:",
        items: [
          "request access to their personal data",
          "request rectification of inaccurate data",
          "request erasure of data where legally applicable",
          "request restriction of processing",
          "object to data processing where applicable",
          "specify instructions regarding data disposition after death as provided by French law",
        ],
        paragraphs: [
          "Users may also lodge a complaint with the CNIL (French Data Protection Authority) if they believe their rights are not being respected.",
        ],
      },
      {
        title: "8. Data Protection Contact",
        items: [
          `Email: ${LEGAL_CONTACT.email}`,
          `Phone / WhatsApp: ${LEGAL_CONTACT.whatsappDisplay}`,
        ],
      },
      {
        title: "9. Audience Measurement & Analytics",
        paragraphs: [
          "The website may use technical analytics and audience measurement tools to understand traffic and optimize performance. Where deployed, these tools are configured in compliance with regulatory standards.",
        ],
      },
      {
        title: "Cookies & Consent",
        paragraphs: [
          "Analytics cookies and measurement tools are activated only upon explicit user consent. Before consent is granted, no non-essential cookies are loaded, and the site remains fully operational.",
        ],
      },
      {
        title: "10. Forms and Assistants",
        paragraphs: [
          "Data submitted via website forms or interactive assistants is used solely to process your enquiry and register your request in AzurSysTech's intake system.",
          "Interactive assistants provide preliminary intake guidance only and do not create binding commercial, legal, or timeline commitments.",
        ],
      },
      {
        title: "11. Associated Legal Information",
        paragraphs: [
          "Additional details regarding site ownership, hosting, and contact information are available on our legal information page.",
        ],
      },
    ] as PrivacySection[],
    legalPrefix:
      "Additional details regarding site ownership, hosting, and contact information are available on our ",
    legalLink: "legal information page",
    legalSuffix: ".",
  },
} as const satisfies Record<
  PrivacyLocale,
  {
    meta: Metadata;
    eyebrow: string;
    title: string;
    intro: string;
    sections: PrivacySection[];
    legalPrefix: string;
    legalLink: string;
    legalSuffix: string;
  }
>;

function resolvePrivacyLocale(value?: string | null): PrivacyLocale {
  const resolved = resolveLocale(value);
  return resolved === "ru" ? "ru" : resolved === "en" ? "en" : "fr";
}

type PrivacyPageProps = {
  searchParams?: Promise<{ locale?: string }>;
};

export async function generateMetadata(props: PrivacyPageProps): Promise<Metadata> {
  const cookieStore = await cookies();
  const searchParams = await props.searchParams;
  const locale = resolvePrivacyLocale(searchParams?.locale || cookieStore.get(LOCALE_COOKIE_KEY)?.value);

  return {
    ...PRIVACY_PAGE[locale].meta,
    alternates: { canonical: `${BASE_URL}/privacy` },
  };
}

export default async function PrivacyPage(props: PrivacyPageProps) {
  const cookieStore = await cookies();
  const searchParams = await props.searchParams;
  const locale = resolvePrivacyLocale(searchParams?.locale || cookieStore.get(LOCALE_COOKIE_KEY)?.value);
  const copy = PRIVACY_PAGE[locale];

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
            {section.intro ? <p className="leading-7 text-[#1F2A37]/90">{section.intro}</p> : null}
            {section.items ? (
              <ul className="grid gap-2 text-[#1F2A37]/90">
                {section.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            ) : null}
            {section.paragraphs?.map((paragraph, paragraphIndex) => {
              const isLegalSection = index === copy.sections.length - 1 && paragraphIndex === 0;
              return (
                <p key={paragraph} className="leading-7 text-[#1F2A37]/90">
                  {isLegalSection ? (
                    <>
                      {copy.legalPrefix}
                      <Link className="font-medium text-[#1F6F78] underline" href="/legal">
                        {copy.legalLink}
                      </Link>
                      {copy.legalSuffix}
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
