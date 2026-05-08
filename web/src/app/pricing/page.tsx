import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { LOCALE_COOKIE_KEY, resolveLocale } from "@/i18n";

type PricingLocale = "fr" | "ru";

type PricingCard = {
  title: string;
  price: string;
  description: string;
};

type PricingLogicItem = {
  title: string;
  description: string;
};

const CONTACT_ROUTE = "/#contact";

const PRICING_CONTENT = {
  fr: {
    meta: {
      title: "Tarifs et logique d’estimation | AzurSysTech",
      description:
        "Repères de prix AzurSysTech pour petites entreprises et particuliers : prix d’entrée, cas sur demande et logique d’évaluation sans faux engagement.",
    },
    heroEyebrow: "AzurSysTech",
    heroTitle: "Des tarifs sans fausse précision : un point d’entrée clair et une logique d’évaluation honnête",
    heroIntro:
      "Cette page n’est pas un catalogue de prix figés. Nous donnons des repères pour simplifier le premier pas : format « à partir de », format « sur demande » et règle « dépend de l’ampleur du besoin ».",
    primaryCta: "Demander une estimation",
    secondaryCta: "Décrire le besoin",
    pricingLogicTitle: "Comment fonctionne la tarification",
    pricingLogic: [
      {
        title: "Format « à partir de »",
        description:
          "Pour les demandes typiques, nous affichons un repère d’entrée compréhensible afin d’évaluer rapidement le départ du besoin.",
      },
      {
        title: "Format « sur demande »",
        description:
          "Pour les demandes plus larges ou liées entre elles, nous indiquons « sur demande » afin d’éviter une fausse impression de prix fixe.",
      },
      {
        title: "« Dépend de l’ampleur du besoin »",
        description:
          "Le coût final dépend du périmètre, du nombre d’équipements et du format d’intervention.",
      },
    ] as PricingLogicItem[],
    businessEyebrow: "Pour les entreprises en premier",
    businessTitle: "Repères d’entrée pour les TPE",
    businessIntro:
      "Le bloc entreprise apparaît en premier pour qu’un dirigeant de petite structure voie immédiatement le niveau de prix le plus pertinent.",
    businessEntries: [
      {
        title: "Assistance IT sur site pour entreprise",
        price: "à partir de 65 €",
        description:
          "Adapté aux besoins ponctuels sur place : diagnostic, connexion, correction d’un dysfonctionnement dans l’environnement existant.",
      },
      {
        title: "Poste de travail pour TPE",
        price: "à partir de 90 € / poste",
        description:
          "Préparation de base d’un poste : connexion au réseau, à l’imprimante et vérification du fonctionnement.",
      },
      {
        title: "Wi‑Fi / réseau local / imprimantes",
        price: "à partir de 120 €",
        description:
          "Repère de départ pour les besoins où il faut rétablir un fonctionnement stable du réseau et des équipements de bureau.",
      },
      {
        title: "Mise en place de base d’un petit environnement IT",
        price: "sur demande",
        description:
          "Pour un commerce, un cabinet ou un petit bureau lorsque le besoin couvre plusieurs éléments liés entre eux.",
      },
    ] as PricingCard[],
    homeEyebrow: "Pour la maison",
    homeTitle: "Repères d’entrée pour les particuliers",
    homeEntries: [
      {
        title: "Assistance IT à domicile",
        price: "à partir de 50 €",
        description:
          "Point d’entrée clair pour les besoins domestiques : diagnostic d’ordinateur, correction de pannes courantes et réglages de base.",
      },
      {
        title: "Configuration d’un nouveau PC",
        price: "à partir de 80 €",
        description:
          "Préparation initiale de l’appareil : réglages de base, mises à jour et vérification des usages principaux.",
      },
      {
        title: "Wi‑Fi ou imprimante",
        price: "à partir de 70 €",
        description:
          "Repère de départ pour configurer le réseau domestique ou connecter une imprimante sans montage inutilement complexe.",
      },
      {
        title: "Transfert simple de données",
        price: "à partir de 70 €",
        description:
          "Transfert de base des données utilisateur entre appareils dans un scénario standard.",
      },
    ] as PricingCard[],
    homeNote: "Le coût final dépend du volume réel du besoin.",
    costFactorsTitle: "Ce qui influence le coût final",
    costFactors: [
      "Le nombre d’équipements et de postes concernés.",
      "La complexité et le niveau de dépendance du besoin (un seul élément ou l’environnement entier).",
      "L’état actuel du matériel et du réseau.",
      "La nécessité d’un déplacement et la part du travail réalisée sur place.",
      "Le contexte du besoin : domicile ou petite entreprise.",
    ] as string[],
    scopeTitle: "Ce qui est généralement inclus et ce qui ne l’est pas",
    includedTitle: "Généralement inclus",
    included: [
      "Diagnostic de base et identification du prochain pas le plus utile.",
      "Réglages de base dans le périmètre annoncé de la demande.",
      "Connexion des appareils et vérification du scénario principal de fonctionnement.",
      "Explication courte et compréhensible du résultat, sans discours technique excessif.",
    ] as string[],
    notIncludedTitle: "Généralement non inclus",
    notIncluded: [
      "Le prix du matériel, des pièces ou des licences, si elles sont nécessaires.",
      "Les projets de grande ampleur de type infrastructure corporate.",
      "Les travaux découverts en cours d’intervention hors périmètre initial, sans validation séparée.",
      "Les besoins élargis qui sortent du cadre d’une mise en place de base pour particulier ou TPE.",
    ] as string[],
    estimateTitle: "Comment demander une estimation",
    estimateSteps: [
      "Décrivez brièvement le besoin via le formulaire principal du site.",
      "Indiquez ce qui ne fonctionne pas aujourd’hui ou ce qu’il faut mettre en place.",
      "Ajoutez le nombre d’équipements et précisez si un déplacement est nécessaire.",
      "À partir de là, nous pouvons définir le prochain pas d’estimation sans promesse artificielle.",
    ] as string[],
    finalTitle: "Besoin d’une estimation pour une entreprise ou pour la maison ?",
    finalIntro:
      "Décrivez simplement votre besoin via le point de contact principal. Ce format permet de passer rapidement de l’incertitude à un prochain pas compréhensible.",
    finalPrimaryCta: "Aller au contact principal",
    finalSecondaryCta: "Laisser une demande",
  },
  ru: {
    meta: {
      title: "Цены и логика оценки | AzurSysTech",
      description:
        "Ценовые ориентиры AzurSysTech для малого бизнеса и частных клиентов: входные цены, случаи по запросу и честная логика оценки без фиктивных обещаний.",
    },
    heroEyebrow: "AzurSysTech",
    heroTitle: "Цены без скрытой неопределённости: понятный вход и честная логика оценки",
    heroIntro:
      "Эта страница — не фиксированный прайс-каталог. Мы показываем ориентиры, чтобы упростить первый шаг: формат «от», формат «по запросу» и правило «зависит от объёма задачи».",
    primaryCta: "Запросить оценку",
    secondaryCta: "Описать задачу",
    pricingLogicTitle: "Как работает ценообразование",
    pricingLogic: [
      {
        title: "Формат «от»",
        description:
          "Для типовых задач показываем понятный входной ориентир, чтобы можно было быстро оценить старт обращения.",
      },
      {
        title: "Формат «по запросу»",
        description:
          "Для более широких или связанных задач указываем «по запросу», чтобы не давать ложную фиксированную цену.",
      },
      {
        title: "«Зависит от объёма задачи»",
        description:
          "Итоговая стоимость зависит от состава работ, количества устройств и формата выезда.",
      },
    ] as PricingLogicItem[],
    businessEyebrow: "Для бизнеса — первым блоком",
    businessTitle: "Входные ориентиры для TPE",
    businessIntro:
      "Бизнес-блок расположен первым, чтобы владельцу малого бизнеса было проще сразу понять релевантный ценовой вход.",
    businessEntries: [
      {
        title: "Выездная IT-помощь для бизнеса",
        price: "от 65 €",
        description:
          "Подходит для точечных задач на месте: диагностика, подключение, устранение сбоев в текущей среде.",
      },
      {
        title: "Рабочее место для TPE",
        price: "от 90 € / место",
        description:
          "Базовая подготовка рабочего места: подключение к сети, принтеру и проверка работоспособности.",
      },
      {
        title: "Wi‑Fi / локальная сеть / принтеры",
        price: "от 120 €",
        description:
          "Стартовый ориентир для задач, где важно восстановить стабильную работу офисной сети и устройств.",
      },
      {
        title: "Базовая настройка небольшой IT-среды",
        price: "по запросу",
        description:
          "Для магазина, кабинета или небольшого офиса, когда задача включает несколько связанных элементов среды.",
      },
    ] as PricingCard[],
    homeEyebrow: "Для дома",
    homeTitle: "Входные ориентиры для частных клиентов",
    homeEntries: [
      {
        title: "Выездная IT-помощь для дома",
        price: "от 50 €",
        description:
          "Понятный вход для бытовых задач: диагностика компьютера, устранение типовых сбоев, базовая настройка.",
      },
      {
        title: "Настройка нового ПК",
        price: "от 80 €",
        description:
          "Первичная подготовка устройства к работе: базовая настройка, обновления и проверка основных сценариев.",
      },
      {
        title: "Wi‑Fi или принтер",
        price: "от 70 €",
        description:
          "Стартовый ориентир для настройки домашней сети или подключения принтера без перегруженной схемы.",
      },
      {
        title: "Простой перенос данных",
        price: "от 70 €",
        description:
          "Базовый перенос пользовательских данных между устройствами в рамках типового сценария.",
      },
    ] as PricingCard[],
    homeNote: "Итоговая стоимость зависит от объёма задачи.",
    costFactorsTitle: "Что влияет на финальную стоимость",
    costFactors: [
      "Количество устройств и рабочих точек.",
      "Сложность и связность задачи (один элемент или среда целиком).",
      "Текущее состояние оборудования и сети.",
      "Нужен ли выезд и какой объём работ выполняется на месте.",
      "Контекст задачи: дом или малый бизнес.",
    ] as string[],
    scopeTitle: "Что обычно входит и что обычно не входит",
    includedTitle: "Обычно входит",
    included: [
      "Базовая диагностика и определение следующего практичного шага.",
      "Базовая настройка в рамках заявленного объёма задачи.",
      "Подключение устройств и проверка работоспособности по ключевому сценарию.",
      "Короткое и понятное объяснение результата без сложной технической подачи.",
    ] as string[],
    notIncludedTitle: "Обычно не входит",
    notIncluded: [
      "Стоимость оборудования, комплектующих и лицензий (если они нужны).",
      "Крупные проекты уровня большой корпоративной инфраструктуры.",
      "Работы вне стартового объёма, выявленные в процессе, без отдельного согласования.",
      "Расширенные задачи, которые выходят за рамки базовой настройки для дома или TPE.",
    ] as string[],
    estimateTitle: "Как запросить оценку",
    estimateSteps: [
      "Перейдите в основной контактный путь сайта и коротко опишите запрос.",
      "Укажите, что именно сейчас не работает или что нужно настроить.",
      "Добавьте количество устройств и отметьте, нужен ли выезд.",
      "После этого можно получить следующий понятный шаг по оценке без фиктивных обещаний.",
    ] as string[],
    finalTitle: "Нужна оценка для бизнеса или домашней задачи?",
    finalIntro:
      "Опишите запрос через основной контактный путь. Такой формат помогает быстро перейти от неопределённости к понятному следующему шагу.",
    finalPrimaryCta: "Перейти к контакту",
    finalSecondaryCta: "Оставить заявку",
  },
} as const satisfies Record<
  PricingLocale,
  {
    meta: { title: string; description: string };
    heroEyebrow: string;
    heroTitle: string;
    heroIntro: string;
    primaryCta: string;
    secondaryCta: string;
    pricingLogicTitle: string;
    pricingLogic: PricingLogicItem[];
    businessEyebrow: string;
    businessTitle: string;
    businessIntro: string;
    businessEntries: PricingCard[];
    homeEyebrow: string;
    homeTitle: string;
    homeEntries: PricingCard[];
    homeNote: string;
    costFactorsTitle: string;
    costFactors: string[];
    scopeTitle: string;
    includedTitle: string;
    included: string[];
    notIncludedTitle: string;
    notIncluded: string[];
    estimateTitle: string;
    estimateSteps: string[];
    finalTitle: string;
    finalIntro: string;
    finalPrimaryCta: string;
    finalSecondaryCta: string;
  }
