import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { LOCALE_COOKIE_KEY, resolveLocale } from "@/i18n";
import { LEGAL_CONTACT } from "@/lib/legal-content";

type TermsLocale = "fr" | "ru";

type TermsSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
  details?: Array<{ label: string; value: string; href?: string }>;
};

const UPDATED_AT = "13.04.2026";

const TERMS_PAGE = {
  fr: {
    meta: {
      title: "Conditions générales de service | AzurSysTech",
      description:
        "Conditions générales de service d’AzurSysTech : objet, devis, prix, paiement, annulation, responsabilité et droit applicable.",
    },
    eyebrow: "AzurSysTech",
    title: "Conditions générales de service",
    versionLabel: "Version : 1.0",
    updatedLabel: `Date de mise à jour : ${UPDATED_AT}`,
    note:
      "Important : la version française du document fait foi. La version russe est fournie uniquement à titre de confort de lecture.",
    sections: [
      {
        title: "1. Objet",
        paragraphs: [
          "Les présentes Conditions générales de service définissent les conditions dans lesquelles Dmitrii OLEINIK, exerçant sous la marque AzurSysTech, fournit des services informatiques à ses clients.",
        ],
        items: [
          "assistance informatique locale",
          "installation et configuration de postes de travail",
          "configuration de nouveaux ordinateurs",
          "assistance Wi‑Fi et réseau local",
          "installation et configuration d’imprimantes",
          "interventions IT sur site",
          "autres services informatiques légers décrits dans un devis, un bon d’intervention, un échange écrit ou une facture",
        ],
      },
      {
        title: "2. Prestataire",
        details: [
          { label: "Nom", value: "Dmitrii OLEINIK" },
          { label: "Statut", value: "Entrepreneur individuel – micro-entrepreneur" },
          { label: "SIREN", value: "940 870 140" },
          { label: "SIRET", value: "940 870 140 00016" },
          { label: "APE / NAF", value: "6201Z – Programmation informatique" },
          { label: "Adresse professionnelle", value: "9 AV EMMANUEL BRIDAULT, 06000 NICE, France" },
          { label: "Email", value: LEGAL_CONTACT.email, href: `mailto:${LEGAL_CONTACT.email}` },
          { label: "Téléphone", value: LEGAL_CONTACT.phoneDisplay, href: LEGAL_CONTACT.phoneHref },
          { label: "WhatsApp", value: LEGAL_CONTACT.whatsappDisplay, href: LEGAL_CONTACT.whatsappHref },
          { label: "Site", value: "azursystech.fr" },
        ],
      },
      {
        title: "3. Zone d’intervention",
        paragraphs: [
          "AzurSysTech intervient principalement à Nice et dans un rayon d’environ 30 km autour de Nice, sauf accord particulier.",
        ],
      },
      {
        title: "4. Nature des services",
        paragraphs: [
          "Les services peuvent être réalisés sur site, à distance ou dans un format mixte selon la demande.",
          "Les prestations d’AzurSysTech consistent en assistance, configuration, installation, diagnostic ou mise en service.",
          "Sauf accord écrit contraire, AzurSysTech ne garantit pas la compatibilité absolue du matériel ou des logiciels de tiers, la disponibilité de services tiers, la résolution immédiate de toute panne ou la réalisation de demandes hors du périmètre convenu.",
        ],
      },
      {
        title: "5. Devis et conclusion du contrat",
        paragraphs: [
          "Selon la nature de la prestation, AzurSysTech peut intervenir sur la base d’un devis accepté, d’un accord écrit simple ou d’une demande ponctuelle suivie d’une intervention et d’une facturation.",
          "Un devis est particulièrement recommandé ou nécessaire lorsque la prestation est complexe, couvre plusieurs équipements, comporte plusieurs étapes, suppose des achats ou lorsqu’un client professionnel demande une confirmation préalable.",
          "Le contrat est réputé conclu au moment de l’acceptation du devis ou, à défaut, lors d’une confirmation écrite claire du service, de son périmètre et du principe de tarification.",
        ],
      },
      {
        title: "6. Prix des services",
        paragraphs: [
          "Les prix sont exprimés en euros.",
          "Sauf indication contraire, les prix publiés sur le site constituent des repères « à partir de ».",
          "Le coût final dépend notamment de la nature exacte de la prestation, du nombre d’équipements ou de postes, de la complexité technique, du temps d’intervention, du besoin de déplacement et des besoins additionnels identifiés après diagnostic.",
          "Tout travail hors périmètre initial fait l’objet d’un accord distinct avant exécution.",
        ],
      },
      {
        title: "7. Acompte",
        paragraphs: [
          "AzurSysTech peut demander un acompte, notamment lorsqu’un créneau spécifique est réservé, que la prestation comporte plusieurs étapes, qu’elle nécessite des achats ou lorsqu’un risque d’annulation ou d’impayé le justifie.",
          "Le montant de l’acompte est précisé dans le devis ou dans l’accord écrit correspondant.",
        ],
      },
      {
        title: "8. Modes de paiement",
        paragraphs: ["AzurSysTech peut accepter notamment les modes de paiement suivants :"],
        items: [
          "lien de paiement",
          "carte bancaire si ce mode est disponible",
          "virement bancaire",
          "virement instantané",
          "espèces dans les limites légales",
          "tout autre mode expressément accepté par AzurSysTech",
        ],
      },
      {
        title: "9. Facturation",
        paragraphs: [
          "La facture est émise en fonction de la nature de la prestation et du statut du client.",
          "Pour les clients professionnels, la facture est émise conformément aux règles applicables.",
          "Pour les particuliers, elle peut être remise sur demande ou lorsqu’elle est nécessaire.",
          "Si la micro-entreprise n’est pas assujettie à la TVA, la facture peut contenir la mention obligatoire liée au régime d’exonération.",
        ],
      },
      {
        title: "10. Retard de paiement",
        paragraphs: [
          "En cas de retard de paiement d’un client professionnel, des pénalités de retard peuvent s’appliquer selon les conditions figurant sur le devis ou la facture.",
          "L’indemnité forfaitaire de recouvrement prévue par la loi peut également être due lorsque les documents contractuels ou de paiement le prévoient.",
        ],
      },
      {
        title: "11. Exécution des prestations",
        paragraphs: [
          "AzurSysTech exécute les prestations de bonne foi et avec diligence, dans le cadre d’une obligation de moyens sauf accord écrit contraire.",
          "Le client s’engage à fournir des informations exactes, à décrire la demande autant que possible, à permettre l’accès au matériel, aux logiciels, aux comptes ou aux locaux nécessaires et, si possible, à réaliser une sauvegarde préalable de ses données.",
        ],
      },
      {
        title: "12. Sauvegarde et données",
        paragraphs: [
          "Sauf accord écrit contraire, le client reste responsable de la sauvegarde préalable de ses données.",
          "AzurSysTech n’est pas responsable de la perte, de l’altération ou de l’indisponibilité des données lorsque le client n’a pas réalisé de sauvegarde, que le problème préexistait ou qu’il résulte d’un matériel, logiciel ou service tiers ou d’une cause indépendante d’AzurSysTech.",
        ],
      },
      {
        title: "13. Déplacement, annulation et report",
        paragraphs: [
          "Toute annulation ou demande de report d’un rendez-vous confirmé doit être signalée le plus tôt possible.",
          "AzurSysTech peut conserver tout ou partie de l’acompte ou facturer des frais si l’annulation intervient trop tard, si le déplacement a commencé, si un créneau a été réservé spécialement ou si des frais ont déjà été engagés.",
          "En cas de circonstances légitimes, les parties cherchent à convenir d’une nouvelle date.",
        ],
      },
      {
        title: "14. Droit de rétractation — particuliers",
        paragraphs: [
          "Lorsqu’un contrat est conclu à distance ou hors établissement avec un consommateur, celui-ci dispose en principe d’un délai de 14 jours pour se rétracter, sauf exception légale applicable.",
          "Si le client souhaite que l’exécution commence avant l’expiration de ce délai, il doit en faire la demande expresse.",
          "Si la prestation a été entièrement exécutée avant la fin du délai, avec accord exprès du client et reconnaissance de la perte du droit de rétractation, ce droit cesse de s’appliquer.",
        ],
      },
      {
        title: "15. Limitation de responsabilité",
        paragraphs: [
          "AzurSysTech n’est pas responsable des dysfonctionnements causés par du matériel, des logiciels, un réseau, un accès internet ou des services de tiers, ni d’un usage anormal du matériel par le client, ni des incompatibilités nécessitant des tests supplémentaires, ni des complications causées par des informations inexactes ou incomplètes.",
          "En tout état de cause, la responsabilité d’AzurSysTech ne peut excéder le montant effectivement payé pour la prestation concernée, sauf faute lourde, dol ou exception légale impérative.",
        ],
      },
      {
        title: "16. Propriété intellectuelle",
        paragraphs: [
          "Les documents, textes, éléments visuels, méthodes, supports et autres résultats fournis ou publiés par AzurSysTech sont protégés par le droit applicable de la propriété intellectuelle.",
          "Toute reproduction, diffusion ou réutilisation sans autorisation écrite préalable est interdite, sauf dans les cas expressément prévus par la loi.",
        ],
      },
      {
        title: "17. Données personnelles",
        paragraphs: [
          "Les données personnelles sont traitées conformément à la politique de confidentialité publiée sur le site azursystech.fr.",
        ],
      },
      {
        title: "18. Réclamations",
        paragraphs: [
          "Toute réclamation doit d’abord être adressée par écrit à l’adresse suivante :",
        ],
      },
      {
        title: "19. Droit applicable et juridiction compétente",
        paragraphs: [
          "Les présentes conditions sont régies par le droit français.",
          "En cas de litige avec un consommateur, les règles impératives de compétence applicables au consommateur demeurent.",
          "En cas de litige avec un client professionnel, à défaut d’accord amiable, la juridiction compétente est déterminée selon les règles générales de droit, sauf accord écrit valable contraire.",
        ],
      },
      {
        title: "20. Modification des conditions",
        paragraphs: [
          "AzurSysTech peut modifier les présentes conditions à tout moment.",
          "La version applicable est celle en vigueur à la date de conclusion du contrat, d’acceptation du devis ou de l’accord écrit sur la prestation.",
        ],
      },
    ] as TermsSection[],
    privacyPrefix: "Les données personnelles sont traitées conformément à la ",
    privacyLink: "politique de confidentialité",
    privacySuffix: " publiée sur le site azursystech.fr.",
    claimsPrefix: "Toute réclamation doit d’abord être adressée par écrit à l’adresse suivante : ",
  },
  ru: {
    meta: {
      title: "Условия оказания услуг | AzurSysTech",
      description:
        "Общие условия оказания услуг AzurSysTech: предмет, цены, оплата, отмена, ответственность и применимое право.",
    },
    eyebrow: "AzurSysTech",
    title: "Общие условия оказания услуг",
    versionLabel: "Версия: 1.0",
    updatedLabel: `Дата обновления: ${UPDATED_AT}`,
    note:
      "Важно: настоящая русскоязычная версия документа предоставлена для удобства пользователей. В случае расхождений между языковыми версиями приоритет имеет французская версия документа.",
    sections: [
      {
        title: "1. Предмет",
        paragraphs: [
          "Настоящие Общие условия оказания услуг определяют условия, на которых Dmitrii OLEINIK, предприниматель, осуществляющий деятельность под брендом AzurSysTech, оказывает клиентам IT-услуги.",
        ],
        items: [
          "локальную IT-помощь",
          "установку и настройку рабочих мест",
          "настройку новых компьютеров",
          "помощь с Wi‑Fi и локальной сетью",
          "установку и настройку принтеров",
          "выездные IT-интервенции",
          "иные лёгкие IT-услуги, описанные в смете, акте выезда, письменной переписке или счёте-фактуре",
        ],
      },
      {
        title: "2. Данные исполнителя",
        details: [
          { label: "Имя и фамилия", value: "Dmitrii OLEINIK" },
          { label: "Статус", value: "Entrepreneur individuel – micro-entrepreneur" },
          { label: "SIREN", value: "940 870 140" },
          { label: "SIRET", value: "940 870 140 00016" },
          { label: "APE / NAF", value: "6201Z – Programmation informatique" },
          { label: "Профессиональный адрес", value: "9 AV EMMANUEL BRIDAULT, 06000 NICE, France" },
          { label: "Email", value: LEGAL_CONTACT.email, href: `mailto:${LEGAL_CONTACT.email}` },
          { label: "Телефон", value: LEGAL_CONTACT.phoneDisplay, href: LEGAL_CONTACT.phoneHref },
          { label: "WhatsApp", value: LEGAL_CONTACT.whatsappDisplay, href: LEGAL_CONTACT.whatsappHref },
          { label: "Сайт", value: "azursystech.fr" },
        ],
      },
      {
        title: "3. Зона оказания услуг",
        paragraphs: [
          "AzurSysTech оказывает услуги преимущественно в Ницце и в радиусе примерно 30 км вокруг Ниццы, если иное отдельно не согласовано.",
        ],
      },
      {
        title: "4. Характер услуг",
        paragraphs: [
          "Услуги могут оказываться на месте у клиента, дистанционно либо в смешанном формате, в зависимости от характера запроса.",
          "Услуги AzurSysTech представляют собой помощь, настройку, установку, диагностику или ввод в эксплуатацию.",
          "Если иное прямо и письменно не согласовано, AzurSysTech не гарантирует абсолютную совместимость оборудования или программного обеспечения третьих лиц, доступность сервисов третьих лиц, немедленное устранение всех неисправностей или выполнение любой задачи вне согласованного объёма.",
        ],
      },
      {
        title: "5. Смета и заключение договора",
        paragraphs: [
          "В зависимости от характера услуги AzurSysTech может работать на основании принятой сметы (devis), письменного согласования или разового запроса с последующей интервенцией и выставлением счёта.",
          "Смета особенно рекомендуется или требуется, если услуга сложная, нестандартная, затрагивает несколько устройств, предполагает несколько этапов, требует закупок либо если профессиональный клиент просит предварительное подтверждение условий.",
          "Договор считается заключённым с момента принятия сметы либо, при её отсутствии, с момента ясного письменного подтверждения услуги, её объёма и принципа ценообразования.",
        ],
      },
      {
        title: "6. Стоимость услуг",
        paragraphs: [
          "Цены указываются в евро.",
          "Если не указано иное, цены, размещённые на сайте, являются ориентировочными ценами «от».",
          "Окончательная стоимость зависит, в частности, от точного характера услуги, количества устройств или рабочих мест, технической сложности, времени интервенции, необходимости выезда и дополнительных потребностей, выявленных после диагностики.",
          "Любые работы, не входившие в первоначальный объём, подлежат отдельному согласованию до их выполнения.",
        ],
      },
      {
        title: "7. Аванс",
        paragraphs: [
          "AzurSysTech вправе запросить аванс, в частности, если под задачу резервируется конкретный слот, работа предполагает несколько этапов, требуется закупка или подготовка материалов, клиент является профессионалом либо риск отмены или неоплаты это оправдывает.",
          "Размер аванса указывается в смете или в соответствующем письменном согласовании.",
        ],
      },
      {
        title: "8. Способы оплаты",
        paragraphs: ["AzurSysTech может принимать оплату следующими способами:"],
        items: [
          "по ссылке на оплату",
          "банковской картой, если этот способ доступен",
          "банковским переводом",
          "мгновенным переводом",
          "наличными в пределах, допускаемых законом",
          "иным способом, прямо принятым AzurSysTech",
        ],
      },
      {
        title: "9. Счёт-фактура",
        paragraphs: [
          "Счёт-фактура выставляется в соответствии с характером услуги и статусом клиента.",
          "Для профессиональных клиентов счёт-фактура выставляется в обязательном порядке в соответствии с применимыми правилами.",
          "Для частных клиентов счёт-фактура может выдаваться по запросу или в случаях, когда она требуется.",
          "Если micro-entreprise не является плательщиком НДС, в счёте-фактуре может указываться обязательная пометка о режиме освобождения от НДС.",
        ],
      },
      {
        title: "10. Просрочка оплаты",
        paragraphs: [
          "В случае просрочки оплаты со стороны профессионального клиента могут применяться штрафы за просрочку в соответствии с условиями, указанными в счёте-фактуре или смете.",
          "В соответствии с применимым правом, с профессионального клиента также может взыскиваться фиксированная компенсация расходов на взыскание, если это указано в договорных и платёжных документах.",
        ],
      },
      {
        title: "11. Порядок выполнения услуг",
        paragraphs: [
          "AzurSysTech выполняет услуги добросовестно и с должной заботливостью, в рамках обязанности по средствам, а не обязанности по гарантированному результату, если иное прямо и письменно не согласовано.",
          "Клиент обязуется предоставлять точную информацию, по возможности корректно описывать задачу, обеспечивать доступ к оборудованию, программам, учётным записям или помещениям, необходимым для выполнения работ, а также, по возможности, делать резервную копию данных до начала интервенции.",
        ],
      },
      {
        title: "12. Резервное копирование и данные",
        paragraphs: [
          "Если иное не согласовано письменно, клиент самостоятельно отвечает за предварительное резервное копирование своих данных.",
          "AzurSysTech не несёт ответственности за потерю, повреждение или недоступность данных, если клиент не выполнил резервное копирование, проблема была вызвана уже существующим дефектом либо ущерб вызван оборудованием, программным обеспечением или сервисами третьих лиц или иной причиной, не зависящей от AzurSysTech.",
        ],
      },
      {
        title: "13. Выезд, отмена и перенос",
        paragraphs: [
          "О любой отмене или переносе согласованного визита клиент должен сообщить как можно раньше.",
          "AzurSysTech вправе удержать аванс полностью или частично либо выставить оплату, если клиент отменил слишком поздно, выезд уже был начат, под клиента был специально зарезервирован слот или к моменту отмены уже были понесены расходы.",
          "В случае уважительных обстоятельств стороны стараются согласовать новую дату.",
        ],
      },
      {
        title: "14. Право на отказ — для частных клиентов",
        paragraphs: [
          "Если договор заключён дистанционно или вне офиса с клиентом-потребителем, такой клиент в принципе имеет 14 дней на отказ с момента заключения договора, если не применяется законное исключение.",
          "Если клиент желает, чтобы выполнение услуги началось до истечения этого срока, он должен прямо выразить такое желание.",
          "Если услуга была полностью исполнена до окончания срока на отказ при наличии предварительного явного согласия клиента и подтверждения, что он осознаёт утрату права на отказ после полного исполнения, право на отказ не применяется.",
        ],
      },
      {
        title: "15. Ограничение ответственности",
        paragraphs: [
          "AzurSysTech не несёт ответственности за неисправности, вызванные оборудованием, программным обеспечением, сетью, интернет-доступом или сервисами третьих лиц, за ненормальное использование оборудования клиентом, за несовместимость, требующую дополнительных тестов, либо за усложнение интервенции из-за неточной или неполной информации клиента.",
          "В любом случае ответственность AzurSysTech не может превышать сумму, фактически уплаченную клиентом за соответствующую услугу, кроме случаев грубой вины, умысла или прямого законного исключения.",
        ],
      },
      {
        title: "16. Интеллектуальная собственность",
        paragraphs: [
          "Документы, тексты, визуальные элементы, методики, материалы и иные результаты, предоставляемые или публикуемые AzurSysTech, охраняются нормами применимого права об интеллектуальной собственности.",
          "Любое воспроизведение, распространение или повторное использование без предварительного письменного разрешения запрещено, кроме случаев, прямо допускаемых законом.",
        ],
      },
      {
        title: "17. Персональные данные",
        paragraphs: [
          "Персональные данные обрабатываются в соответствии с Политикой конфиденциальности, размещённой на сайте azursystech.fr.",
        ],
      },
      {
        title: "18. Претензии",
        paragraphs: [
          "Любая претензия должна в первую очередь направляться в письменной форме по адресу:",
        ],
      },
      {
        title: "19. Применимое право и компетентный суд",
        paragraphs: [
          "Настоящие условия регулируются правом Франции.",
          "В случае спора с клиентом-потребителем сохраняются обязательные правила подсудности, применимые к потребителю.",
          "В случае спора с профессиональным клиентом, при отсутствии мирного урегулирования, компетентным является суд, определяемый по общим правилам права, если иное не предусмотрено действительным письменным соглашением.",
        ],
      },
      {
        title: "20. Изменение условий",
        paragraphs: [
          "AzurSysTech вправе изменять настоящие Общие условия в любое время.",
          "Применимой является версия, действовавшая на дату заключения договора, принятия сметы или иного письменного согласования услуги.",
        ],
      },
    ] as TermsSection[],
    privacyPrefix: "Персональные данные обрабатываются в соответствии с ",
    privacyLink: "Политикой конфиденциальности",
    privacySuffix: ", размещённой на сайте azursystech.fr.",
    claimsPrefix: "Любая претензия должна в первую очередь направляться в письменной форме по адресу: ",
  },
} as const satisfies Record<
  TermsLocale,
  {
    meta: Metadata;
    eyebrow: string;
    title: string;
    versionLabel: string;
    updatedLabel: string;
    note: string;
    sections: TermsSection[];
    privacyPrefix: string;
    privacyLink: string;
    privacySuffix: string;
    claimsPrefix: string;
  }
