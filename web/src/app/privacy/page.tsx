import Link from "next/link";
import { LEGAL_CONTACT } from "@/lib/legal-content";

export default function PrivacyPage() {
  return (
    <main className="bg-[#F6F1E8] px-6 py-12 text-[#1F2A37]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">AzurSysTech</p>
          <div className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
            <h1 className="font-serif text-3xl sm:text-4xl">Политика конфиденциальности</h1>
            <p className="text-base leading-7 text-[#1F2A37]/90">
              AzurSysTech уважает конфиденциальность пользователей сайта и обрабатывает персональные данные в
              соответствии с применимым законодательством, включая Регламент (ЕС) 2016/679 (RGPD) и французское
              право о защите персональных данных.
            </p>
          </div>
        </header>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">1. Кто отвечает за обработку данных</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Ответственным за обработку данных является AzurSysTech. Контактные данные ответственного лица и
            правовая информация указаны на странице правовой информации сайта.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">2. Какие данные могут собираться</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            В зависимости от способа обращения AzurSysTech может собирать следующие данные:
          </p>
          <ul className="grid gap-2 text-[#1F2A37]/90">
            <li>• имя</li>
            <li>• номер телефона</li>
            <li>• адрес электронной почты</li>
            <li>• город</li>
            <li>• тип обращения (частный клиент / бизнес)</li>
            <li>• описание задачи</li>
            <li>• количество устройств</li>
            <li>• иные сведения, которые пользователь сам передаёт через форму, чат, email, телефон или WhatsApp</li>
          </ul>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">3. Для чего собираются данные</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Данные используются для следующих целей:
          </p>
          <ul className="grid gap-2 text-[#1F2A37]/90">
            <li>• обработки входящего обращения</li>
            <li>• связи с пользователем</li>
            <li>• уточнения задачи</li>
            <li>• организации выезда или дальнейшего взаимодействия</li>
            <li>• подготовки коммерческого ответа или сопровождения заявки</li>
            <li>• ведения истории обращений</li>
            <li>• улучшения организации обработки запросов</li>
          </ul>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">4. Правовая основа обработки</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Обработка осуществляется на основании:
          </p>
          <ul className="grid gap-2 text-[#1F2A37]/90">
            <li>• мер, необходимых до заключения договора по запросу пользователя</li>
            <li>• исполнения договора, если пользователь становится клиентом</li>
            <li>• законного интереса AzurSysTech в организации и сопровождении обращений</li>
            <li>• а в соответствующих случаях — выполнения законных обязательств</li>
          </ul>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">5. Получатели данных и внешние сервисы</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Доступ к данным могут иметь только лица и сервисы, которым это необходимо для обработки обращения
            и работы сайта, в частности:
          </p>
          <ul className="grid gap-2 text-[#1F2A37]/90">
            <li>• хостинг-провайдер сайта</li>
            <li>• средства связи (email, телефон, WhatsApp)</li>
            <li>• сервисы обработки заявок и внутреннего учёта</li>
            <li>• CRM-инструменты, если они фактически используются</li>
            <li>• инструменты аналитики сайта, если они фактически включены</li>
          </ul>
          <p className="leading-7 text-[#1F2A37]/90">
            AzurSysTech не раскрывает персональные данные третьим лицам вне этих целей, кроме случаев,
            предусмотренных законом или необходимых для оказания услуги.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">6. Срок хранения данных</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Персональные данные хранятся не дольше, чем это необходимо для целей, ради которых они были
            собраны, с учётом:
          </p>
          <ul className="grid gap-2 text-[#1F2A37]/90">
            <li>• обработки обращения</li>
            <li>• последующей коммуникации с клиентом</li>
            <li>• исполнения договорных и бухгалтерских обязательств</li>
            <li>• выполнения обязательных сроков хранения, установленных законом</li>
          </ul>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">7. Права пользователя</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Пользователь имеет право:
          </p>
          <ul className="grid gap-2 text-[#1F2A37]/90">
            <li>• запросить доступ к своим данным</li>
            <li>• потребовать исправления неточных данных</li>
            <li>• запросить удаление данных в случаях, предусмотренных законом</li>
            <li>• ограничить обработку</li>
            <li>• возразить против обработки в предусмотренных случаях</li>
            <li>• определить инструкции по обращению с данными после смерти в случаях, предусмотренных французским правом</li>
          </ul>
          <p className="leading-7 text-[#1F2A37]/90">
            Пользователь также может подать жалобу в CNIL, если считает, что его права нарушены.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">8. Контакт по вопросам данных</h2>
          <ul className="grid gap-2 text-[#1F2A37]/90">
            <li>
              Email: <a className="font-medium text-[#1F6F78] underline" href={`mailto:${LEGAL_CONTACT.email}`}>{LEGAL_CONTACT.email}</a>
            </li>
            <li>
              Телефон / WhatsApp: <a className="font-medium text-[#8A4A2F] underline" href={LEGAL_CONTACT.whatsappHref}>{LEGAL_CONTACT.whatsappDisplay}</a>
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">9. Аналитика сайта</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Сайт может использовать инструменты измерения аудитории и технической аналитики для понимания
            посещаемости, структуры использования сайта и улучшения его работы. Если такие инструменты
            фактически используются, они настраиваются и применяются в соответствии с применимыми правилами.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">Cookies и согласие</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Аналитические cookies и инструменты измерения аудитории активируются только после явного согласия
            пользователя. До момента согласия такие инструменты не загружаются, а сайт продолжает работать
            без ограничений.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">10. Формы и чат</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Данные, переданные через форму сайта или чат-помощник, используются только для обработки обращения,
            подготовки ответа и передачи заявки в рабочую систему AzurSysTech. Чат-помощник служит для первичного
            intake и не предоставляет окончательных коммерческих, юридических или календарных обязательств.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-serif text-2xl">11. Связанная правовая информация</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Дополнительная информация о владельце сайта, хостинге и контактных данных доступна на странице{" "}
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