>;

function resolvePricingLocale(value: string | undefined): PricingLocale {
  return resolveLocale(value) === "ru" ? "ru" : "fr";
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolvePricingLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);

  return PRICING_CONTENT[locale].meta;
}

export default async function PricingPage() {
  const cookieStore = await cookies();
  const locale = resolvePricingLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);
  const copy = PRICING_CONTENT[locale];

  return (
    <main className="bg-[#F6F1E8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">
            {copy.heroEyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-3xl leading-tight text-[#1F2A37] sm:text-4xl">
            {copy.heroTitle}
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-[#1F2A37]/90">{copy.heroIntro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={CONTACT_ROUTE}
              className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#185A61]"
            >
              {copy.primaryCta}
            </Link>
            <Link
              href={CONTACT_ROUTE}
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] transition hover:bg-[#F6F1E8]"
            >
              {copy.secondaryCta}
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">{copy.pricingLogicTitle}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {copy.pricingLogic.map((item) => (
              <article key={item.title} className="rounded-xl border border-[#D8D0C4] bg-[#FFFDFC] p-5">
                <h3 className="text-lg font-semibold text-[#1F2A37]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#1F2A37]/85">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#C96F4A]">
                {copy.businessEyebrow}
              </p>
              <h2 className="mt-2 font-serif text-2xl text-[#1F2A37]">{copy.businessTitle}</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[#1F2A37]/80">{copy.businessIntro}</p>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {copy.businessEntries.map((item) => (
              <article key={item.title} className="rounded-xl border border-[#D8D0C4] bg-[#FFFDFC] p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-[#1F2A37]">{item.title}</h3>
                  <p className="rounded-full bg-[#F6F1E8] px-3 py-1 text-sm font-semibold text-[#1F6F78]">
                    {item.price}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#1F2A37]/85">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1F6F78]">
            {copy.homeEyebrow}
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[#1F2A37]">{copy.homeTitle}</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {copy.homeEntries.map((item) => (
              <article key={item.title} className="rounded-xl border border-[#D8D0C4] bg-[#FFFDFC] p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-[#1F2A37]">{item.title}</h3>
                  <p className="rounded-full bg-[#F6F1E8] px-3 py-1 text-sm font-semibold text-[#1F6F78]">
                    {item.price}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#1F2A37]/85">{item.description}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#1F2A37]/80">{copy.homeNote}</p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">{copy.costFactorsTitle}</h2>
          <ul className="mt-5 grid gap-3 text-[#1F2A37]/90 sm:grid-cols-2">
            {copy.costFactors.map((factor) => (
              <li key={factor} className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] p-4">
                {factor}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">{copy.scopeTitle}</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <article className="rounded-xl border border-[#D8D0C4] bg-[#FFFDFC] p-5">
              <h3 className="text-lg font-semibold text-[#1F6F78]">{copy.includedTitle}</h3>
              <ul className="mt-4 grid gap-2 text-sm leading-6 text-[#1F2A37]/90">
                {copy.included.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-xl border border-[#D8D0C4] bg-[#FFFDFC] p-5">
              <h3 className="text-lg font-semibold text-[#C96F4A]">{copy.notIncludedTitle}</h3>
              <ul className="mt-4 grid gap-2 text-sm leading-6 text-[#1F2A37]/90">
                {copy.notIncluded.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">{copy.estimateTitle}</h2>
          <ol className="mt-5 grid gap-3 text-[#1F2A37]/90 sm:grid-cols-2">
            {copy.estimateSteps.map((step, index) => (
              <li key={step} className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] p-4">
                <span className="font-semibold text-[#1F2A37]">{index + 1}.</span> {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <h2 className="font-serif text-2xl text-[#1F2A37] sm:text-3xl">{copy.finalTitle}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#1F2A37]/90">{copy.finalIntro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={CONTACT_ROUTE}
              className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#185A61]"
            >
              {copy.finalPrimaryCta}
            </Link>
            <Link
              href={CONTACT_ROUTE}
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] transition hover:bg-[#F6F1E8]"
            >
              {copy.finalSecondaryCta}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
