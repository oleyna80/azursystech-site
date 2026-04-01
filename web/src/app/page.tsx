import Link from "next/link";

import { OpenChatButton } from "@/components/open-chat-button";

const CONTACT = {
  phoneDisplay: "+33 7 49 70 54 65",
  phoneHref: "tel:+33749705465",
  whatsappDisplay: "+33 7 49 70 54 65",
  whatsappHref: "https://wa.me/33749705465",
  email: "contact@azursystech.fr",
};

const SERVICE_LANES = [
  {
    title: "Для малого бизнеса",
    description: "Рабочие места, Wi-Fi, локальная сеть, принтеры и базовая IT-среда для TPE без лишней сложности.",
    bullets: ["Рабочие станции", "Сеть и Wi-Fi", "Общие папки", "Выездная помощь"],
  },
  {
    title: "Для дома",
    description: "Настройка нового ПК, ремонт типовых проблем, домашний интернет, принтер и перенос данных.",
    bullets: ["Новый компьютер", "Домашний Wi-Fi", "Принтер", "Оптимизация системы"],
  },
];

const CONTACT_PATHS = [
  {
    title: "Чат-помощник",
    description: "Быстро уточняет задачу, помогает собрать описание и переводит в заявку без лишних шагов.",
    accent: "text-[#1F6F78]",
  },
  {
    title: "Форма заявки",
    description: "Основной launch-safe путь: структурированные поля, квалификация обращения и передача в intake.",
    accent: "text-[#1F2A37]",
  },
  {
    title: "WhatsApp",
    description: "Резервный прямой канал, если нужно отправить контакты и краткое описание вручную.",
    accent: "text-[#8A4A2F]",
  },
];

const OPERATING_POINTS = [
  "Зона выезда: Nice и до 30 км вокруг.",
  "Работаем и с частными клиентами, и с TPE.",
  "Не обещаем цену и сроки до ручного уточнения задачи.",
  "Чат помогает собрать вводные, а не заменяет финальную квалификацию.",
];

const STEPS = [
  "Вы описываете задачу в чате или через форму.",
  "Мы получаем структурированное обращение и контакты.",
  "Уточняем объём, формат работ и выезд при необходимости.",
  "После этого подтверждаем ручной следующий шаг без ложных обещаний.",
];

const FAQ_PREVIEW = [
  {
    question: "Вы работаете только по Ницце?",
    answer: "Работаем в Nice и в радиусе до 30 км.",
  },
  {
    question: "Вы помогаете бизнесу или частным клиентам?",
    answer: "Помогаем и малому бизнесу (TPE), и частным клиентам.",
  },
  {
    question: "Можно ли сначала просто описать задачу?",
    answer: "Да. Для этого и сделан чат-помощник и контактная форма.",
  },
  {
    question: "Вы настраиваете Wi-Fi и принтеры?",
    answer: "Да, это одна из самых частых практических задач.",
  },
];

