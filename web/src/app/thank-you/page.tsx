import Link from "next/link";

const CONTACT = {
  phoneDisplay: "+33 7 49 70 54 65",
  phoneHref: "tel:+33749705465",
  whatsappDisplay: "+33 7 49 70 54 65",
  whatsappHref: "https://wa.me/33749705465",
  email: "contact@azursystech.fr",
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[#F6F1E8] px-4 py-8 text-[#1F2A37] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">AzurSysTech</p>
          <h1 className="mt-3 max-w-3xl font-serif text-3xl leading-tight sm:text-4xl">Спасибо, заявку получили</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#1F2A37]/90">
            Мы получили ваше обращение и вернёмся к вам, чтобы уточнить детали и согласовать следующий шаг по задаче.
          </p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <h2 className="font-serif text-2xl">Что дальше</h2>
          <ul className="mt-4 grid gap-3 text-sm leading-6 text-[#1F2A37]/90 sm:text-base">
            <li className="rounded-xl border border-[#D8D0C4] bg-[#FFFDFC] px-4 py-3">
              1. Проверяем описание задачи и контактные данные из заявки.
            </li>
            <li className="rounded-xl border border-[#D8D0C4] bg-[#FFFDFC] px-4 py-3">
              2. При необходимости уточняем несколько деталей по удобному каналу связи.
            </li>
            <li className="rounded-xl border border-[#D8D0C4] bg-[#FFFDFC] px-4 py-3">
              3. После уточнения переходим к безопасному и понятному следующему шагу.
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <h2 className="font-serif text-2xl">Если вопрос срочный</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#1F2A37]/90">
            Можно дополнительно связаться напрямую через WhatsApp или по телефону. Это помогает быстрее уточнить детали по
            срочным обращениям.
          </p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <h2 className="font-serif text-2xl">Резервные способы связи</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#1F2A37]/90">
            Если нужно дополнить заявку или сменить канал общения, используйте любой вариант ниже.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="/contact"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-4 py-3 text-sm font-semibold text-[#1F2A37] transition hover:bg-[#F6F1E8]"
            >
              Перейти на страницу контактов
            </Link>
            <a
              href={CONTACT.phoneHref}
              className="rounded-lg bg-[#1F6F78] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#185A61]"
            >
              Позвонить: {CONTACT.phoneDisplay}
            </a>
            <a
              href={CONTACT.whatsappHref}
              className="rounded-lg border border-[#C96F4A] bg-[#FFF3EE] px-4 py-3 text-sm font-semibold text-[#8A4A2F] transition hover:bg-[#FBE8DF]"
            >
              WhatsApp: {CONTACT.whatsappDisplay}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-4 py-3 text-sm font-semibold text-[#1F2A37] transition hover:bg-[#F6F1E8]"
            >
              Email: {CONTACT.email}
            </a>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <h2 className="font-serif text-2xl">Полезные маршруты</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#1F2A37]/90">
            Пока ожидаете ответ, можно посмотреть нужный раздел и подготовить дополнительную информацию по задаче.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/services"
              className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#185A61]"
            >
              Услуги
            </Link>
            <Link
              href="/business"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] transition hover:bg-[#F6F1E8]"
            >
              Для бизнеса
            </Link>
            <Link
              href="/home"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] transition hover:bg-[#F6F1E8]"
            >
              Для дома
            </Link>
            <Link
              href="/faq"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] transition hover:bg-[#F6F1E8]"
            >
              FAQ
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
