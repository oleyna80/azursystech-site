import Link from "next/link";

const TRUST_POINTS = [
  "Локальная помощь в Nice и в зоне до 30 км.",
  "Фокус на практичном результате: рабочие места, Wi‑Fi, принтеры, локальная сеть.",
  "Понятная коммуникация без перегруженного технического языка.",
  "Бизнес-задачи (TPE) показываются и обрабатываются как приоритет.",
  "Прозрачные стартовые ориентиры по цене: «от», «по запросу», «зависит от объёма задачи».",
];

const WHO_WE_HELP = [
  "Малый бизнес и TPE: небольшие офисы, кабинеты, магазины, команды без штатного IT.",
  "Частные клиенты: настройка ПК, домашний Wi‑Fi, принтеры, повседневные задачи.",
  "Смешанные сценарии: домашний офис, 1-3 рабочих места, запуск нового места работы.",
];

const FOUNDER_APPROACH = [
  "Один понятный ответственный за задачу от первого контакта до результата.",
  "Сначала уточняем контекст, затем предлагаем практичный формат работ.",
  "Если нужен выезд — работаем на месте в согласованной зоне обслуживания.",
  "Если задача выходит за текущий scope, это проговаривается заранее и без ложных обещаний.",
];

const WORK_STEPS = [
  "Вы оставляете короткое описание задачи через форму, WhatsApp, звонок или email.",
  "Уточняются ключевые детали: тип задачи, устройства, срочность и формат работ.",
  "Предлагается рабочий формат: выезд или другой практичный вариант решения.",
  "После выполнения фиксируется понятный результат и следующий шаг при необходимости.",
];

export default function AboutPage() {
  return (
    <main className="bg-[#F6F1E8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">О проекте AzurSysTech</p>
          <h1 className="mt-4 max-w-4xl font-serif text-3xl text-[#1F2A37] sm:text-4xl">
            Локальная IT-помощь с понятным подходом для бизнеса и дома
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-[#1F2A37]/90">
            AzurSysTech — это практичный сервис для частных клиентов и малого бизнеса в Nice и рядом.
            На старте приоритет отдается бизнес-задачам TPE, при этом сохраняется отдельная понятная
            помощь для домашних пользователей.
          </p>
          <p className="mt-4 max-w-4xl text-[#1F2A37]/90">
            Проект ведёт основатель <strong>OLEINIK DMITRII</strong>: прямой контакт, прозрачная
            коммуникация и фокус на реальном результате вместо перегруженных технических формулировок.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white hover:bg-[#185A61]"
            >
              Оставить заявку
            </Link>
            <Link
              href="/services"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
            >
              Посмотреть услуги
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">На чем строится доверие</h2>
          <ul className="mt-5 grid gap-3 text-[#1F2A37]/90 sm:grid-cols-2">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="rounded-lg border border-[#D8D0C4] p-4">
                {point}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Кому помогает AzurSysTech</h2>
          <ul className="mt-5 grid gap-3 text-[#1F2A37]/90">
            {WHO_WE_HELP.map((item) => (
              <li key={item} className="rounded-lg border border-[#D8D0C4] p-4">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Как работает подход основателя</h2>
          <ul className="mt-5 grid gap-3 text-[#1F2A37]/90 sm:grid-cols-2">
            {FOUNDER_APPROACH.map((item) => (
              <li key={item} className="rounded-lg border border-[#D8D0C4] p-4">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Как проходит работа</h2>
          <ol className="mt-5 grid gap-3 text-[#1F2A37]/90 sm:grid-cols-2">
            {WORK_STEPS.map((step, index) => (
              <li key={step} className="rounded-lg border border-[#D8D0C4] p-4">
                <span className="font-semibold text-[#1F2A37]">{index + 1}.</span> {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Готовы обсудить задачу?</h2>
          <p className="mt-3 max-w-4xl text-[#1F2A37]/90">
            На странице контактов можно быстро описать задачу для бизнеса или дома, указать
            срочность и способ связи. Это основной launch-совместимый путь обращения.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white hover:bg-[#185A61]"
            >
              Перейти к контакту
            </Link>
            <Link
              href="/business"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
            >
              Для бизнеса
            </Link>
            <Link
              href="/home"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
            >
              Для дома
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