>;

function resolveTermsLocale(value?: string | null): TermsLocale {
  return resolveLocale(value) === "ru" ? "ru" : "fr";
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolveTermsLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);

  return TERMS_PAGE[locale].meta;
}

export default async function TermsPage() {
  const cookieStore = await cookies();
  const locale = resolveTermsLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);
  const copy = TERMS_PAGE[locale];

  return (
    <main className="bg-[#F6F1E8] px-6 py-12 text-[#1F2A37]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">{copy.eyebrow}</p>
          <div className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
            <h1 className="font-serif text-3xl sm:text-4xl">{copy.title}</h1>
            <div className="text-base leading-7 text-[#1F2A37]/90">
              <p className="font-semibold">{copy.versionLabel}</p>
              <p>{copy.updatedLabel}</p>
              <p className="mt-4">{copy.note}</p>
            </div>
          </div>
        </header>

        {copy.sections.map((section, index) => (
          <section
            key={section.title}
            className={`flex flex-col gap-4 ${index < copy.sections.length - 1 ? "border-b border-[#D8D0C4] pb-8" : ""}`}
          >
            <h2 className="font-serif text-2xl">{section.title}</h2>
            {section.details ? (
              <dl className="grid gap-3 text-[#1F2A37]/90">
                {section.details.map((detail) => (
                  <div key={detail.label}>
                    <dt className="text-sm text-[#1F2A37]/70">{detail.label}</dt>
                    <dd>
                      {detail.href ? (
                        <a className="font-medium text-[#1F6F78] underline" href={detail.href}>
                          {detail.value}
                        </a>
                      ) : (
                        detail.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {section.paragraphs?.map((paragraph, paragraphIndex) => {
              const isPrivacySection = index === 16 && paragraphIndex === 0;
              const isClaimsSection = index === 17 && paragraphIndex === 0;
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
                  ) : isClaimsSection ? (
                    <>
                      {copy.claimsPrefix}
                      <a className="font-medium text-[#1F6F78] underline" href={`mailto:${LEGAL_CONTACT.email}`}>
                        {LEGAL_CONTACT.email}
                      </a>
                      .
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              );
            })}
            {section.items ? (
              <ul className="grid gap-2 text-[#1F2A37]/90">
                {section.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </main>
  );
}
