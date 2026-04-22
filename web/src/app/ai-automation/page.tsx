import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Автоматизация бизнес-процессов с помощью ИИ-агентов | AzurSysTech",
  description:
    "AzurSysTech помогает малому бизнесу внедрять ИИ-агентов для обработки входящих заявок и обращений, их первичного приема, оценки и повторяющихся процессов — без полной перестройки бизнеса.",
};

const WHATSAPP = "https://wa.me/33780720994";

const CASES: Array<{
  id: string;
  title: string;
  copy: string;
  control: string;
  icon: "inbox" | "support" | "report" | "customer";
}> = [
  {
    id: "incoming-requests",
    title: "ИИ-агент для входящих обращений",
    copy: "Прием заявок с сайта, WhatsApp, почты и чата, уточнение деталей и передача команде уже в понятном виде.",
    control:
      "Контроль человека: приоритет, цена, сроки и сложные случаи.",
    icon: "inbox",
  },
  {
    id: "support",
    title: "ИИ-помощник для первичной поддержки",
    copy: "Повторяющиеся вопросы закрываются по правилам, а нестандартные обращения сразу уходят специалисту.",
    control:
      "Контроль человека: жалобы, спорные ситуации и ответственность.",
    icon: "support",
  },
  {
    id: "reports",
    title: "Автоматические отчёты и сводки",
    copy: "Регулярные данные из таблиц, форм или CRM собираются в короткую сводку для владельца или руководителя.",
    control:
      "Контроль человека: проверка цифр, выводы и управленческие решения.",
    icon: "report",
  },
  {
    id: "customer-evaluation",
    title: "Оценка потенциальных клиентов",
    copy: "ИИ-агент задаёт уточняющие вопросы, помогает понять готовность клиента и передаёт менеджеру короткое резюме.",
    control:
      "Контроль человека: коммерческое предложение, условия и финальный контакт.",
    icon: "customer",
  },
];

