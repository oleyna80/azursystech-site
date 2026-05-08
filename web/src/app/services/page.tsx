import Link from "next/link";

const BUSINESS_SERVICES = [
  {
    title: "Рабочие места и новые устройства",
    description:
      "Подготовка компьютеров, базовая настройка системы и программ, подключение к сети и периферии.",
    pricing: "от 90 € / пост",
  },
  {
    title: "Wi-Fi и локальная сеть",
    description:
      "Настройка сети для офиса, магазина или кабинета, подключение устройств и проверка стабильности.",
    pricing: "от 120 €",
  },
  {
    title: "Сетевые принтеры",
    description:
      "Подключение принтеров, базовая конфигурация доступа и проверка работы на рабочих местах.",
    pricing: "от 80 €",
  },
  {
    title: "Общие папки и локальный доступ",
    description:
      "Настройка простого обмена файлами между устройствами без лишней сложности.",
    pricing: "от 120 €",
  },
  {
    title: "Выездная IT-помощь",
    description:
      "Практичная помощь на месте при сбоях, подключении нового оборудования и расширении рабочей среды.",
    pricing: "от 65 €",
  },
  {
    title: "Базовая настройка IT-среды TPE",
    description:
      "Организация небольшой IT-среды для команды, кабинета, магазина или нового офиса.",
    pricing: "по запросу",
  },
];

const HOME_SERVICES = [
  {
    title: "Диагностика и ремонт ПК",
    description:
      "Типовые проблемы с компьютером, ноутбуком, запуском системы и базовой работоспособностью.",
    pricing: "от 50 €",
  },
  {
    title: "Новый компьютер под ключ",
    description:
      "Первичная настройка, обновления, базовые программы и подготовка устройства к работе.",
    pricing: "от 80 €",
  },
  {
    title: "Wi-Fi и принтер дома",
    description:
      "Настройка сети, подключение принтера и проверка работы устройств дома или в домашнем офисе.",
    pricing: "от 70 €",
  },
  {
    title: "Оптимизация и апгрейд",
    description:
      "Ускорение системы, базовая оптимизация, перенос данных и понятные рекомендации по апгрейду.",
    pricing: "от 60 € + материалы при необходимости",
  },
];

