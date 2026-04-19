import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Автоматизация бизнес-процессов с помощью ИИ-агентов | AzurSysTech",
  description:
    "AzurSysTech помогает малому бизнесу внедрять ИИ-агентов для обработки входящих заявок и обращений, первичного intake, qualification и repeatable workflows — без полной перестройки бизнеса.",
};

const WHATSAPP = "https://wa.me/33780720994";
const WHATSAPP_DISPLAY = "+33 7 80 72 09 94";

const FLOW_STEPS = ["Заявка", "Intake", "Qualification", "Summary", "Handoff"];

const AUDIENCE_CARDS = [
  {
    title: "Локальные сервисные компании",
    copy: "Если заявки приходят с сайта, из WhatsApp, мессенджеров и рекламы, первый этап обработки часто становится узким местом. ИИ-агент помогает собрать обращение в единую структуру, уточнить детали и передать уже понятную задачу дальше.",
    gain:
      "Практический результат: меньше потерянных обращений и быстрее первый ответ по понятному intake.",
    control:
      "Граница контроля: финальные решения по цене, срокам и сложным кейсам остаются у человека.",
    pains: [
      "заявки приходят из нескольких каналов",
      "часть обращений теряется",
      "сотрудники тратят время на одни и те же уточнения",
    ],
  },
  {
    title: "Small offices / cabinets",
    copy: "Для небольших офисов, кабинетов и сервисных точек особенно важна скорость первого ответа и понятный intake. ИИ-агент может взять на себя первичную фильтрацию и подготовку обращения, не перегружая команду.",
    gain:
      "Практический результат: команда тратит меньше времени на первичную сортировку и типовые уточнения.",
    control:
      "Граница контроля: нестандартные запросы и подтверждение важных шагов остаются у сотрудника.",
    pains: [
      "нет единого intake",
      "обращения нужно вручную сортировать",
      "слишком много повторяющихся клиентских вопросов",
    ],
  },
  {
    title: "E-commerce",
    copy: "В e-commerce типовые customer requests, статусы заказов, вопросы по доставке и возвратам могут создавать постоянный ручной поток. ИИ-агент помогает стандартизировать первую линию обработки и снизить операционную нагрузку.",
    gain:
      "Практический результат: более быстрый first-touch и меньше ручной рутины в повторяющихся сценариях.",
    control:
      "Граница контроля: спорные, чувствительные и коммерчески значимые ответы подтверждает человек.",
    pains: [
      "много повторяющихся обращений",
      "нужен быстрый первичный ответ",
      "клиентский workflow сложно масштабировать вручную",
    ],
  },
];

const START_ITEMS = [
  {
    title: "Обработка заявок с сайта",
    desc: "ИИ-агент принимает заявку, задаёт уточняющие вопросы и подготавливает данные для следующего шага.",
  },
  {
    title: "Intake из чата и мессенджеров",
    desc: "Входящие обращения можно привести к единому формату, даже если они приходят из разных каналов.",
  },
  {
    title: "Первичная qualification",
    desc: "Агент помогает отделить типовые запросы от более сложных, определить приоритет и понять, что делать дальше.",
  },
  {
    title: "Маршрутизация обращений",
    desc: "Обращение можно автоматически передавать нужному человеку, в таблицу, в CRM или в рабочую систему.",
  },
  {
    title: "Follow-up и напоминания",
    desc: "Часть повторяющихся действий после первичного контакта тоже можно стандартизировать.",
  },
  {
    title: "Документы по шаблону",
    desc: "Если процесс уже понятен, часть шаблонных документов и повторяющихся формулировок можно готовить автоматически.",
  },
];

