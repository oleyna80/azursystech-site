import Link from "next/link";

const BUSINESS_PROBLEMS = [
  "Нестабильный Wi‑Fi мешает работе сотрудников и оплатам в точке продаж.",
  "Новые рабочие места нужно быстро подключить без простоя.",
  "Принтеры работают нестабильно или недоступны с части устройств.",
  "Нет понятной структуры для общих папок и доступа к файлам.",
  "При росте команды локальная сеть перестает быть предсказуемой.",
  "Нужен выезд на место, когда удаленно задачу не закрыть.",
];

const SETUP_AREAS = [
  {
    title: "Рабочие места",
    description:
      "Подготовка и подключение рабочих мест: базовая настройка, подключение к сети и проверка готовности к ежедневной работе.",
  },
  {
    title: "Wi‑Fi и локальная сеть",
    description:
      "Практичная настройка офисной или торговой сети: стабильность, доступность устройств и понятная схема подключения.",
  },
  {
    title: "Принтеры и периферия",
    description:
      "Подключение и базовая конфигурация принтеров для рабочих мест, чтобы печать работала без ручных обходных решений.",
  },
  {
    title: "Общие папки",
    description:
      "Простой и безопасный общий доступ к рабочим файлам внутри малого офиса, кабинета или магазина.",
  },
  {
    title: "Выезд на место",
    description:
      "Выезд на место в Nice и рядом, когда нужно быстро восстановить рабочий процесс или подключить новое оборудование.",
  },
];

const USE_CASES = [
  {
    title: "Новый кабинет или небольшой офис",
    description:
      "Подключаем 1-10 рабочих мест, Wi‑Fi, принтеры и общий доступ к папкам без перегруженной схемы.",
  },
  {
    title: "Магазин или торговая точка",
    description:
      "Помогаем стабилизировать сеть, подключить рабочие станции и убрать повторяющиеся технические сбои в ежедневной работе.",
  },
  {
    title: "Маленькая команда без штатного IT",
    description:
      "Закрываем типовые задачи по инфраструктуре и поддержке, чтобы у бизнеса был один понятный внешний специалист.",
  },
  {
    title: "Добавление новых сотрудников",
    description:
      "Готовим новые рабочие места и интегрируем их в действующую среду без хаотичных ручных настроек.",
  },
];

const OFFER_BLOCKS = [
  {
    title: "Рабочее место для TPE",
    description:
      "Настройка рабочего места, подключение к сети, принтера и базовая проверка готовности.",
    pricing: "от 90 € / пост",
  },
  {
    title: "Wi‑Fi и локальная сеть для малого офиса",
    description:
      "Базовая настройка локальной сети и Wi‑Fi для стабильной совместной работы устройств.",
    pricing: "от 120 €",
  },
  {
    title: "Выездная IT-помощь на месте",
    description:
      "Практичная выездная помощь для диагностики, подключения и устранения сбоев.",
    pricing: "от 65 €",
  },
  {
    title: "Запуск IT-среды для малого бизнеса",
    description:
      "Комплексный запуск небольшой IT-среды: рабочие места, принтеры, Wi‑Fi и общие папки.",
    pricing: "по запросу",
  },
];

const HOW_WE_WORK = [
  "Вы кратко описываете задачу и контекст бизнеса.",
  "Уточняем объём работ: устройства, сеть, выезд и сроки.",
  "Предлагаем практичный формат выполнения без лишней сложности.",
  "Выполняем настройку на месте или в согласованном формате.",
  "Проверяем результат и фиксируем следующий шаг при необходимости.",
];

const BUSINESS_FAQ = [
  {
    question: "Вы работаете только с крупными компаниями?",
    answer:
      "Нет. Основной фокус этой страницы — TPE, небольшие магазины, кабинеты и офисы без сложного корпоративного подхода.",
  },
  {
    question: "Можно ли вызвать специалиста на место?",
    answer:
      "Да. Выезд на место — одна из базовых услуг для бизнес-задач в зоне Nice + 30 км.",
  },
  {
    question: "Почему на странице цены “от” и “по запросу”?",
    answer:
      "Потому что итог зависит от объёма задачи: количества рабочих мест, состояния сети и состава оборудования.",
  },
];

export default function BusinessPage() {
  return (
    <main className="bg-[#F6F1E8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">AzurSysTech</p>
          <h1 className="mt-4 max-w-4xl font-serif text-3xl text-[#1F2A37] sm:text-4xl">
            IT-поддержка для малого бизнеса и TPE в Nice и рядом
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-[#1F2A37]/90">
            Практичная помощь для небольших магазинов, кабинетов и офисов: рабочие места,
            Wi‑Fi, локальная сеть, принтеры, общие папки и выезд на место.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white hover:bg-[#185A61]"
            >
              Оставить заявку для бизнеса
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
            >
              Описать задачу
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Типичные проблемы малого бизнеса</h2>
          <ul className="mt-5 grid gap-3 text-[#1F2A37]/90 sm:grid-cols-2">
            {BUSINESS_PROBLEMS.map((problem) => (
              <li key={problem} className="rounded-lg border border-[#D8D0C4] p-4">
                {problem}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Что AzurSysTech может настроить</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {SETUP_AREAS.map((area) => (
              <article key={area.title} className="rounded-xl border border-[#D8D0C4] p-5">
                <h3 className="text-lg font-semibold text-[#1F2A37]">{area.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#1F2A37]/90">{area.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Кейсы, с которыми обращаются чаще всего</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {USE_CASES.map((useCase) => (
              <article key={useCase.title} className="rounded-xl border border-[#D8D0C4] p-5">
                <h3 className="text-lg font-semibold text-[#1F2A37]">{useCase.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#1F2A37]/90">{useCase.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Основные форматы услуг для TPE</h2>
          <p className="mt-3 max-w-4xl text-[#1F2A37]/90">
            Подача цен — только в практичном формате: от, по запросу и с учетом объёма задачи.
          </p>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {OFFER_BLOCKS.map((offer) => (
              <article key={offer.title} className="rounded-xl border border-[#D8D0C4] p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-[#1F2A37]">{offer.title}</h3>
                  <p className="text-sm font-medium text-[#1F6F78]">{offer.pricing}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#1F2A37]/90">{offer.description}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#1F2A37]/75">Итоговая стоимость зависит от объёма задачи.</p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Как мы работаем</h2>
          <ol className="mt-5 grid gap-3 text-[#1F2A37]/90 sm:grid-cols-2 lg:grid-cols-5">
            {HOW_WE_WORK.map((step, index) => (
              <li key={step} className="rounded-lg border border-[#D8D0C4] p-4">
                <span className="font-semibold text-[#1F2A37]">{index + 1}.</span> {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">
            Нужна настройка для бизнеса или оценка работ?
          </h2>
          <p className="mt-3 max-w-4xl text-[#1F2A37]/90">
            Опишите задачу на странице контактов: что нужно настроить, сколько устройств и нужен
            ли выезд. Это помогает быстро предложить подходящий формат работ.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white hover:bg-[#185A61]"
            >
              Перейти к контакту
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
            >
              Запросить оценку
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Короткий FAQ для бизнеса</h2>
          <div className="mt-5 grid gap-4">
            {BUSINESS_FAQ.map((item) => (
              <article key={item.question} className="rounded-xl border border-[#D8D0C4] p-5">
                <h3 className="font-semibold text-[#1F2A37]">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-[#1F2A37]/90">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