const PACKAGES = [
  {
    title: "Пакет TPE: рабочее место",
    audience: "Для малого бизнеса, магазинов, кабинетов и новых сотрудников.",
    pricing: "от 90 € / пост",
    items: [
      "настройка рабочего места",
      "подключение к локальной сети",
      "подключение принтера",
      "базовая настройка программ",
      "проверка работоспособности",
    ],
  },
  {
    title: "Пакет TPE: небольшой офис",
    audience: "Для TPE, небольших команд, кабинетов и торговых точек.",
    pricing: "по запросу",
    items: [
      "базовая организация IT-среды",
      "Wi-Fi и подключение устройств",
      "принтеры и рабочие станции",
      "простая логика общего доступа",
      "выездная настройка на месте",
    ],
  },
  {
    title: "Пакет: новый ПК готов к работе",
    audience: "Для частных клиентов, удаленной работы и домашнего использования.",
    pricing: "от 80 €",
    items: [
      "первый запуск",
      "базовая настройка Windows",
      "обновления и драйверы",
      "установка базовых программ",
      "простое подключение принтера при необходимости",
    ],
  },
  {
    title: "Пакет: Wi-Fi и принтер дома",
    audience: "Для дома и небольшого домашнего офиса.",
    pricing: "от 90 €",
    items: [
      "диагностика Wi-Fi",
      "базовая настройка роутера",
      "подключение принтера",
      "проверка на 1-2 устройствах",
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: "Вы работаете только с бизнесом?",
    answer:
      "Нет. Основной акцент на малый бизнес и TPE, но отдельный блок услуг предусмотрен и для частных клиентов.",
  },
  {
    question: "Почему цены указаны как \"от\" или \"по запросу\"?",
    answer:
      "Похожие задачи могут сильно отличаться по объему. Поэтому на странице указаны стартовые ориентиры, а точная оценка дается после короткого описания задачи.",
  },
  {
    question: "Можно ли обратиться по настройке небольшого офиса или 1-3 рабочих мест?",
    answer:
      "Да. Это один из типовых сценариев для AzurSysTech: рабочие места, Wi-Fi, принтеры и базовая локальная инфраструктура.",
  },
];

const DETAILED_SERVICE_PAGES = [
  {
    href: "/services/tpe-setup",
    title: "Настройка IT-среды для TPE",
    description: "Отдельная страница для малого бизнеса: рабочие места, сеть, принтеры и запуск среды.",
  },
  {
    href: "/services/new-pc-setup",
    title: "Настройка нового ПК",
    description: "Понятный старт нового компьютера для дома, home-office и малого бизнеса.",
  },
  {
    href: "/services/wifi-printer",
    title: "Wi‑Fi и принтер",
    description: "Практичная помощь с подключением устройств и типовыми проблемами связи.",
  },
  {
    href: "/services/onsite-support",
    title: "Выездная IT-поддержка",
    description: "Локальная помощь на месте в Nice и зоне до 30 км.",
  },
];

export default function ServicesPage() {
  return (
    <main className="bg-[#F6F1E8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">
            AzurSysTech
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-3xl text-[#1F2A37] sm:text-4xl">
            Услуги для малого бизнеса и частных клиентов в Nice и рядом
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-[#1F2A37]/90">
            На этой странице собраны основные услуги AzurSysTech: рабочие места, Wi-Fi,
            локальная сеть, принтеры, новые компьютеры и выездная IT-помощь. Приоритет на
            старте - практичные задачи малого бизнеса и TPE.
          </p>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-[#1F2A37]/80">
            Для задач по обработке входящих обращений и repeatable workflows доступна отдельная{" "}
            <Link className="font-semibold text-[#1F6F78] underline" href="/ai-automation">
              страница AI-автоматизации
            </Link>
            .
          </p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#C96F4A]">
                Для бизнеса
              </p>
              <h2 className="mt-2 font-serif text-2xl text-[#1F2A37]">
                Услуги для TPE, магазинов, кабинетов и небольших офисов
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[#1F2A37]/75">
              Сначала показаны услуги для малого бизнеса: рабочие места, локальная сеть,
              принтеры и практичная настройка небольшой IT-среды.
            </p>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {BUSINESS_SERVICES.map((service) => (
              <article key={service.title} className="rounded-xl border border-[#D8D0C4] p-5">
                <h3 className="text-lg font-semibold text-[#1F2A37]">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#1F2A37]/90">{service.description}</p>
                <p className="mt-4 text-sm font-medium text-[#1F6F78]">{service.pricing}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1F6F78]">
            Для дома
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[#1F2A37]">
            Услуги для частных клиентов и домашнего офиса
          </h2>
          <p className="mt-3 max-w-4xl text-[#1F2A37]/90">
            Отдельный блок для дома собран проще и понятнее: диагностика ПК, новый компьютер,
            домашний Wi-Fi, принтер и ускорение системы.
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {HOME_SERVICES.map((service) => (
              <article key={service.title} className="rounded-xl border border-[#D8D0C4] p-5">
                <h3 className="text-lg font-semibold text-[#1F2A37]">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#1F2A37]/90">{service.description}</p>
                <p className="mt-4 text-sm font-medium text-[#1F6F78]">{service.pricing}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1F6F78]">
            Пакеты
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[#1F2A37]">
            Пакетные форматы для типовых задач
          </h2>
          <p className="mt-3 max-w-4xl text-[#1F2A37]/90">
            AzurSysTech показывает не только часы работы, но и понятные результаты:
            стартовая цена, типовой состав работ и формат “по запросу”, когда объем зависит от
            конкретной среды.
          </p>
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {PACKAGES.map((pkg) => (
              <article key={pkg.title} className="rounded-xl border border-[#D8D0C4] p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1F2A37]">{pkg.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#1F2A37]/90">{pkg.audience}</p>
                  </div>
                  <p className="text-sm font-medium text-[#1F6F78]">{pkg.pricing}</p>
                </div>
                <ul className="mt-4 grid gap-2 text-sm text-[#1F2A37]/90">
                  {pkg.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#1F2A37]/75">
            Финальная стоимость зависит от количества устройств, конфигурации и формата выезда.
          </p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Как обратиться по услуге</h2>
          <p className="mt-3 max-w-4xl text-[#1F2A37]/90">
            Самый простой путь - коротко описать задачу на странице контактов. Достаточно
            указать, это запрос для бизнеса или дома, что нужно сделать и сколько устройств
            участвует в задаче.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white hover:bg-[#185A61]"
            >
              Перейти к заявке
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
          <h2 className="font-serif text-2xl text-[#1F2A37]">Детальные страницы услуг</h2>
          <p className="mt-3 max-w-4xl text-[#1F2A37]/90">
            Для типовых запросов доступны отдельные страницы с более точным описанием сценариев
            и CTA.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {DETAILED_SERVICE_PAGES.map((page) => (
              <article key={page.href} className="rounded-xl border border-[#D8D0C4] p-5">
                <h3 className="text-lg font-semibold text-[#1F2A37]">{page.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#1F2A37]/90">{page.description}</p>
                <Link href={page.href} className="mt-4 inline-block text-sm font-semibold text-[#1F6F78] underline">
                  Перейти на страницу
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Короткий FAQ по услугам</h2>
          <div className="mt-5 grid gap-4">
            {FAQ_ITEMS.map((item) => (
              <article key={item.question} className="rounded-xl border border-[#D8D0C4] p-5">
                <h3 className="font-semibold text-[#1F2A37]">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-[#1F2A37]/90">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">
            Нужна оценка услуги или помощь с выбором?
          </h2>
          <p className="mt-3 max-w-4xl text-[#1F2A37]/90">
            Для малого бизнеса и частных клиентов следующий шаг одинаковый: коротко описать
            задачу на странице контактов. Это помогает быстро понять формат работ и дать стартовую
            оценку без лишних обещаний.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-block rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white hover:bg-[#185A61]"
            >
              Оставить заявку
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