export default function HomePage() {
  return (
    <main className="bg-base px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-[#D8D0C4] bg-[#FFFDFC] px-8 py-10 shadow-premium-soft sm:px-10 sm:py-12">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-[#1F6F78]/10 via-transparent to-[#C96F4A]/10" />
          <div className="absolute -right-16 top-10 h-40 w-40 rounded-full bg-[#1F6F78]/6 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[#C96F4A]/8 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1F6F78]">
                AzurSysTech · Nice + 30 км
              </p>
              <h1 className="mt-5 max-w-4xl font-serif text-4xl leading-tight text-[#1F2A37] sm:text-5xl">
                IT-поддержка для малого бизнеса и дома с новым intake через чат и форму
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[#1F2A37]/85 sm:text-lg">
                Новый сайт ведёт в один понятный поток: клиент может быстро описать задачу через
                чат-помощник, перейти в структурированную заявку и передать контакты без лишней
                переписки и фальшивых обещаний.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <OpenChatButton className="rounded-xl bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#185A61]">
                  Открыть чат-помощник
                </OpenChatButton>
                <Link
                  href="/contact"
                  className="rounded-xl border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] transition hover:bg-[#F6F1E8]"
                >
                  Перейти к заявке
                </Link>
                <a
                  href={CONTACT.whatsappHref}
                  className="rounded-xl border border-[#C96F4A] bg-[#FFF3EE] px-5 py-3 text-sm font-semibold text-[#8A4A2F] transition hover:bg-[#FBE8DF]"
                >
                  Написать в WhatsApp
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <article className="rounded-2xl border border-[#D8D0C4] bg-white/80 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#1F6F78]">Scope</p>
                  <p className="mt-2 text-sm font-semibold text-[#1F2A37]">TPE и particuliers</p>
                </article>
                <article className="rounded-2xl border border-[#D8D0C4] bg-white/80 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#1F6F78]">Intake</p>
                  <p className="mt-2 text-sm font-semibold text-[#1F2A37]">Чат, форма, WhatsApp</p>
                </article>
                <article className="rounded-2xl border border-[#D8D0C4] bg-white/80 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#1F6F78]">Policy</p>
                  <p className="mt-2 text-sm font-semibold text-[#1F2A37]">Без обещаний цены и срока до ручной проверки</p>
                </article>
              </div>
            </div>

            <div className="grid gap-4">
              <section className="rounded-[1.75rem] border border-[#D8D0C4] bg-[#1F2A37] p-6 text-white shadow-premium-soft">
                <p className="text-xs uppercase tracking-[0.22em] text-white/60">Primary flow</p>
                <h2 className="mt-3 text-2xl font-semibold">Новый маршрут обращения</h2>
                <ol className="mt-5 space-y-3 text-sm text-white/85">
                  <li className="rounded-xl border border-white/10 bg-white/5 p-3">1. Чат уточняет суть проблемы</li>
                  <li className="rounded-xl border border-white/10 bg-white/5 p-3">2. Клиент передаёт контакты и детали</li>
                  <li className="rounded-xl border border-white/10 bg-white/5 p-3">3. Intake уходит в обработку без потери контекста</li>
                </ol>
              </section>

              <section className="rounded-[1.75rem] border border-[#D8D0C4] bg-[#FFF8F4] p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-[#8A4A2F]">Direct contact</p>
                <ul className="mt-4 space-y-3 text-sm text-[#1F2A37]/90">
                  <li>
                    Телефон: <a className="font-semibold text-[#1F6F78] underline" href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
                  </li>
                  <li>
                    WhatsApp: <a className="font-semibold text-[#8A4A2F] underline" href={CONTACT.whatsappHref}>{CONTACT.whatsappDisplay}</a>
                  </li>
                  <li>
                    Email: <a className="font-semibold text-[#1F6F78] underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          {SERVICE_LANES.map((lane) => (
            <article key={lane.title} className="rounded-[1.75rem] border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">Service lane</p>
              <h2 className="mt-3 font-serif text-3xl text-[#1F2A37]">{lane.title}</h2>
              <p className="mt-3 text-base leading-7 text-[#1F2A37]/85">{lane.description}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {lane.bullets.map((bullet) => (
                  <li key={bullet} className="rounded-xl border border-[#D8D0C4] bg-[#F9F5EE] px-4 py-3 text-sm font-medium text-[#1F2A37]">
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="rounded-[1.75rem] border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">Ways In</p>
              <h2 className="mt-3 font-serif text-3xl text-[#1F2A37]">Три launch-safe пути для нового обращения</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-[#1F2A37]/75">
              Все CTA теперь ведут в согласованный intake: чат открывает widget, форма ведёт на
              `/contact`, резервный канал остаётся WhatsApp.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {CONTACT_PATHS.map((path) => (
              <article key={path.title} className="rounded-2xl border border-[#D8D0C4] bg-[#FCFAF6] p-5">
                <h3 className={`text-lg font-semibold ${path.accent}`}>{path.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#1F2A37]/85">{path.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <OpenChatButton className="rounded-xl bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#185A61]">
              Открыть чат сейчас
            </OpenChatButton>
            <Link
              href="/contact"
              className="rounded-xl border border-[#D8D0C4] bg-white px-5 py-3 text-sm font-semibold text-[#1F2A37] transition hover:bg-[#F6F1E8]"
            >
              Открыть форму заявки
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[1.75rem] border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">Operating model</p>
            <h2 className="mt-3 font-serif text-3xl text-[#1F2A37]">Как мы держим launch-safe режим</h2>
            <ul className="mt-6 space-y-3">
              {OPERATING_POINTS.map((point) => (
                <li key={point} className="rounded-xl border border-[#D8D0C4] bg-[#F9F5EE] px-4 py-3 text-sm leading-6 text-[#1F2A37]/90">
                  {point}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[1.75rem] border border-[#D8D0C4] bg-[#1F6F78] p-8 text-white shadow-premium-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">Workflow</p>
            <h2 className="mt-3 font-serif text-3xl">Как проходит работа после отправки</h2>
            <ol className="mt-6 grid gap-3 sm:grid-cols-2">
              {STEPS.map((step, index) => (
                <li key={step} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm leading-6 text-white/90">
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                    Step 0{index + 1}
                  </span>
                  <span className="mt-2 block">{step}</span>
                </li>
              ))}
            </ol>
          </article>
        </section>

        <section className="rounded-[1.75rem] border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">FAQ Preview</p>
              <h2 className="mt-3 font-serif text-3xl text-[#1F2A37]">Частые вопросы до отправки заявки</h2>
            </div>
            <Link
              href="/faq"
              className="text-sm font-semibold text-[#1F6F78] underline decoration-[#1F6F78]/30 underline-offset-4"
            >
              Перейти в полный FAQ
            </Link>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {FAQ_PREVIEW.map((item) => (
              <article key={item.question} className="rounded-2xl border border-[#D8D0C4] bg-[#FCFAF6] p-5">
                <h3 className="text-lg font-semibold text-[#1F2A37]">{item.question}</h3>
                <p className="mt-3 text-sm leading-6 text-[#1F2A37]/85">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#D8D0C4] bg-gradient-to-br from-[#FFFDFC] via-[#FFF8F4] to-[#F4EFE6] p-8 shadow-premium-soft sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1F6F78]">Ready To Start</p>
              <h2 className="mt-3 font-serif text-3xl text-[#1F2A37] sm:text-4xl">
                Новый дизайн и новый intake теперь говорят на одном языке
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[#1F2A37]/85">
                Откройте чат-помощник для короткого диалога, или сразу переходите в форму заявки,
                если уже готовы описать задачу подробно.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <OpenChatButton className="rounded-xl bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#185A61]">
                Открыть чат-помощник
              </OpenChatButton>
              <Link
                href="/contact"
                className="rounded-xl border border-[#D8D0C4] bg-white px-5 py-3 text-center text-sm font-semibold text-[#1F2A37] transition hover:bg-[#F6F1E8]"
              >
                Перейти к форме
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