const CAPABILITIES = [
  {
    title: "Принимает обращения из нескольких каналов",
    desc: "Сайт, чат, формы, мессенджеры и другие входящие точки можно связать в более единый intake.",
  },
  {
    title: "Задаёт уточняющие вопросы",
    desc: "Агент помогает получить недостающие данные до того, как обращение попадёт к человеку.",
  },
  {
    title: "Определяет тип запроса",
    desc: "Можно отделить простой запрос от более сложного, urgent case от обычного и новый лид от сервисного обращения.",
  },
  {
    title: "Собирает краткое summary",
    desc: "Вместо хаотичного сообщения команда получает уже структурированное описание запроса.",
  },
  {
    title: "Помогает приоритизировать обращения",
    desc: "Часть логики приоритета можно сделать повторяемой и прозрачной.",
  },
  {
    title: "Запускает повторяющиеся действия",
    desc: "Например, передаёт данные дальше, создаёт запись, подготавливает follow-up или ставит следующий шаг.",
  },
  {
    title: "Помогает с шаблонными документами",
    desc: "Если процесс стандартизирован, часть шаблонного документооборота можно ускорить.",
  },
  {
    title: "Работает в human-in-the-loop режиме",
    desc: "ИИ-агент не должен автономно принимать чувствительные решения там, где нужен контроль человека.",
  },
];

const NOT_ITEMS = [
  "ИИ-агент не заменяет полностью сотрудников",
  "ИИ-агент не принимает важные решения без контроля",
  "ИИ-агент не обещает цену и сроки сам по себе",
  "ИИ-агент не внедряется во всё подряд без анализа процесса",
  'ИИ-агент не означает «полную автоматизацию под ключ» по умолчанию',
  "ИИ-агент не должен работать автономно в чувствительных сценариях без участия человека",
];

const SCENARIOS = [
  {
    title: "ИИ-агент для обработки заявок с сайта",
    desc: "Подходит бизнесам, где основная точка входа — форма, landing page или contact flow. Агент помогает превратить заявку в более структурированный lead и сократить ручной первый этап.",
    gain:
      "Практический результат: меньше потерь лидов и быстрее передача структурированной заявки в работу.",
    control:
      "Граница контроля: финальная квалификация сложных обращений и коммерческие решения остаются у человека.",
  },
  {
    title: "ИИ-агент для первичного intake и qualification",
    desc: "Подходит там, где важно понять тип клиента, срочность, тему обращения и следующий шаг ещё до передачи задачи менеджеру или владельцу бизнеса.",
    gain:
      "Практический результат: менеджер получает уже собранный контекст и экономит время на первом контакте.",
    control:
      "Граница контроля: приоритеты в спорных кейсах и финальный маршрут обращения подтверждает сотрудник.",
  },
  {
    title: "ИИ-агент для обработки обращений из мессенджеров",
    desc: "Подходит бизнесам, где клиенты часто пишут в чаты и мессенджеры в свободной форме. Агент помогает собрать эти сообщения в более понятный и управляемый workflow.",
    gain:
      "Практический результат: сообщения из разных каналов приводятся к единому формату и не теряются в переписках.",
    control:
      "Граница контроля: нестандартные ответы и чувствительные формулировки проверяются человеком.",
  },
  {
    title: "ИИ-агент для клиентской поддержки по типовым вопросам",
    desc: "Подходит там, где много повторяющихся запросов. Агент может взять на себя первый слой обработки типовых обращений и передавать нестандартные случаи человеку.",
    gain:
      "Практический результат: команда быстрее закрывает типовые вопросы и разгружает первую линию поддержки.",
    control: "Граница контроля: исключения, жалобы и сложные случаи всегда эскалируются сотруднику.",
  },
  {
    title: "ИИ-агент для e-commerce workflow",
    desc: "Подходит e-commerce бизнесам, где есть поток customer requests, статусов, повторяющихся уточнений и сопутствующих действий, которые можно частично структурировать.",
    gain:
      "Практический результат: ускоряется первичная обработка customer requests и снижается операционная нагрузка.",
    control: "Граница контроля: решения по возвратам, компенсациям и спорным заказам принимает человек.",
  },
  {
    title: "ИИ-агент для шаблонного документооборота и repeatable workflows",
    desc: "Подходит бизнесам, где часть действий и документов повторяется по понятному сценарию. Автоматизация здесь помогает ускорить подготовку типовых шагов без хаотичной ручной работы.",
    gain:
      "Практический результат: шаблонные шаги выполняются стабильнее и быстрее, с меньшим числом ручных ошибок.",
    control:
      "Граница контроля: финальная проверка документов и нестандартные изменения остаются у ответственного сотрудника.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Разбор задачи и процесса",
    desc: "Сначала нужно понять, какой именно процесс сейчас забирает время и где появляются потери.",
  },
  {
    num: "02",
    title: "Выбор одного процесса для пилота",
    desc: "Вместо большой перестройки выбирается узкий и понятный первый сценарий.",
  },
  {
    num: "03",
    title: "Проектирование логики",
    desc: "Определяется, что именно делает ИИ-агент, какие данные он собирает, где нужен человек и как выглядит handoff.",
  },
  {
    num: "04",
    title: "Сборка и тестирование",
    desc: "Логика собирается, проверяется на реальных сценариях и корректируется.",
  },
  {
    num: "05",
    title: "Запуск с контролем",
    desc: "Автоматизация запускается в рабочем режиме, но с понятными границами и контролем со стороны человека.",
  },
];

