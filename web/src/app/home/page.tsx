import Link from "next/link";

const HOME_PROBLEMS = [
  "Компьютер работает медленно или периодически зависает.",
  "Новый компьютер куплен, но непонятно, как всё правильно настроить.",
  "Wi‑Fi нестабилен: связь пропадает или скорость слишком низкая.",
  "Принтер не подключается или печатает с ошибками.",
  "Нужно установить программы и настроить всё для повседневных задач.",
  "Нужно аккуратно перенести файлы со старого устройства на новое.",
];

const MAIN_SERVICES = [
  {
    title: "Диагностика ПК",
    description:
      "Проверка состояния компьютера и понятное объяснение, почему возникает проблема и как её решить без лишней сложности.",
  },
  {
    title: "Новый компьютер",
    description:
      "Подготовка нового ПК к работе: базовая настройка, обновления и подключение к домашней среде.",
  },
  {
    title: "Wi‑Fi",
    description:
      "Настройка домашнего Wi‑Fi для более стабильной работы интернета на основных устройствах.",
  },
  {
    title: "Принтер",
    description:
      "Подключение и настройка принтера, чтобы печать работала предсказуемо без постоянных повторных действий.",
  },
  {
    title: "Установка программ",
    description:
      "Установка и первичная настройка нужных программ для повседневной работы и дома.",
  },
  {
    title: "Оптимизация / апгрейд",
    description:
      "Базовое ускорение системы и рекомендации по апгрейду, когда это действительно помогает в вашем случае.",
  },
  {
    title: "Простой перенос данных",
    description:
      "Перенос документов, фото и базовых пользовательских данных со старого устройства на новое.",
  },
];

const PRICES_FROM = [
  { service: "Диагностика ПК", price: "от 50 €" },
  { service: "Новый компьютер", price: "от 80 €" },
  { service: "Wi‑Fi", price: "от 70 €" },
  { service: "Принтер", price: "от 60 €" },
  { service: "Установка программ", price: "от 50 €" },
  { service: "Оптимизация / апгрейд", price: "от 60 €" },
  { service: "Простой перенос данных", price: "от 70 €" },
];

const REQUEST_HELP_STEPS = [
  "Оставьте краткое описание задачи на странице контактов.",
  "Укажите, что именно не работает или что нужно настроить.",
  "Сообщите удобный способ связи: телефон, WhatsApp или email.",
  "После этого можно быстро согласовать понятный следующий шаг.",
];

const HOME_FAQ = [
  {
    question: "Это страница только для частных клиентов?",
    answer:
      "Да. Эта страница сделана для частных и домашних пользователей. Для малого бизнеса есть отдельный раздел «Для бизнеса».",
  },
  {
    question: "Можно ли обратиться, если я не разбираюсь в технике?",
    answer:
      "Да. Коммуникация строится простыми словами, без перегруженных технических объяснений.",
  },
  {
    question: "Почему цены указаны в формате “от”?",
    answer:
      "Потому что итоговая стоимость зависит от объёма задачи: состояния устройства, количества шагов и состава работ.",
  },
  {
    question: "Можно ли обратиться по Wi‑Fi и принтеру в одной заявке?",
    answer:
      "Да. В заявке можно описать несколько связанных бытовых задач, чтобы решить их в одном запросе.",
  },
];

export default function HomePage() {
  return (
    <main className="bg-[#F6F1E8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">AzurSysTech</p>
          <h1 className="mt-4 max-w-3xl font-serif text-3xl text-[#1F2A37] sm:text-4xl">
            Спокойная и понятная IT-помощь для дома в Nice и рядом
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#1F2A37]/90">
            Страница для частных и домашних пользователей: диагностика ПК, новый компьютер,
            Wi‑Fi, принтер, установка программ и перенос данных без сложной технической подачи.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white hover:bg-[#185A61]"
            >
              Оставить заявку
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
            >
              Описать проблему
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Типичные задачи домашних пользователей</h2>
          <ul className="mt-5 grid gap-3 text-[#1F2A37]/90 sm:grid-cols-2">
            {HOME_PROBLEMS.map((problem) => (
              <li key={problem} className="rounded-lg border border-[#D8D0C4] p-4">
                {problem}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Основные услуги для дома</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {MAIN_SERVICES.map((service) => (
              <article key={service.title} className="rounded-xl border border-[#D8D0C4] p-5">
                <h3 className="text-lg font-semibold text-[#1F2A37]">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#1F2A37]/90">{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Цены от</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {PRICES_FROM.map((item) => (
              <article key={item.service} className="flex items-center justify-between rounded-lg border border-[#D8D0C4] p-4">
                <h3 className="text-sm font-medium text-[#1F2A37]">{item.service}</h3>
                <p className="text-sm font-semibold text-[#1F6F78]">{item.price}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#1F2A37]/75">Итоговая стоимость зависит от объёма задачи.</p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Как запросить помощь</h2>
          <ol className="mt-5 grid gap-3 text-[#1F2A37]/90 sm:grid-cols-2">
            {REQUEST_HELP_STEPS.map((step, index) => (
              <li key={step} className="rounded-lg border border-[#D8D0C4] p-4">
                <span className="font-semibold text-[#1F2A37]">{index + 1}.</span> {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">FAQ для домашних пользователей</h2>
          <div className="mt-5 grid gap-4">
            {HOME_FAQ.map((item) => (
              <article key={item.question} className="rounded-xl border border-[#D8D0C4] p-5">
                <h3 className="font-semibold text-[#1F2A37]">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-[#1F2A37]/90">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Нужна помощь по домашней IT-задаче?</h2>
          <p className="mt-3 max-w-3xl text-[#1F2A37]/90">
            Перейдите на страницу контактов и кратко опишите запрос. Это самый быстрый и понятный
            путь, чтобы начать решение задачи.
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
              Отправить заявку
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
