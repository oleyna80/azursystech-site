import Link from "next/link";
import { LEGAL_CONTACT, PRIVACY_TOOLS } from "@/lib/legal-content";

export default function PrivacyPage() {
  return (
    <main className="bg-[#F6F1E8] px-6 py-12 text-[#1F2A37]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">AzurSysTech</p>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl">Политика конфиденциальности</h1>
          <p className="mt-4 text-base leading-7 text-[#1F2A37]/90">
            AzurSysTech уважает конфиденциальность пользователей сайта. Ниже описано, какие данные могут
            собираться через сайт, форму заявки и чат, и как они используются для связи по запросу и
            организации работы сервиса.
          </p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Какие данные могут собираться</h2>
          <ul className="mt-4 grid gap-2 text-[#1F2A37]/90">
            <li>• имя</li>
            <li>• телефон</li>
            <li>• email</li>
            <li>• город</li>
            <li>• тип обращения (частный клиент / бизнес)</li>
            <li>• описание задачи</li>
            <li>• количество устройств</li>
            <li>• данные, которые пользователь сам сообщает через форму или чат</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Через какие каналы собираются данные</h2>
          <ul className="mt-4 grid gap-2 text-[#1F2A37]/90">
            <li>• форма на сайте</li>
            <li>• чат-помощник</li>
            <li>• контактные кнопки (телефон / WhatsApp)</li>
            <li>• технические инструменты аналитики сайта</li>
            <li>• рабочая система приема обращений</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Для чего собираются данные</h2>
          <ul className="mt-4 grid gap-2 text-[#1F2A37]/90">
            <li>• ответ на заявку</li>
            <li>• уточнение задачи</li>
            <li>• организация выезда</li>
            <li>• подготовка дальнейшего контакта</li>
            <li>• ведение заявок и истории общения</li>
            <li>• улучшение качества обработки обращений</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Основание обработки</h2>
          <p className="mt-4 leading-7 text-[#1F2A37]/90">
            Данные обрабатываются в объеме, необходимом для ответа на запрос пользователя, организации связи,
            ведения заявки и выполнения услуг AzurSysTech, в пределах, допустимых применимым правом.
          </p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Как используются данные</h2>
          <p className="mt-4 leading-7 text-[#1F2A37]/90">
            Данные из формы и чата используются для первичной квалификации обращения, связи с пользователем,
            оценки формата работ и ведения заявки в рабочей системе AzurSysTech.
          </p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Срок хранения данных</h2>
          <p className="mt-4 leading-7 text-[#1F2A37]/90">
            Данные хранятся столько, сколько это необходимо для обработки обращения, дальнейшей коммуникации,
            выполнения услуг и соблюдения применимых требований по хранению информации.
          </p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Используемые инструменты</h2>
          <p className="mt-4 leading-7 text-[#1F2A37]/90">
            Для обработки заявок и анализа работы сайта могут использоваться сторонние инструменты.
          </p>
          <ul className="mt-4 grid gap-2 text-[#1F2A37]/90">
            {PRIVACY_TOOLS.map((tool) => (
              <li key={tool}>• {tool}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Ваши права</h2>
          <p className="mt-4 leading-7 text-[#1F2A37]/90">
            Пользователь может запросить уточнение по своим данным, а также обратиться по вопросам,
            связанным с обработкой персональной информации, через контактные данные, указанные на сайте.
          </p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Контакт по вопросам данных</h2>
          <ul className="mt-4 grid gap-3 text-[#1F2A37]/90">
            <li>
              Email: <a className="font-medium text-[#1F6F78] underline" href={`mailto:${LEGAL_CONTACT.email}`}>{LEGAL_CONTACT.email}</a>
            </li>
            <li>
              WhatsApp: <a className="font-medium text-[#8A4A2F] underline" href={LEGAL_CONTACT.whatsappHref}>{LEGAL_CONTACT.whatsappDisplay}</a>
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Аналитика сайта</h2>
          <p className="mt-4 leading-7 text-[#1F2A37]/90">
            Сайт может использовать инструменты аналитики для понимания того, какие страницы посещают
            пользователи и какие действия совершаются на сайте. Такие данные используются в агрегированном
            виде для улучшения структуры сайта и качества сервиса.
          </p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Чат-помощник</h2>
          <p className="mt-4 leading-7 text-[#1F2A37]/90">
            Если пользователь взаимодействует с чат-помощником, переданная информация может использоваться
            для подготовки краткого описания обращения и последующей связи по заявке. Чат не является
            самостоятельным механизмом заключения сделки и не дает окончательных ценовых или юридических
            обещаний.
          </p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Формы заявки</h2>
          <p className="mt-4 leading-7 text-[#1F2A37]/90">
            При отправке формы пользователь передает только те данные, которые необходимы для связи,
            первичной оценки задачи и организации дальнейшего взаимодействия.
          </p>
          <p className="mt-4 text-[#1F2A37]/90">
            Связанная правовая информация опубликована на странице{" "}
            <Link className="font-medium text-[#1F6F78] underline" href="/legal">
              правовой информации
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