const WHEN_USEFUL = [
  {
    title: "Заявки теряются",
    desc: "Если часть обращений не доходит до следующего шага, первый intake нуждается в структуре.",
  },
  {
    title: "Сотрудники отвечают слишком долго",
    desc: "Когда первый ответ зависит от занятости конкретного человека, часть процесса можно стандартизировать.",
  },
  {
    title: "Обращения приходят из нескольких каналов",
    desc: "Если сайт, мессенджеры, чат и другие каналы не дают единой картины, ИИ-агент может помочь со сбором и нормализацией данных.",
  },
  {
    title: "Нет единого intake",
    desc: "Если каждая заявка обрабатывается «по-своему», бизнес теряет время и управляемость.",
  },
  {
    title: "Нет понятной маршрутизации запросов",
    desc: "Когда непонятно, кому и куда передавать обращение дальше, процесс начинает буксовать.",
  },
  {
    title: "Слишком много повторяющихся действий",
    desc: "Повторяющиеся уточнения, сортировка, сводка, передача и follow-up — хороший кандидат на аккуратную автоматизацию.",
  },
  {
    title: "Сложно масштабировать поток обращений",
    desc: "Когда объём входящих запросов растёт, ручной first-touch начинает тормозить бизнес.",
  },
];

const FAQS = [
  {
    q: "Что такое ИИ-агент для бизнеса?",
    a: "Это программный слой, который помогает выполнять повторяющиеся действия в рабочем процессе: принимать обращения, задавать уточняющие вопросы, собирать данные, подготавливать summary и запускать следующий шаг.",
  },
  {
    q: "Чем ИИ-агент отличается от обычного чат-бота?",
    a: "Обычный чат-бот часто ограничивается набором жёстких сценариев. ИИ-агент может гибче работать с входящим запросом, лучше понимать контекст и помогать не только с ответом, но и с qualification, routing и handoff.",
  },
  {
    q: "Можно ли начать с одного процесса?",
    a: "Да. Это как раз наиболее разумный путь. Обычно лучше начать с одного повторяющегося сценария, чем пытаться автоматизировать всё сразу.",
  },
  {
    q: "Какие процессы лучше автоматизировать первыми?",
    a: "Обычно первыми кандидатами становятся intake, первичная qualification, типовые клиентские обращения, маршрутизация запросов и repeatable workflow, который уже легко описать.",
  },
  {
    q: "Подходит ли это малому бизнесу?",
    a: "Да, особенно если у бизнеса уже есть повторяющийся поток заявок, обращений или рутинных действий, которые занимают время команды.",
  },
  {
    q: "Подходит ли это локальным сервисным компаниям?",
    a: "Да. Для локального сервиса часто особенно полезна автоматизация первичной обработки заявок и клиентских обращений из нескольких каналов.",
  },
  {
    q: "Подходит ли это e-commerce?",
    a: "Да, если у бизнеса есть типовые customer requests, повторяющиеся клиентские сценарии и потребность быстрее обрабатывать обращения.",
  },
  {
    q: "Нужна ли CRM?",
    a: "Не всегда. Во многих случаях можно начать с более простого контура, а потом уже решать, нужна ли полноценная CRM или более лёгкая рабочая система.",
  },
  {
    q: "Можно ли использовать сайт, чат и мессенджеры вместе?",
    a: "Да. Один из практических сценариев как раз в том, чтобы объединить несколько входящих каналов в более единый intake workflow.",
  },
  {
    q: "Может ли ИИ-агент отвечать клиентам сам?",
    a: "Да, но только в тех рамках, которые заранее определены. Для чувствительных сценариев, коммерческих обещаний, цены, сроков и нестандартных ситуаций обычно нужен человек.",
  },
  {
    q: "Сколько контроля остаётся у человека?",
    a: "Контроль остаётся там, где он действительно нужен: в сложных случаях, в коммерческих решениях, в подтверждении важных действий и в финальной ответственности за процесс.",
  },
  {
    q: "Нужно ли менять весь текущий стек?",
    a: "Нет. Во многих случаях разумнее сначала встроить автоматизацию в один существующий процесс, а не менять всё сразу.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://azursystech.fr/ai-automation",
      url: "https://azursystech.fr/ai-automation",
      name: "Автоматизация бизнес-процессов с помощью ИИ-агентов | AzurSysTech",
      description:
        "AzurSysTech помогает малому бизнесу внедрять ИИ-агентов для обработки входящих заявок и обращений, первичного intake, qualification и repeatable workflows — без полной перестройки бизнеса.",
      inLanguage: "ru",
      isPartOf: { "@id": "https://azursystech.fr" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "Service",
      "@id": "https://azursystech.fr/ai-automation#service",
      name: "Автоматизация бизнес-процессов с помощью ИИ-агентов",
      serviceType: "ИИ-автоматизация intake, qualification и повторяющихся процессов",
      description:
        "Практичная автоматизация первого слоя обработки обращений для малого бизнеса с human-in-the-loop контролем.",
      provider: {
        "@type": "Organization",
        name: "AzurSysTech",
        url: "https://azursystech.fr",
      },
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Nice и зона до 30 км",
      },
      availableChannel: [
        {
          "@type": "ServiceChannel",
          serviceUrl: "https://azursystech.fr/contact",
        },
        {
          "@type": "ServiceChannel",
          name: "WhatsApp",
          serviceUrl: WHATSAPP,
        },
      ],
      url: "https://azursystech.fr/ai-automation",
    },
  ],
};

