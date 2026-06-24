import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { LOCALE_COOKIE_KEY, resolveLocale } from "@/i18n";

type FaqLocale = "fr" | "ru";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqGroup = {
  id: string;
  title: string;
  description: string;
  items: FaqItem[];
};

const FAQ_PAGE = {
  fr: {
    meta: {
      title: "FAQ support informatique | AzurSysTech",
      description:
        "Questions fréquentes sur les sites web, l’automatisation IA, le support technique, le périmètre de service et le premier contact.",
    },
    eyebrow: "AzurSysTech",
    title: "Questions fréquentes sur les services AzurSysTech",
    intro:
      "Cette page regroupe les réponses les plus utiles pour les petites entreprises et les particuliers : périmètre d’intervention, logique d’évaluation et premier contact.",
    primaryCta: "Laisser une demande",
    secondaryCta: "Décrire le besoin",
    closingTitle: "Encore une question sur votre besoin ?",
    closingText:
      "Décrivez la situation par le canal le plus simple. Nous pourrons ensuite passer au prochain pas sans échange inutilement long.",
    closingPrimaryCta: "Ouvrir la page contact",
    closingSecondaryCta: "Écrire à propos du besoin",
    groups: [
      {
        id: "general",
        title: "Questions générales",
        description: "Qui nous aidons, où nous intervenons et comment commencer.",
        items: [
          {
            question: "Que fait AzurSysTech ?",
            answer:
              "AzurSysTech aide les petites entreprises avec des sites web, formulaires, agents IA, automatisation de demandes entrantes et support technique ponctuel quand l’environnement bloque le projet.",
          },
          {
            question: "Travaillez-vous uniquement avec les entreprises ?",
            answer:
              "Non. L’accent commercial actuel est mis sur les petites entreprises et TPE, mais nous aidons aussi les particuliers pour la configuration d’un PC, le Wi‑Fi, les imprimantes, un nouvel ordinateur ou le diagnostic de base.",
          },
          {
            question: "Travaillez-vous uniquement avec des particuliers ?",
            answer:
              "Non. Nous intervenons à la fois pour les particuliers et pour les petits bureaux, cabinets, commerces et autres petits espaces de travail.",
          },
          {
            question: "Dans quelle zone travaillez-vous ?",
            answer: "Les projets web, automatisation et intake IA peuvent être cadrés à distance dans l’Union européenne. Les interventions sur site se font uniquement après accord préalable.",
          },
          {
            question: "Intervenez-vous à distance ou seulement sur site ?",
            answer: "Le format principal pour les sites, formulaires et automatisations est le travail à distance. Le sur-site reste un cas complémentaire à valider séparément.",
          },
          {
            question: "Quel est le meilleur moyen de vous joindre ?",
            answer:
              "Vous pouvez laisser une demande via le formulaire, utiliser le chat d’aide ou nous contacter par téléphone / WhatsApp au +33 7 80 72 09 94.",
          },
          {
            question: "Et si je ne sais pas bien décrire le problème ?",
            answer:
              "Ce n’est pas un problème. Vous pouvez décrire la demande avec des mots simples. Le formulaire et le chat aident à rassembler les informations de base.",
          },
        ],
      },
      {
        id: "pricing-and-process",
        title: "Tarifs et format de travail",
        description: "La logique d’évaluation, le format « à partir de » et le prochain pas après la demande.",
        items: [
          {
            question: "Combien coûte un déplacement ?",
            answer:
              "Le site montre des prix de départ. Le coût exact dépend du besoin, du nombre d’équipements et du volume de travail.",
          },
          {
            question: "Pourquoi les prix sont-ils indiqués « à partir de » ?",
            answer:
              "Parce que deux demandes proches peuvent représenter des volumes différents. Configurer une seule imprimante et préparer plusieurs postes ne correspondent pas au même travail.",
          },
          {
            question: "Peut-on d’abord décrire le besoin puis clarifier le prix ?",
            answer:
              "Oui. C’est même le format recommandé : vous décrivez brièvement le besoin, puis nous voyons ce qui peut être estimé immédiatement et ce qui demande une précision complémentaire.",
          },
          {
            question: "Comment se passe le travail après l’envoi d’une demande ?",
            answer:
              "Le schéma habituel est le suivant : demande, clarification des détails, choix du format, validation du prochain pas puis réalisation de la demande.",
          },
          {
            question: "Pouvez-vous donner un premier cadrage avant le déplacement ?",
            answer:
              "Oui. Lors du premier échange, nous pouvons clarifier le format du besoin et déterminer par où commencer. Un diagnostic précis demande souvent plus de détails ou une intervention sur place.",
          },
        ],
      },
      {
        id: "business",
        title: "Questions des entreprises et TPE",
        description: "Pour les petits bureaux, commerces, cabinets et petites équipes.",
        items: [
          {
            question: "Avec quels types de structures travaillez-vous ?",
            answer:
              "Avec de petits bureaux, cabinets, commerces, indépendants, TPE et petits espaces professionnels.",
          },
          {
            question: "Peut-on faire appel à vous s’il n’y a que 1 à 3 postes ?",
            answer: "Oui. C’est précisément l’un des formats de demande les plus typiques.",
          },
          {
            question: "Pouvez-vous aider à mettre en place un petit bureau depuis zéro ?",
            answer:
              "Oui. Nous pouvons aider sur la base IT : postes de travail, Wi‑Fi, imprimantes, réseau local, dossiers partagés et connexion des appareils.",
          },
          {
            question: "Pouvez-vous intervenir si nous n’avons pas d’informaticien en interne ?",
            answer:
              "Oui. Ce format convient particulièrement aux petites structures sans administrateur système dédié mais avec des besoins concrets à traiter sur place.",
          },
          {
            question: "Aidez-vous à intégrer de nouveaux collaborateurs et de nouveaux postes ?",
            answer:
              "Oui. Un poste peut être préparé avec l’ordinateur, le réseau, l’imprimante, les réglages de base et la connexion à l’environnement partagé.",
          },
          {
            question: "Faites-vous seulement du dépannage matériel pour les entreprises ?",
            answer:
              "Non. En plus du diagnostic et de la résolution de problèmes, nous configurons aussi les éléments typiques de l’environnement IT d’une petite structure.",
          },
        ],
      },
      {
        id: "home-users",
        title: "Questions des particuliers",
        description: "Les demandes domestiques les plus fréquentes, sans jargon inutile.",
        items: [
          {
            question: "Pouvez-vous aider avec un nouvel ordinateur ?",
            answer:
              "Oui. La préparation d’un nouveau PC ou ordinateur portable fait partie des demandes typiques : configuration de base, logiciels utiles, mises à jour, connexion au réseau et aux périphériques.",
          },
          {
            question: "Aidez-vous sur le Wi‑Fi à domicile ?",
            answer:
              "Oui. Nous pouvons aider pour la configuration du réseau domestique et les problèmes courants de stabilité.",
          },
          {
            question: "Connectez-vous les imprimantes ?",
            answer: "Oui. Pour la maison comme pour une petite entreprise, c’est l’une des demandes les plus fréquentes.",
          },
          {
            question: "Peut-on accélérer un ancien ordinateur ?",
            answer:
              "Souvent oui. Cela peut passer par des réglages logiciels, une optimisation ou une mise à niveau comme SSD / RAM.",
          },
          {
            question: "Installez-vous Windows et des logiciels ?",
            answer: "Oui, lorsque la demande reste dans le cadre d’une configuration de base sur site.",
          },
          {
            question: "Transférez-vous les données vers un nouvel ordinateur ?",
            answer:
              "Oui. Dans un scénario simple et compréhensible, cela peut être inclus dans la préparation du nouvel appareil.",
          },
        ],
      },
      {
        id: "chat-and-contact",
        title: "Premier contact et chat",
        description: "Comment passer d’une description courte au prochain pas concret.",
        items: [
          {
            question: "Comment savoir si ma demande entre dans votre périmètre ?",
            answer: "Décrivez-la en quelques mots et nous pourrons préciser le format de prise en charge.",
          },
          {
            question: "Quel est le prochain pas après le chat ?",
            answer:
              "Après une courte clarification du besoin, il faut laisser les coordonnées pour continuer à partir de votre demande.",
          },
          {
            question: "Peut-on obtenir un prix exact directement dans le chat ?",
            answer:
              "Non. Le chat aide à rassembler les informations, mais ne donne pas de prix définitif sans revue du besoin.",
          },
          {
            question: "Peut-on commander un déplacement directement depuis le chat ?",
            answer:
              "Le chat aide à préparer la demande. Le prochain pas est ensuite validé manuellement.",
          },
          {
            question: "Peut-on d’abord écrire plutôt que téléphoner ?",
            answer: "Oui. L’écrit est un moyen pratique pour rassembler rapidement l’essentiel.",
          },
          {
            question: "Je ne suis pas certain que la demande convienne. Que faire ?",
            answer:
              "Le plus simple est d’écrire quand même. Si la demande entre dans le périmètre actuel, nous indiquerons le prochain pas. Sinon, cela se clarifiera rapidement.",
          },
        ],
      },
    ] as FaqGroup[],
  },
  ru: {
    meta: {
      title: "FAQ по IT-помощи | AzurSysTech",
      description:
        "Частые вопросы по сайтам, AI-автоматизации, технической поддержке, зоне работы и первому обращению.",
    },
    eyebrow: "AzurSysTech",
    title: "Частые вопросы об услугах AzurSysTech",
    intro:
      "Эта страница собрана как практичный FAQ для малого бизнеса и частных клиентов. Здесь можно быстро понять формат работы, логику оценки и удобный способ первого обращения.",
    primaryCta: "Оставить заявку",
    secondaryCta: "Описать задачу",
    closingTitle: "Остались вопросы по вашей задаче?",
    closingText:
      "Опишите ситуацию удобным способом, и дальше можно перейти к понятному следующему шагу без лишней переписки и перегруза.",
    closingPrimaryCta: "Перейти к контактам",
    closingSecondaryCta: "Написать по задаче",
    groups: [
      {
        id: "general",
        title: "Общие вопросы",
        description: "Кому помогаем, где работаем и как лучше начать обращение.",
        items: [
          {
            question: "Чем занимается AzurSysTech?",
            answer:
              "AzurSysTech помогает малому бизнесу с сайтами, формами, AI-агентами, автоматизацией входящих заявок и точечной технической поддержкой, когда среда мешает запуску проекта.",
          },
          {
            question: "Вы работаете только с бизнесом?",
            answer:
              "Нет. Основной акцент сейчас — на малый бизнес и TPE, но мы также помогаем частным клиентам: настройка ПК, Wi‑Fi, принтеров, нового компьютера, диагностика и ускорение работы системы.",
          },
          {
            question: "Вы работаете только с частными клиентами?",
            answer:
              "Нет. Мы работаем и с частными клиентами, и с небольшими офисами, кабинетами, магазинами и другими малыми рабочими пространствами.",
          },
          {
            question: "Где вы работаете?",
            answer: "Сайты, автоматизацию и AI-intake можно обсуждать и запускать удаленно по Европейскому союзу. Выездные работы возможны только по отдельному согласованию.",
          },
          {
            question: "Вы работаете удалённо или только с выездом?",
            answer: "Основной формат для сайтов, форм и автоматизации — удаленная работа. Выезд остается дополнительным вариантом, который нужно согласовать отдельно.",
          },
          {
            question: "Как лучше связаться?",
            answer:
              "Можно оставить заявку через форму, написать через чат-помощник или связаться по телефону / WhatsApp: +33 7 80 72 09 94.",
          },
          {
            question: "Если я не знаю, как правильно описать проблему?",
            answer:
              "Это нормально. Можно описать задачу простыми словами. Форма и чат помогут собрать основную информацию.",
          },
        ],
      },
      {
        id: "pricing-and-process",
        title: "Цены и формат работы",
        description: "Коротко о логике оценки, формате “от” и следующем шаге после обращения.",
        items: [
          {
            question: "Сколько стоит выезд?",
            answer:
              "На сайте можно показать цены от. Точная стоимость зависит от задачи, количества устройств и объёма работы.",
          },
          {
            question: "Почему указаны цены “от”?",
            answer:
              "Потому что даже похожие задачи могут отличаться по объёму. Например, настройка одного принтера и настройка нескольких рабочих мест — это разный объём работ.",
          },
          {
            question: "Можно ли сначала описать задачу, а потом понять стоимость?",
            answer:
              "Да. Это предпочтительный формат: вы коротко описываете задачу, а дальше становится понятно, что можно оценить сразу, а что требует уточнения.",
          },
          {
            question: "Как проходит работа после заявки?",
            answer:
              "Обычно процесс такой: заявка, уточнение деталей, выбор формата, согласование следующего шага и выполнение работ по задаче.",
          },
          {
            question: "Вы даёте консультацию до выезда?",
            answer:
              "На этапе первой переписки можно уточнить формат задачи и понять, с чего лучше начать. Точная диагностика часто возможна после более подробного описания или на месте.",
          },
        ],
      },
      {
        id: "business",
        title: "Вопросы бизнеса и TPE",
        description: "Блок для небольших офисов, магазинов, кабинетов и маленьких команд.",
        items: [
          {
            question: "С какими бизнесами вы работаете?",
            answer:
              "С небольшими офисами, кабинетами, магазинами, самостоятельными специалистами, TPE и небольшими рабочими пространствами.",
          },
          {
            question: "Можно ли обратиться, если у нас всего 1–3 рабочих места?",
            answer: "Да. Это как раз один из типовых форматов работы.",
          },
          {
            question: "Вы помогаете настроить маленький офис с нуля?",
            answer:
              "Да. Можно помочь с базовой IT-настройкой: рабочие места, Wi‑Fi, принтеры, локальная сеть, общие папки и подключение устройств.",
          },
          {
            question: "Вы можете помочь, если у нас нет своего IT-специалиста?",
            answer:
              "Да. Этот формат особенно подходит малому бизнесу, у которого нет штатного системного администратора, но есть практические задачи, которые нужно решить на месте.",
          },
          {
            question: "Вы помогаете подключить новых сотрудников и новые рабочие места?",
            answer:
              "Да. Можно подготовить рабочее место: компьютер, сеть, принтер, базовая настройка и подключение к общей среде.",
          },
          {
            question: "Вы делаете только ремонт техники для бизнеса?",
            answer:
              "Нет. Кроме диагностики и устранения проблем, мы также настраиваем инфраструктуру рабочего места и типовые элементы IT-среды малого бизнеса.",
          },
        ],
      },
      {
        id: "home-users",
        title: "Вопросы частных клиентов",
        description: "Типовые домашние задачи без сложной технической подачи.",
        items: [
          {
            question: "Вы можете помочь с новым компьютером?",
            answer:
              "Да. Настройка нового ПК или ноутбука — одна из типовых задач: базовая конфигурация, установка нужных программ, обновления, подключение к сети и периферии.",
          },
          {
            question: "Вы помогаете с домашним Wi‑Fi?",
            answer:
              "Да. Можно помочь с настройкой домашней сети и типовыми проблемами со стабильностью подключения.",
          },
          {
            question: "Вы подключаете принтеры?",
            answer: "Да. Для дома и малого бизнеса — это одна из самых частых задач.",
          },
          {
            question: "Можно ли ускорить старый компьютер?",
            answer:
              "Во многих случаях да. Это может быть программная настройка, оптимизация либо модернизация, например SSD / RAM.",
          },
          {
            question: "Вы устанавливаете Windows и программы?",
            answer: "Да, если задача укладывается в базовый формат выездной настройки.",
          },
          {
            question: "Вы переносите данные на новый компьютер?",
            answer:
              "Да, в простом и понятном сценарии это можно включить в настройку нового устройства.",
          },
        ],
      },
      {
        id: "chat-and-contact",
        title: "Первый контакт и чат",
        description: "Как перейти от короткого описания задачи к следующему шагу.",
        items: [
          {
            question: "Как понять, подходит ли моя задача?",
            answer: "Опишите её в нескольких словах, и мы поможем определить формат обращения.",
          },
          {
            question: "Какой следующий шаг после чата?",
            answer:
              "После короткого уточнения задачи нужно оставить контакты, чтобы продолжить уже по вашей заявке.",
          },
          {
            question: "Можно ли в чате сразу получить точную цену?",
            answer:
              "Нет. Чат помогает собрать информацию, но не даёт окончательную стоимость без проверки задачи.",
          },
          {
            question: "Можно ли в чате сразу заказать выезд?",
            answer: "Чат помогает подготовить заявку. Дальше следующий шаг подтверждается вручную.",
          },
          {
            question: "Можно сначала написать, а не звонить?",
            answer: "Да. Переписка — удобный способ быстро собрать основную информацию.",
          },
          {
            question: "Я не уверен, что моя задача подходит. Что делать?",
            answer:
              "Лучше просто написать. Если задача входит в текущий профиль услуг, мы подскажем следующий шаг. Если нет — это тоже станет понятно быстро.",
          },
        ],
      },
    ] as FaqGroup[],
  },
} as const satisfies Record<
  FaqLocale,
  {
    meta: Metadata;
    eyebrow: string;
    title: string;
    intro: string;
    primaryCta: string;
    secondaryCta: string;
    closingTitle: string;
    closingText: string;
    closingPrimaryCta: string;
    closingSecondaryCta: string;
    groups: FaqGroup[];
  }
