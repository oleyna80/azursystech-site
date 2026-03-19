import Link from "next/link";

const CONTACT = {
  phoneDisplay: "+33 7 49 70 54 65",
  phoneHref: "tel:+33749705465",
  whatsappDisplay: "+33 7 49 70 54 65",
  whatsappHref: "https://wa.me/33749705465",
  email: "contact@azursystech.fr",
};

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
    answer: "Да, это предпочтительный формат для первичной оценки.",
  },
  {
    question: "Вы настраиваете Wi-Fi и принтеры?",
    answer: "Да, это одна из самых частых практических задач.",
  },
];

export default function HomePage() {
  return (
    <main className="bg-[#F6F1E8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">AzurSysTech</p>
          <h1 className="mt-4 max-w-4xl font-serif text-3xl text-[#1F2A37] sm:text-4xl">
            IT-поддержка и настройка инфраструктуры для малого бизнеса в Nice и рядом
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-[#1F2A37]/90">
            Настройка рабочих станций, Wi-Fi, локальной сети, принтеров и общих папок. Работаем с
            TPE и частными клиентами в зоне Nice + 30 км.
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
              Обсудить задачу
            </Link>
            <a
              href={CONTACT.whatsappHref}
              className="rounded-lg border border-[#C96F4A] bg-[#FFF3EE] px-5 py-3 text-sm font-semibold text-[#8A4A2F] hover:bg-[#FBE8DF]"
            >
              Написать в WhatsApp
            </a>
            <Link
              href="#chat-entry"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
            >
              Открыть чат
            </Link>
          </div>
          <p className="mt-4 text-sm text-[#1F2A37]/75">
            Для малого бизнеса, магазинов, кабинетов и частных клиентов в зоне Nice + 30 км.
          </p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">
            Помогаем малому бизнесу быстро наладить IT-среду
          </h2>
          <p className="mt-3 max-w-4xl text-[#1F2A37]/90">
            Для небольших офисов, магазинов, кабинетов и TPE: рабочие места, сеть, Wi-Fi,
            принтеры и базовая организация IT без лишней сложности.
          </p>
          <ul className="mt-5 grid gap-3 text-[#1F2A37]/90 sm:grid-cols-2">
            <li className="rounded-lg border border-[#D8D0C4] p-3">Настройка рабочих мест</li>
            <li className="rounded-lg border border-[#D8D0C4] p-3">Wi-Fi и локальная сеть</li>
            <li className="rounded-lg border border-[#D8D0C4] p-3">Принтеры и общие папки</li>
            <li className="rounded-lg border border-[#D8D0C4] p-3">Выездная помощь на месте</li>
          </ul>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-block rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white hover:bg-[#185A61]"
            >
              Оставить заявку для бизнеса
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Услуги AzurSysTech</h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-[#D8D0C4] p-5">
              <h3 className="text-lg font-semibold text-[#1F2A37]">Для малого бизнеса</h3>
              <ul className="mt-3 space-y-2 text-[#1F2A37]/90">
                <li>• Рабочие станции и подключение устройств</li>
                <li>• Локальная сеть и стабильный Wi-Fi</li>
                <li>• Принтеры и доступ к файлам</li>
                <li>• Практичная выездная IT-помощь</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[#D8D0C4] p-5">
              <h3 className="text-lg font-semibold text-[#1F2A37]">Для частных клиентов</h3>
              <ul className="mt-3 space-y-2 text-[#1F2A37]/90">
                <li>• Настройка и диагностика ПК</li>
                <li>• Подготовка нового компьютера</li>
                <li>• Домашний Wi-Fi и принтер</li>
                <li>• Оптимизация и обновление системы</li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-block rounded-lg border border-[#D8D0C4] px-5 py-3 text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
            >
              Подобрать услугу через контакт
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Почему AzurSysTech</h2>
          <ul className="mt-5 grid gap-3 text-[#1F2A37]/90 sm:grid-cols-2">
            <li className="rounded-lg border border-[#D8D0C4] p-3">Локальный выезд: Nice + 30 км</li>
            <li className="rounded-lg border border-[#D8D0C4] p-3">Поддержка бизнеса и дома</li>
            <li className="rounded-lg border border-[#D8D0C4] p-3">ПК, сеть, Wi-Fi, принтеры, рабочие места</li>
            <li className="rounded-lg border border-[#D8D0C4] p-3">Понятная коммуникация и практичный результат</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Как проходит работа</h2>
          <ol className="mt-5 grid gap-3 text-[#1F2A37]/90 sm:grid-cols-2 lg:grid-cols-5">
            <li className="rounded-lg border border-[#D8D0C4] p-3">1. Вы оставляете заявку</li>
            <li className="rounded-lg border border-[#D8D0C4] p-3">2. Уточняем задачу</li>
            <li className="rounded-lg border border-[#D8D0C4] p-3">3. Определяем формат работ</li>
            <li className="rounded-lg border border-[#D8D0C4] p-3">4. Выполняем настройку / ремонт</li>
            <li className="rounded-lg border border-[#D8D0C4] p-3">5. Даём понятный результат</li>
          </ol>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Помогаем и частным клиентам</h2>
          <p className="mt-3 max-w-4xl text-[#1F2A37]/90">
            Настройка нового ПК, устранение типовых проблем, домашний Wi-Fi и принтер — отдельный
            блок услуг для дома с тем же простым и понятным подходом.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-block rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white hover:bg-[#185A61]"
            >
              Оставить заявку для дома
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Цены от</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-lg border border-[#D8D0C4] p-4">
              <h3 className="font-semibold text-[#1F2A37]">Выездная помощь</h3>
              <p className="mt-2 text-[#1F6F78]">от 50 €</p>
            </article>
            <article className="rounded-lg border border-[#D8D0C4] p-4">
              <h3 className="font-semibold text-[#1F2A37]">Новый ПК</h3>
              <p className="mt-2 text-[#1F6F78]">от 80 €</p>
            </article>
            <article className="rounded-lg border border-[#D8D0C4] p-4">
              <h3 className="font-semibold text-[#1F2A37]">Wi-Fi / принтер</h3>
              <p className="mt-2 text-[#1F6F78]">от 70 €</p>
            </article>
            <article className="rounded-lg border border-[#D8D0C4] p-4">
              <h3 className="font-semibold text-[#1F2A37]">Рабочее место TPE</h3>
              <p className="mt-2 text-[#1F6F78]">от 90 € / по запросу</p>
            </article>
          </div>
          <p className="mt-4 text-sm text-[#1F2A37]/75">
            Точная стоимость зависит от объёма задачи и уточняется после короткого описания.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-block rounded-lg border border-[#D8D0C4] px-5 py-3 text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
            >
              Запросить оценку
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">FAQ (предпросмотр)</h2>
          <div className="mt-5 space-y-3">
            {FAQ_PREVIEW.map((item) => (
              <article key={item.question} className="rounded-lg border border-[#D8D0C4] p-4">
                <h3 className="font-semibold text-[#1F2A37]">{item.question}</h3>
                <p className="mt-2 text-[#1F2A37]/90">{item.answer}</p>
              </article>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-block rounded-lg border border-[#D8D0C4] px-5 py-3 text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
            >
              Задать вопрос через контакт
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Связаться с AzurSysTech</h2>
          <p className="mt-3 max-w-4xl text-[#1F2A37]/90">
            Выберите удобный канал: телефон, WhatsApp или форма. Для надежной отправки заявки
            используйте страницу контактов.
          </p>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <section className="rounded-xl border border-[#D8D0C4] p-5">
              <h3 className="text-lg font-semibold text-[#1F2A37]">Контакты</h3>
              <ul className="mt-4 grid gap-3 text-[#1F2A37]/90">
                <li className="rounded-lg border border-[#D8D0C4] p-3">
                  Телефон: {" "}
                  <a className="font-medium text-[#1F6F78] underline" href={CONTACT.phoneHref}>
                    {CONTACT.phoneDisplay}
                  </a>
                </li>
                <li className="rounded-lg border border-[#D8D0C4] p-3">
                  WhatsApp: {" "}
                  <a className="font-medium text-[#8A4A2F] underline" href={CONTACT.whatsappHref}>
                    {CONTACT.whatsappDisplay}
                  </a>
                </li>
                <li className="rounded-lg border border-[#D8D0C4] p-3">
                  Email: {" "}
                  <a className="font-medium text-[#1F6F78] underline" href={`mailto:${CONTACT.email}`}>
                    {CONTACT.email}
                  </a>
                </li>
              </ul>
            </section>

            <section className="rounded-xl border border-[#D8D0C4] p-5">
              <h3 className="text-lg font-semibold text-[#1F2A37]">Короткая заявка</h3>
              <p className="mt-2 text-sm text-[#1F2A37]/90">
                Заполните основные поля и перейдите к полной форме на странице контактов.
              </p>
              <form className="mt-4 grid gap-3">
                <label className="grid gap-1">
                  <span className="text-sm font-medium text-[#1F2A37]">Имя</span>
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2"
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-sm font-medium text-[#1F2A37]">Телефон</span>
                  <input
                    type="tel"
                    placeholder="Телефон для связи"
                    className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2"
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-sm font-medium text-[#1F2A37]">Краткое описание</span>
                  <textarea
                    placeholder="Что нужно сделать"
                    className="min-h-24 rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2"
                  />
                </label>
                <p className="text-sm text-[#1F2A37]/75">
                  Отправка с главной страницы пока недоступна. Используйте полную форму или
                  WhatsApp.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white hover:bg-[#185A61]"
                  >
                    Перейти к полной форме
                  </Link>
                  <a
                    href={CONTACT.whatsappHref}
                    className="rounded-lg border border-[#C96F4A] bg-[#FFF3EE] px-5 py-3 text-sm font-semibold text-[#8A4A2F] hover:bg-[#FBE8DF]"
                  >
                    Написать в WhatsApp
                  </a>
                </div>
              </form>
            </section>
          </div>
        </section>

        <section id="chat-entry" className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Чат-помощник</h2>
          <p className="mt-3 max-w-4xl text-[#1F2A37]/90">
            Не знаете, как лучше описать задачу? Чат поможет собрать первичную информацию и
            направит к следующему шагу.
          </p>
          <ul className="mt-5 grid gap-3 text-[#1F2A37]/90 sm:grid-cols-2">
            <li className="rounded-lg border border-[#D8D0C4] p-3">Уточняет, это запрос для бизнеса или дома</li>
            <li className="rounded-lg border border-[#D8D0C4] p-3">Помогает сформулировать проблему простыми словами</li>
            <li className="rounded-lg border border-[#D8D0C4] p-3">Собирает базовые детали по устройствам</li>
            <li className="rounded-lg border border-[#D8D0C4] p-3">Переводит к форме или WhatsApp для продолжения</li>
          </ul>
          <p className="mt-4 text-sm text-[#1F2A37]/75">
            На запуске блок работает как входная точка для обращения. Финальное подтверждение
            деталей выполняется через человека.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <p className="rounded-lg border border-[#D8D0C4] bg-[#F6F1E8] px-5 py-3 text-sm font-semibold text-[#1F2A37]/80">
              Чат доступен через кнопку «Чат-помощник» внизу экрана
            </p>
            <a
              href={CONTACT.whatsappHref}
              className="rounded-lg border border-[#C96F4A] bg-[#FFF3EE] px-5 py-3 text-sm font-semibold text-[#8A4A2F] hover:bg-[#FBE8DF]"
            >
              Написать в WhatsApp
            </a>
            <Link
              href="/contact"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
            >
              Оставить заявку
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