// ─── Shared CTA row ──────────────────────────────────────────────────────────
function CtaRow({ dark }: { dark?: boolean }) {
  const primary = dark
    ? "inline-flex items-center gap-2 rounded-full bg-accent-teal px-7 py-3.5 text-base font-bold text-white shadow-premium-soft transition-transform active:scale-95 hover:bg-accent-teal/90"
    : "inline-flex items-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-base font-bold text-white shadow-premium-soft transition-transform active:scale-95 hover:bg-graphite/90";
  const secondary = dark
    ? "inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/20"
    : "inline-flex items-center gap-2 rounded-full border border-graphite/20 bg-surface px-7 py-3.5 text-base font-bold text-graphite transition-colors hover:bg-base";

  return (
    <div className="mt-10 flex flex-wrap items-center gap-4">
      <Link href="/contact" className={primary}>
        Обсудить задачу
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path fill="currentColor" d="M5 11h11.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H5v-2z" />
        </svg>
      </Link>
      <Link href="/brief" className={secondary}>
        Открыть бриф
      </Link>
    </div>
  );
}

// ─── Mid-page inline CTA banner ──────────────────────────────────────────────
function InlineCta({ text }: { text: string }) {
  return (
    <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-graphite/5 bg-base p-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-base font-medium text-graphite/80">{text}</p>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/contact"
          className="shrink-0 rounded-full bg-accent-teal px-6 py-3 text-sm font-bold text-white shadow-premium-soft transition-transform active:scale-95 hover:bg-accent-teal/90"
        >
          Обсудить задачу
        </Link>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-full border border-graphite/20 bg-surface px-6 py-3 text-sm font-bold text-graphite transition-colors hover:bg-base"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function Label({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`mb-4 text-sm font-bold uppercase tracking-[0.18em] ${
        dark ? "text-accent-teal/80" : "text-accent-teal/90"
      }`}
    >
      {children}
    </p>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AiAutomationPage() {
  return (
    <main className="text-graphite">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-graphite pb-14 pt-20 text-white md:py-36">
        {/* Warm gradient overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(12,18,24,0.97)_0%,rgba(31,42,55,0.88)_60%,rgba(31,42,55,0.75)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(31,111,120,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(201,111,74,0.10),transparent_55%)]" />

        <div className="container relative z-10 mx-auto px-4 md:px-8">
          {/* Back link */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition-colors hover:text-white/80 md:mb-10"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path fill="currentColor" d="M19 11H7.8l4.6-4.6L11 5l-7 7 7 7 1.4-1.4L7.8 13H19v-2z" />
            </svg>
            AzurSysTech
          </Link>

          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-white/55 sm:tracking-[0.2em]">
              Автоматизация и ИИ
            </p>

            <h1 className="max-w-3xl text-3xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-4xl md:text-6xl md:leading-[1.02]">
              Автоматизация бизнес-процессов с помощью ИИ-агентов
            </h1>

            <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/78 sm:mt-6 sm:text-lg sm:leading-8">
              AzurSysTech помогает малому бизнесу внедрять ИИ-агентов для обработки входящих
              заявок и обращений, первичного intake и qualification, а также для автоматизации
              повторяющихся процессов — без полной перестройки бизнеса.
            </p>

            {/* Trust bullets */}
            <ul className="mt-6 space-y-2 sm:mt-8 sm:space-y-2.5">
              {[
                "Можно начать с одного процесса",
                "Подходит для малого бизнеса",
                "Человек остаётся в контуре принятия решений",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm font-medium leading-6 text-white/82 sm:text-base sm:leading-normal"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-teal/20 text-accent-teal">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                      <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Hero CTAs */}
            <div className="mt-7 flex flex-col gap-3 sm:mt-10 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-teal px-7 py-3.5 text-base font-bold text-white shadow-premium-soft transition-transform active:scale-95 hover:bg-accent-teal/90"
              >
                Обсудить задачу
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path fill="currentColor" d="M5 11h11.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H5v-2z" />
                </svg>
              </Link>
              <Link
                href="/brief"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/8 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/12"
              >
                Открыть бриф
              </Link>
            </div>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/72 underline underline-offset-4 transition-colors hover:text-white sm:mt-5"
            >
              WhatsApp: {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. INTRO ────────────────────────────────────────────────────────── */}
      <section className="bg-base py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div className="max-w-xl">
              <Label>О чём эта услуга</Label>
              <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-5xl md:leading-[1.02]">
                Что это значит на практике
              </h2>
            </div>

            <div className="space-y-5 text-lg leading-8 text-graphite/72 lg:pt-2">
              <p>
                Во многих компаниях заявки, сообщения и клиентские обращения приходят из разных
                каналов: сайт, мессенджеры, email, соцсети, формы, реклама. На первом этапе бизнес
                часто теряет время на однотипные вопросы, ручную квалификацию и хаотичную передачу
                информации дальше.
              </p>
              <p>
                ИИ-агент помогает взять на себя именно этот первый слой: принять обращение,
                уточнить задачу, собрать ключевые данные, подготовить краткое summary и передать
                его человеку или в рабочий процесс.
              </p>
              <p>
                Речь не о полной замене сотрудников и не о «магической автоматизации». Речь о том,
                чтобы снять ручную нагрузку там, где процесс уже повторяется и его можно аккуратно
                структурировать.
              </p>
              <p className="text-base leading-7 text-graphite/72">
                Если хотите посмотреть более широкий контур внедрения, изучите{" "}
                <Link
                  href="/business"
                  className="font-semibold text-graphite underline underline-offset-4 transition-colors hover:text-accent-teal"
                >
                  страницу для малого бизнеса
                </Link>
                .
              </p>

              {/* Flow diagram */}
              <div className="mt-8 flex flex-wrap items-center gap-2">
                {FLOW_STEPS.map((step, i) => (
                  <span key={step} className="flex items-center gap-2">
                    <span className="rounded-lg border border-accent-teal/25 bg-accent-teal/8 px-3.5 py-2 text-sm font-bold text-accent-teal">
                      {step}
                    </span>
                    {i < FLOW_STEPS.length - 1 && (
                      <span className="text-lg text-graphite/30" aria-hidden="true">
                        →
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. КОМУ ПОДХОДИТ ────────────────────────────────────────────────── */}
      <section className="bg-surface py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-12 max-w-2xl">
            <Label>Целевая аудитория</Label>
            <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-5xl md:leading-[1.02]">
              Кому подходит такая автоматизация
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {AUDIENCE_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-graphite/5 bg-base p-7 shadow-premium-soft"
              >
                <h3 className="mb-3 text-xl font-bold text-graphite">{card.title}</h3>
                <p className="mb-5 text-base leading-7 text-graphite/70">{card.copy}</p>
                <ul className="space-y-2.5 border-t border-graphite/8 pt-5">
                  {card.pains.map((pain) => (
                    <li
                      key={pain}
                      className="flex items-start gap-2.5 text-sm font-medium text-graphite/65"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-terra" />
                      {pain}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-sm font-semibold leading-6 text-graphite/80">{card.gain}</p>
                <p className="mt-2 text-sm leading-6 text-graphite/65">{card.control}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. С ЧЕГО НАЧАТЬ ────────────────────────────────────────────────── */}
      <section className="bg-base py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-4 max-w-2xl">
            <Label>Первый шаг</Label>
            <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-5xl md:leading-[1.02]">
              С чего можно начать без большой перестройки
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-graphite/72">
              Необязательно автоматизировать сразу весь бизнес. Во многих случаях достаточно
              выбрать один повторяющийся процесс, который уже сейчас забирает много времени.
            </p>
          </div>

          <div className="mt-10 grid gap-5 border-t border-graphite/10 pt-8 md:grid-cols-2 lg:grid-cols-3">
            {START_ITEMS.map((item) => (
              <div
                key={item.title}
                className="group flex gap-4 rounded-2xl border border-graphite/5 bg-surface p-5 shadow-sm transition duration-300 md:hover:-translate-y-1"
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-teal/10 text-accent-teal transition duration-300 group-hover:bg-accent-teal group-hover:text-white">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1.5 text-base font-bold text-graphite">{item.title}</h3>
                  <p className="text-sm leading-6 text-graphite/65">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. ГЛАВНЫЙ USE CASE ──────────────────────────────────────────────── */}
      <section className="bg-surface py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-12 max-w-2xl">
            <Label>Основной сценарий</Label>
            <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-5xl md:leading-[1.02]">
              ИИ-агент для обработки входящих заявок и обращений
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Without automation */}
            <div className="rounded-2xl border border-graphite/5 bg-base p-7 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-graphite">
                Что происходит без автоматизации
              </h3>
              <p className="text-base leading-7 text-graphite/72">
                Во многих бизнесах первый этап общения с клиентом зависит от занятости человека.
                Кто-то должен прочитать сообщение, понять контекст, задать одинаковые уточняющие
                вопросы, собрать данные и решить, что делать дальше. На этом этапе часто теряются
                скорость, структура и часть заявок.
              </p>
            </div>

            {/* What agent does */}
            <div className="rounded-2xl border border-accent-teal/15 bg-accent-teal/5 p-7">
              <h3 className="mb-4 text-xl font-bold text-graphite">Что делает ИИ-агент</h3>
              <p className="mb-4 text-base text-graphite/72">ИИ-агент помогает:</p>
              <ul className="space-y-2.5">
                {[
                  "принять обращение,",
                  "задать уточняющие вопросы,",
                  "понять тип запроса,",
                  "собрать ключевые данные,",
                  "подготовить summary,",
                  "передать задачу дальше по понятному workflow.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-base text-graphite/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-teal" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* What human keeps */}
            <div className="rounded-2xl border border-graphite/5 bg-base p-7 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-graphite">Что остаётся человеку</h3>
              <p className="mb-4 text-base text-graphite/72">Человек по-прежнему контролирует:</p>
              <ul className="space-y-2.5">
                {[
                  "сложные и нестандартные обращения,",
                  "коммерческие решения,",
                  "цену и сроки,",
                  "финальную коммуникацию там, где нужен judgement,",
                  "все чувствительные сценарии.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-base text-graphite/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-terra" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Business result */}
            <div className="rounded-2xl border border-graphite/5 bg-base p-7 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-graphite">
                Какой результат получает бизнес
              </h3>
              <p className="mb-4 text-base text-graphite/72">
                Бизнес получает не «магического автономного агента», а более структурированный и
                управляемый первый этап обработки обращений:
              </p>
              <ul className="space-y-2.5">
                {[
                  "меньше ручной рутины,",
                  "быстрее первичный intake,",
                  "понятнее qualification,",
                  "меньше потерь между каналами и этапами.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-base text-graphite/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-teal" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <InlineCta text="Хотите разобраться, подходит ли это вашему процессу?" />
        </div>
      </section>

      {/* ── 6. ЧТО УМЕЕТ ────────────────────────────────────────────────────── */}
      <section className="bg-base py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-12 max-w-2xl">
            <Label>Возможности</Label>
            <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-5xl md:leading-[1.02]">
              Что умеет ИИ-агент в реальном бизнес-процессе
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.title}
                className="group rounded-2xl border border-graphite/5 bg-surface p-6 shadow-sm transition duration-300 md:hover:-translate-y-1"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent-teal/10 text-accent-teal transition duration-300 group-hover:bg-accent-teal group-hover:text-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-current" />
                </div>
                <h3 className="mb-2 text-base font-bold text-graphite">{cap.title}</h3>
                <p className="text-sm leading-6 text-graphite/65">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. ЧТО НЕ ДЕЛАЕТ ────────────────────────────────────────────────── */}
      <section className="bg-graphite py-20 text-white md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="min-w-0 max-w-lg">
              <Label dark>Без иллюзий</Label>
              <h2 className="text-3xl font-extrabold tracking-tight text-white [overflow-wrap:anywhere] md:text-5xl md:leading-[1.02]">
                Без ложных обещаний и «магии&nbsp;автоматизации»
              </h2>
              <p className="mt-6 text-lg leading-8 text-white/70 [overflow-wrap:anywhere]">
                ИИ-автоматизация полезна там, где процесс уже можно описать и повторять. Она не
                должна подаваться как полная замена сотрудников или как автономная система, которая
                сама «разберётся во всём».
              </p>
            </div>

            <div className="min-w-0 border-t border-white/10 pt-8">
              <ul className="space-y-5">
                {NOT_ITEMS.map((item) => (
                  <li key={item} className="flex min-w-0 items-start gap-3.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/50">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4l5.6 5.6L5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6z"
                        />
                      </svg>
                    </span>
                    <span className="min-w-0 break-words text-base font-medium leading-7 text-white/82 [overflow-wrap:anywhere]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. ТИПОВЫЕ СЦЕНАРИИ ───────────────────────────────────────────────── */}
      <section className="bg-surface py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-12 max-w-2xl">
            <Label>Сценарии</Label>
            <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-5xl md:leading-[1.02]">
              Типовые сценарии использования
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {SCENARIOS.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-graphite/5 bg-base p-7 shadow-sm"
              >
                <h3 className="mb-3 text-lg font-bold text-graphite">{s.title}</h3>
                <p className="text-base leading-7 text-graphite/70">{s.desc}</p>
                <p className="mt-4 text-sm font-semibold leading-6 text-graphite/80">{s.gain}</p>
                <p className="mt-2 text-sm leading-6 text-graphite/65">{s.control}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. КАК ПРОХОДИТ ВНЕДРЕНИЕ ────────────────────────────────────────── */}
      <section className="bg-base py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-4 max-w-2xl">
            <Label>Процесс</Label>
            <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-5xl md:leading-[1.02]">
              Как проходит внедрение
            </h2>
          </div>

          <div className="mt-10 grid gap-8 border-t border-graphite/10 pt-8 md:grid-cols-5">
            {STEPS.map((step) => (
              <div key={step.num} className="border-l border-graphite/10 pl-5">
                <div className="mb-4 text-xs font-bold tracking-[0.22em] text-accent-teal">
                  {step.num}
                </div>
                <h3 className="mb-2 text-base font-bold text-graphite">{step.title}</h3>
                <p className="text-sm leading-6 text-graphite/65">{step.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 max-w-2xl text-base font-medium leading-7 text-graphite/65">
            Главная идея — начать с одного процесса, который уже даёт понятную пользу, а не
            пытаться перестроить весь бизнес сразу.
          </p>

          <CtaRow />
        </div>
      </section>

      {/* ── 10. КОГДА ОСОБЕННО ПОЛЕЗНО ───────────────────────────────────────── */}
      <section className="bg-surface py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-12 max-w-2xl">
            <Label>Признаки</Label>
            <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-5xl md:leading-[1.02]">
              Когда такая автоматизация особенно полезна
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {WHEN_USEFUL.map((item) => (
              <div
                key={item.title}
                className="border-l-2 border-accent-terra/40 pl-5"
              >
                <h3 className="mb-1.5 text-base font-bold text-graphite">{item.title}</h3>
                <p className="text-sm leading-6 text-graphite/65">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-base py-20 md:py-28">
        <div className="container mx-auto max-w-3xl px-4 md:px-8">
          <div className="mb-12 text-center">
            <Label>FAQ</Label>
            <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-4xl md:leading-[1.05]">
              Частые вопросы
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-graphite/5 bg-surface shadow-premium-soft [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between rounded-2xl p-6 font-bold text-graphite outline-none transition duration-200 hover:bg-base/40 focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2">
                  {f.q}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 shrink-0 text-graphite/50 transition-transform group-open:-rotate-180"
                  >
                    <path fill="currentColor" d="M12 15.4 6.3 9.7l1.4-1.4L12 12.6l4.3-4.3 1.4 1.4z" />
                  </svg>
                </summary>
                <div className="mt-2 border-t border-graphite/5 p-6 pt-4 text-base leading-7 text-graphite/72">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="bg-graphite py-20 text-white md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl md:leading-[1.02]">
              Обсудим, какой процесс имеет смысл автоматизировать первым
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/75">
              Можно начать с одного процесса — без обязательства на полную автоматизацию и без
              большой перестройки бизнеса.
            </p>
            <p className="mt-4 text-base font-medium text-white/58">
              Если у вас уже есть понятный поток заявок, повторяющиеся обращения или ручной
              workflow, который забирает много времени, можно начать именно с него.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent-teal px-7 py-3.5 text-base font-bold text-white shadow-premium-soft transition-transform active:scale-95 hover:bg-accent-teal/90"
              >
                Обсудить задачу
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path fill="currentColor" d="M5 11h11.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H5v-2z" />
                </svg>
              </Link>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/8 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/12"
              >
                Написать в WhatsApp
              </a>
              <Link
                href="/brief"
                className="text-base font-bold text-white/65 underline underline-offset-4 transition-colors hover:text-white"
              >
                Открыть бриф
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contextual footer links */}
      <nav
        aria-label="Связанные страницы"
        className="bg-base border-t border-graphite/8 py-8"
      >
        <div className="container mx-auto flex flex-wrap gap-x-8 gap-y-3 px-4 md:px-8">
          <Link
            href="/"
            className="text-sm font-semibold text-graphite/60 transition-colors hover:text-graphite"
          >
            IT-поддержка для бизнеса
          </Link>
          <Link
            href="/contact"
            className="text-sm font-semibold text-graphite/60 transition-colors hover:text-graphite"
          >
            Контакты
          </Link>
          <Link
            href="/business"
            className="text-sm font-semibold text-graphite/60 transition-colors hover:text-graphite"
          >
            Для бизнеса
          </Link>
          <Link
            href="/brief"
            className="text-sm font-semibold text-graphite/60 transition-colors hover:text-graphite"
          >
            Бриф
          </Link>
          <Link
            href="/faq"
            className="text-sm font-semibold text-graphite/60 transition-colors hover:text-graphite"
          >
            FAQ
          </Link>
          <Link
            href="/legal"
            className="text-sm font-semibold text-graphite/60 transition-colors hover:text-graphite"
          >
            Правовая информация
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-semibold text-graphite/60 transition-colors hover:text-graphite"
          >
            Политика конфиденциальности
          </Link>
        </div>
      </nav>
    </main>
  );
}