>;

function resolveFaqLocale(value?: string | null): FaqLocale {
  return resolveLocale(value) === "ru" ? "ru" : "fr";
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolveFaqLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);

  return FAQ_PAGE[locale].meta;
}

export default async function FaqPage() {
  const cookieStore = await cookies();
  const locale = resolveFaqLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);
  const copy = FAQ_PAGE[locale];

  return (
    <main className="bg-[#F6F1E8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">
            {copy.eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-3xl leading-tight text-[#1F2A37] sm:text-4xl">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-[#1F2A37]/90">{copy.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#185A61]"
            >
              {copy.primaryCta}
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] transition hover:bg-[#F6F1E8]"
            >
              {copy.secondaryCta}
            </Link>
          </div>
        </section>

        {copy.groups.map((group) => (
          <section
            key={group.id}
            className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-6 shadow-sm sm:p-8"
          >
            <h2 className="font-serif text-2xl text-[#1F2A37]">{group.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#1F2A37]/80">{group.description}</p>

            <div className="mt-5 grid gap-3">
              {group.items.map((item) => (
                <details
                  key={item.question}
                  className="rounded-xl border border-[#D8D0C4] bg-[#FFFDFC] p-4 open:bg-[#F6F1E8]/40"
                >
                  <summary className="cursor-pointer list-none pr-6 text-base font-semibold leading-6 text-[#1F2A37] marker:content-none">
                    <span>{item.question}</span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-[#1F2A37]/90">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <h2 className="font-serif text-2xl text-[#1F2A37] sm:text-3xl">{copy.closingTitle}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#1F2A37]/90">{copy.closingText}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#185A61]"
            >
              {copy.closingPrimaryCta}
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] transition hover:bg-[#F6F1E8]"
            >
              {copy.closingSecondaryCta}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