const CONTROL_ITEMS = [
  "Берёт на себя повторяющиеся действия, но не заменяет сотрудников.",
  "Помогает собрать и оценить обращение, но важные решения остаются за человеком.",
  "Готовит сводки, черновики и следующие шаги, но не делает коммерческих обещаний.",
  "Запускается с одного понятного процесса, а не с полной перестройки бизнеса.",
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
    desc: "Определяется, что именно делает ИИ-агент, какие данные он собирает, где нужен человек и как выглядит передача задачи дальше.",
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

const FAQS = [
  {
    q: "Что такое ИИ-агент для бизнеса?",
    a: "Это программный слой, который берет на себя повторяющиеся действия: прием обращений, уточнение деталей, сбор данных и подготовку короткой сводки для команды.",
  },
  {
    q: "Чем ИИ-агент отличается от обычного чат-бота?",
    a: "Обычный чат-бот чаще работает по жесткому сценарию. ИИ-агент гибче обрабатывает обращение, уточняет контекст и помогает подготовить следующий шаг для сотрудника.",
  },
  {
    q: "Можно ли начать с одного процесса?",
    a: "Да. Это как раз наиболее разумный путь. Обычно лучше начать с одного повторяющегося сценария, чем пытаться автоматизировать всё сразу.",
  },
  {
    q: "Что обычно автоматизируют в первую очередь?",
    a: "Чаще всего начинают с входящих обращений, первичной поддержки клиентов, отчетов и рабочих сводок или оценки потенциальных клиентов.",
  },
  {
    q: "Подходит ли это малому бизнесу?",
    a: "Да, особенно если у бизнеса уже есть повторяющийся поток заявок, обращений или рутинных действий, которые занимают время команды.",
  },
  {
    q: "Можно ли объединить сайт, чат и мессенджеры?",
    a: "Да. Это типичный старт: привести обращения из разных каналов к единому формату и передавать их команде уже с краткой сводкой.",
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
        "AzurSysTech помогает малому бизнесу внедрять ИИ-агентов для обработки входящих заявок и обращений, их первичного приема, оценки и повторяющихся процессов — без полной перестройки бизнеса.",
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
      serviceType: "ИИ-автоматизация первичного приема, оценки обращений и повторяющихся процессов",
      description:
        "Практичная автоматизация первого слоя обработки обращений для малого бизнеса с контролем человека.",
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

function HeroAnchors() {
  return (
    <aside className="relative mx-auto w-full max-w-lg lg:ml-auto">
      <div className="absolute -inset-8 rounded-full bg-accent-teal/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.055] p-5 shadow-premium-soft backdrop-blur-md sm:p-6">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-accent-terra/10 blur-2xl" />
        <div className="relative">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/58">
              Что можно автоматизировать первым
            </p>
            <p className="mt-2 max-w-sm text-base leading-7 text-white/74">
              Начните с одного повторяющегося процесса, а не с полной перестройки.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-3">
          {[
            { href: "#incoming-requests", label: "Входящие обращения" },
            { href: "#support", label: "Первичная поддержка" },
            { href: "#reports", label: "Отчёты и сводки" },
            { href: "#customer-evaluation", label: "Оценка клиентов" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 text-base font-semibold text-white/88 transition-colors hover:bg-white/[0.1]"
            >
              <span>{item.label}</span>
              <span className="text-accent-teal transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          ))}
        </div>
        <div className="relative mt-5 rounded-2xl border border-accent-terra/35 bg-accent-terra/12 p-4 text-base leading-7 text-white/85">
          Важные решения по-прежнему остаются за человеком.
        </div>
      </div>
    </aside>
  );
}

function CaseIcon({ type }: { type: "inbox" | "support" | "report" | "customer" }) {
  const iconClass = "h-6 w-6";

  if (type === "inbox") {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
        <path fill="currentColor" d="M4 5h16v14H4V5Zm2 2v6h3l1.5 2h3L15 13h3V7H6Zm0 8v2h12v-2h-2l-1.5 2h-5L8 15H6Z" />
      </svg>
    );
  }

  if (type === "support") {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
        <path fill="currentColor" d="M12 3a7 7 0 0 0-7 7v4a3 3 0 0 0 3 3h2v-6H7v-1a5 5 0 0 1 10 0v1h-3v6h3v1h-4v2h4a2 2 0 0 0 2-2v-1a3 3 0 0 0 2-2.83V10a7 7 0 0 0-7-7Z" />
      </svg>
    );
  }

  if (type === "report") {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
        <path fill="currentColor" d="M5 3h14v18H5V3Zm2 2v14h10V5H7Zm2 10h2v2H9v-2Zm0-4h2v3H9v-3Zm4-3h2v9h-2V8Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
      <path fill="currentColor" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.33 0-6 1.67-6 3.75V20h8.7a6 6 0 0 1-.7-2.83c0-.8.16-1.55.45-2.24A8.8 8.8 0 0 0 12 14Zm6.2 6.4 3.3-3.3-1.4-1.4-1.9 1.9-.8-.8-1.4 1.4 2.2 2.2Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="currentColor" d="M12 2 5 5v6c0 4.4 2.8 8.4 7 10 4.2-1.6 7-5.6 7-10V5l-7-3Zm-1 13.4-3-3 1.4-1.4 1.6 1.6 3.6-3.6L16 10.4l-5 5Z" />
    </svg>
  );
}

function MethodPanel() {
  const nodes = ["Разбор", "Пилот", "Логика", "Тест", "Запуск"];

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-graphite p-6 text-white shadow-premium-soft md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(31,111,120,0.34),transparent_42%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,rgba(201,111,74,0.16),transparent)]" />
      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-teal/80">
          От идеи к запуску
        </p>
        <h3 className="mt-4 text-3xl font-extrabold leading-tight text-white">
          Один процесс за один пилот
        </h3>

        <div className="relative mt-8 pl-2">
          <div className="absolute bottom-4 left-[1.32rem] top-4 w-px bg-white/14" />
          <div className="absolute left-[1.17rem] top-4 h-16 w-1 rounded-full bg-accent-teal/80 blur-[1px] [animation:method-flow_5s_ease-in-out_infinite]" />
          <div className="space-y-5">
            {nodes.map((item) => (
              <div key={item} className="relative flex items-center gap-4">
                <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent-teal/35 bg-graphite shadow-[0_0_0_6px_rgba(31,111,120,0.08)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-teal" />
                </span>
                <span className="text-base font-bold text-white/82">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.06] p-5">
          <p className="text-sm font-medium leading-6 text-white/72">
            Начинаем с одного процесса, проверяем логику на реальных сценариях и расширяем
            автоматизацию только после понятного результата.
          </p>
          <Link
            href="/brief"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-accent-teal px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-teal/90"
          >
            Обсудить задачу
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes method-flow {
          0%, 100% { transform: translateY(0); opacity: 0.35; }
          45%, 55% { opacity: 1; }
          80% { transform: translateY(12.5rem); opacity: 0.5; }
        }
      `}</style>
    </div>
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
      <section className="relative isolate overflow-hidden bg-graphite pb-14 pt-28 text-white md:pb-36 md:pt-32">
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

          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.98fr)_minmax(360px,0.72fr)] lg:items-center">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-white/55 sm:tracking-[0.2em]">
                Автоматизация и ИИ
              </p>

              <h1 className="max-w-3xl text-3xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-4xl md:text-6xl md:leading-[1.02]">
                Автоматизация бизнес-процессов с помощью ИИ-агентов
              </h1>

              <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/78 sm:mt-6 sm:text-lg sm:leading-8">
                AzurSysTech помогает малому бизнесу внедрять ИИ-агентов для обработки входящих
                заявок и обращений, их первичного приема и оценки, а также для
                автоматизации повторяющихся процессов — без полной перестройки бизнеса.
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
                  href="/brief"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-teal px-7 py-3.5 text-base font-bold text-white shadow-premium-soft transition-transform active:scale-95 hover:bg-accent-teal/90"
                >
                  Обсудить задачу
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path fill="currentColor" d="M5 11h11.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H5v-2z" />
                  </svg>
                </Link>
              </div>
            </div>
            <HeroAnchors />
          </div>
        </div>
      </section>

      {/* ── 2. CASES ───────────────────────────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-10 max-w-2xl">
            <Label>Что автоматизируем</Label>
            <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-4xl md:leading-[1.04]">
              Практические сценарии для малого бизнеса
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {CASES.map((item) => (
              <article
                id={item.id}
                key={item.id}
                className="scroll-mt-28 rounded-2xl border border-graphite/8 bg-white p-6 shadow-premium-soft"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold text-graphite">{item.title}</h3>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-teal/10 text-accent-teal">
                    <CaseIcon type={item.icon} />
                  </span>
                </div>
                <p className="mt-5 text-base leading-7 text-graphite/72">{item.copy}</p>
                <div className="mt-6 flex items-start gap-2.5 border-t border-graphite/8 pt-4 text-sm font-semibold leading-6 text-graphite/78">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-teal/10 text-accent-teal">
                    <ShieldIcon />
                  </span>
                  <p>{item.control}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. GUARDRAILS ──────────────────────────────────────────────────── */}
      <section className="bg-graphite py-16 text-white md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="min-w-0 max-w-lg">
              <Label dark>Реалистичный подход</Label>
              <h2 className="text-3xl font-extrabold tracking-tight text-white [overflow-wrap:anywhere] md:text-4xl md:leading-[1.04]">
                ИИ берёт на себя рутину, а контроль остаётся у команды
              </h2>
            </div>

            <div className="min-w-0 border-t border-white/10 pt-8">
              <ul className="space-y-5">
                {CONTROL_ITEMS.map((item) => (
                  <li key={item} className="flex min-w-0 items-start gap-3.5">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent-teal/35 bg-accent-teal/12 text-accent-teal">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"
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

      {/* ── 4. STEPS ───────────────────────────────────────────────────────── */}
      <section className="bg-base py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <MethodPanel />

            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-5xl md:leading-[1.02]">
                Как проходит внедрение
              </h2>

              <div className="mt-12 border-y border-graphite/10">
                {STEPS.map((step, index) => (
                  <details
                    key={step.num}
                    className="group border-b border-graphite/10 last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
                    open={index === 0}
                  >
                    <summary className="grid cursor-pointer gap-4 py-6 outline-none transition-colors hover:text-accent-teal focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-4 sm:grid-cols-[minmax(0,1fr)_3rem]">
                      <h3 className="text-lg font-bold text-graphite transition-colors group-hover:text-accent-teal">
                        {step.title}
                      </h3>
                      <span className="text-right text-sm font-bold tracking-[0.18em] text-graphite/70">
                        {step.num}
                      </span>
                    </summary>
                    <div className="max-w-xl pb-6 text-base leading-7 text-graphite/68">
                      {step.desc}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FAQ ─────────────────────────────────────────────────────────── */}
      <section className="bg-graphite py-16 text-white md:py-20">
        <div className="container mx-auto max-w-3xl px-4 md:px-8">
          <div className="mb-12 text-center">
            <Label dark>FAQ</Label>
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl md:leading-[1.05]">
              Частые вопросы
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-white/10 bg-white/[0.055] shadow-premium-soft [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between rounded-2xl p-6 font-bold text-white outline-none transition duration-200 hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-graphite">
                  {f.q}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 shrink-0 text-white/50 transition-transform group-open:-rotate-180"
                  >
                    <path fill="currentColor" d="M12 15.4 6.3 9.7l1.4-1.4L12 12.6l4.3-4.3 1.4 1.4z" />
                  </svg>
                </summary>
                <div className="mt-2 border-t border-white/10 p-6 pt-4 text-base leading-7 text-white/72">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FINAL CTA ───────────────────────────────────────────────────── */}
      <section className="bg-base py-16 text-graphite md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-5xl md:leading-[1.02]">
              Обсудим, какой процесс имеет смысл автоматизировать первым
            </h2>
            <p className="mt-6 text-lg leading-8 text-graphite/72">
              Можно начать с одного процесса — без обязательства на полную автоматизацию и без
              большой перестройки бизнеса.
            </p>
            <p className="mt-4 text-base font-medium text-graphite/58">
              Если у вас уже есть понятный поток заявок, повторяющиеся обращения или ручной
              процесс, который забирает много времени, можно начать именно с него.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/brief"
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
                className="inline-flex items-center justify-center rounded-full border border-graphite/20 bg-surface px-7 py-3.5 text-base font-bold text-graphite transition-colors hover:bg-white"
              >
                Написать в WhatsApp
              </a>
            </div>
            <p className="mt-4 text-sm leading-6 text-graphite/58">
              Следующий шаг после кнопки «Обсудить задачу» — короткий бриф на один процесс.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
