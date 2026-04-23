import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { LOCALE_COOKIE_KEY, resolveLocale } from "@/i18n";
import { LEGAL_CONTACT } from "@/lib/legal-content";

type PrivacyLocale = "fr" | "ru";

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
  return resolveLocale(value) === "ru" ? "ru" : "fr";
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolvePrivacyLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);

  return PRIVACY_PAGE[locale].meta;
}

export default async function PrivacyPage() {
  const cookieStore = await cookies();
  const locale = resolvePrivacyLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);
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
