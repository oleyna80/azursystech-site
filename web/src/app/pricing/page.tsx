import Link from "next/link";

const PRICING_LOGIC = [
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
];

const BUSINESS_ENTRY = [
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
];

const HOME_ENTRY = [
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
];

const COST_FACTORS = [
  "Количество устройств и рабочих точек.",
  "Сложность и связность задачи (один элемент или среда целиком).",
  "Текущее состояние оборудования и сети.",
  "Нужен ли выезд и какой объём работ выполняется на месте.",
  "Контекст задачи: дом или малый бизнес.",
];

const INCLUDED = [
  "Базовая диагностика и определение следующего практичного шага.",
  "Базовая настройка в рамках заявленного объёма задачи.",
  "Подключение устройств и проверка работоспособности по ключевому сценарию.",
  "Короткое и понятное объяснение результата без сложной технической подачи.",
];

const NOT_INCLUDED = [
  "Стоимость оборудования, комплектующих и лицензий (если они нужны).",
  "Крупные проекты уровня большой корпоративной инфраструктуры.",
  "Работы вне стартового объёма, выявленные в процессе, без отдельного согласования.",
  "Расширенные задачи, которые выходят за рамки базовой настройки для дома или TPE.",
];

const ESTIMATE_STEPS = [
  "Перейдите на страницу контактов и выберите, это запрос для бизнеса или для дома.",
  "Коротко опишите задачу и укажите, что именно сейчас не работает или что нужно настроить.",
  "Добавьте количество устройств и отметьте, нужен ли выезд.",
  "После этого можно получить следующий понятный шаг по оценке без фиктивных обещаний.",
];

export default function PricingPage() {
  return (
    <main className="bg-[#F6F1E8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">AzurSysTech</p>
          <h1 className="mt-4 max-w-4xl font-serif text-3xl leading-tight text-[#1F2A37] sm:text-4xl">
            Цены без скрытой неопределённости: понятный вход и честная логика оценки
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-[#1F2A37]/90">
            Эта страница — не фиксированный прайс-каталог. Мы показываем ориентиры, чтобы упростить
            первый шаг: формат «от», формат «по запросу» и правило «зависит от объёма задачи».
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#185A61]"
            >
              Запросить оценку
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] transition hover:bg-[#F6F1E8]"
            >
              Описать задачу
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Как работает ценообразование</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {PRICING_LOGIC.map((item) => (
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
                Для бизнеса — первым блоком
              </p>
              <h2 className="mt-2 font-serif text-2xl text-[#1F2A37]">Входные ориентиры для TPE</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[#1F2A37]/80">
              Бизнес-блок расположен первым, чтобы владельцу малого бизнеса было проще сразу понять
              релевантный ценовой вход.
            </p>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {BUSINESS_ENTRY.map((item) => (
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
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1F6F78]">Для дома</p>
          <h2 className="mt-2 font-serif text-2xl text-[#1F2A37]">Входные ориентиры для частных клиентов</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {HOME_ENTRY.map((item) => (
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
          <p className="mt-4 text-sm text-[#1F2A37]/80">Итоговая стоимость зависит от объёма задачи.</p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Что влияет на финальную стоимость</h2>
          <ul className="mt-5 grid gap-3 text-[#1F2A37]/90 sm:grid-cols-2">
            {COST_FACTORS.map((factor) => (
              <li key={factor} className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] p-4">
                {factor}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Что обычно входит и что обычно не входит</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <article className="rounded-xl border border-[#D8D0C4] bg-[#FFFDFC] p-5">
              <h3 className="text-lg font-semibold text-[#1F6F78]">Обычно входит</h3>
              <ul className="mt-4 grid gap-2 text-sm leading-6 text-[#1F2A37]/90">
                {INCLUDED.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-xl border border-[#D8D0C4] bg-[#FFFDFC] p-5">
              <h3 className="text-lg font-semibold text-[#C96F4A]">Обычно не входит</h3>
              <ul className="mt-4 grid gap-2 text-sm leading-6 text-[#1F2A37]/90">
                {NOT_INCLUDED.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Как запросить оценку</h2>
          <ol className="mt-5 grid gap-3 text-[#1F2A37]/90 sm:grid-cols-2">
            {ESTIMATE_STEPS.map((step, index) => (
              <li key={step} className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] p-4">
                <span className="font-semibold text-[#1F2A37]">{index + 1}.</span> {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <h2 className="font-serif text-2xl text-[#1F2A37] sm:text-3xl">
            Нужна оценка для бизнеса или домашней задачи?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#1F2A37]/90">
            Перейдите в контакты и опишите запрос. Такой формат помогает быстро перейти от
            неопределённости к понятному следующему шагу.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#185A61]"
            >
              Перейти к контактам
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] transition hover:bg-[#F6F1E8]"
            >
              Оставить заявку
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
