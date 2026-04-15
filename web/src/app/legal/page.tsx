import Link from "next/link";
import { LEGAL_BUSINESS, LEGAL_CONTACT, LEGAL_HOSTING } from "@/lib/legal-content";

export default function LegalPage() {
  return (
    <main className="bg-[#F6F1E8] px-6 py-12 text-[#1F2A37]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">AzurSysTech</p>
          <div className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
            <h1 className="font-serif text-3xl sm:text-4xl">Правовая информация</h1>
            <p className="text-base leading-7 text-[#1F2A37]/90">
              Эта страница содержит обязательные сведения о сайте AzurSysTech и его владельце в соответствии с
              применимым правом Франции.
            </p>
          </div>
        </header>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">1. Идентификация сайта</h2>
          <dl className="grid gap-3 text-[#1F2A37]/90">
            <div>
              <dt className="text-sm text-[#1F2A37]/70">Домен</dt>
              <dd className="font-medium">azursystech.fr</dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">Публичный бренд</dt>
              <dd className="font-medium">AzurSysTech</dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">Назначение сайта</dt>
              <dd>
                Информирование об IT-услугах и приём обращений через форму сайта, телефон, WhatsApp и email.
              </dd>
            </div>
          </dl>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">2. Владелец сайта</h2>
          <dl className="grid gap-3 text-[#1F2A37]/90">
            <div>
              <dt className="text-sm text-[#1F2A37]/70">Предприниматель</dt>
              <dd className="font-medium">Dmitrii OLEINIK</dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">Статус</dt>
              <dd>Entrepreneur individuel (micro-entrepreneur)</dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">SIREN</dt>
              <dd>940 870 140</dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">SIRET</dt>
              <dd>940 870 140 00016</dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">Код APE / NAF</dt>
              <dd>6201Z — Programmation informatique</dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">Профессиональный адрес</dt>
              <dd>9 AV EMMANUEL BRIDAULT, 06000 NICE, France</dd>
            </div>
          </dl>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">3. Контактные данные</h2>
          <ul className="grid gap-3 text-[#1F2A37]/90">
            <li>
              Email: <a className="font-medium text-[#1F6F78] underline" href={`mailto:${LEGAL_CONTACT.email}`}>{LEGAL_CONTACT.email}</a>
            </li>
            <li>
              Телефон: <a className="font-medium text-[#1F6F78] underline" href={LEGAL_CONTACT.phoneHref}>{LEGAL_CONTACT.phoneDisplay}</a>
            </li>
            <li>
              WhatsApp: <a className="font-medium text-[#8A4A2F] underline" href={LEGAL_CONTACT.whatsappHref}>{LEGAL_CONTACT.whatsappDisplay}</a>
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">4. Ответственный за публикацию</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Ответственный за публикацию материалов сайта: Dmitrii OLEINIK. Все материалы сайта публикуются от имени
            бренда AzurSysTech.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">5. Хостинг</h2>
          <dl className="grid gap-3 text-[#1F2A37]/90">
            <div>
              <dt className="text-sm text-[#1F2A37]/70">Провайдер</dt>
              <dd className="font-medium">{LEGAL_HOSTING.provider}</dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">Адрес провайдера</dt>
              <dd>{LEGAL_HOSTING.address}</dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">Сайт провайдера</dt>
              <dd>
                <a className="font-medium text-[#1F6F78] underline" href={LEGAL_HOSTING.website}>
                  {LEGAL_HOSTING.website}
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">6. Интеллектуальная собственность</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Все тексты, структура сайта, визуальные элементы, логотип, графика и иные материалы, размещённые на
            сайте AzurSysTech, защищены применимым законодательством об интеллектуальной собственности. Любое
            копирование, воспроизведение, распространение или использование материалов сайта без предварительного
            разрешения запрещено, кроме случаев, прямо допускаемых законом.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">7. Ограничение ответственности</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            AzurSysTech стремится размещать на сайте точную и актуальную информацию. Однако сведения, размещённые
            на сайте, предоставляются исключительно в информационных целях и могут изменяться. Владелец сайта не
            несёт ответственности за прямые или косвенные последствия использования информации сайта без
            дополнительного подтверждения, если иное не предусмотрено обязательными нормами закона.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">8. Внешние ссылки</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Сайт может содержать ссылки на внешние ресурсы. AzurSysTech не несёт ответственности за содержание
            внешних сайтов, доступных по этим ссылкам.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-serif text-2xl">9. Применимое право</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Сайт и его содержание регулируются применимым правом Франции.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-serif text-2xl">10. Защита персональных данных</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Подробная информация о сборе, использовании и защите персональных данных опубликована на странице{" "}
            <Link className="font-medium text-[#1F6F78] underline" href="/privacy">
              политики конфиденциальности
            </Link>
            .
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-serif text-2xl">11. Дополнительная информация</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Если отдельные обязательные сведения подлежат уточнению или обновлению в силу изменений законодательства,
            административных данных или технической инфраструктуры сайта, соответствующая информация будет обновлена
            на этой странице.
          </p>
        </section>
      </div>
    </main>
  );
}
