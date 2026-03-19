import Link from "next/link";
import { LEGAL_BUSINESS, LEGAL_CONTACT, LEGAL_HOSTING } from "@/lib/legal-content";

export default function LegalPage() {
  return (
    <main className="bg-[#F6F1E8] px-6 py-12 text-[#1F2A37]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">AzurSysTech</p>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl">Правовая информация</h1>
          <p className="mt-4 text-base leading-7 text-[#1F2A37]/90">
            Эта страница содержит обязательные юридические сведения о сайте и владельце сервиса AzurSysTech.
          </p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Идентификация сайта</h2>
          <dl className="mt-4 grid gap-3 text-[#1F2A37]/90">
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
                Информирование об IT-услугах и прием обращений через форму, телефон, WhatsApp и email.
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Информация о владельце сайта</h2>
          <dl className="mt-4 grid gap-3 text-[#1F2A37]/90">
            <div>
              <dt className="text-sm text-[#1F2A37]/70">ФИО / название бизнеса</dt>
              <dd className="font-medium">{LEGAL_BUSINESS.owner}</dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">Статус</dt>
              <dd>{LEGAL_BUSINESS.status}</dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">SIREN / SIRET</dt>
              <dd>{LEGAL_BUSINESS.registration}</dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">Профессиональный адрес</dt>
              <dd>{LEGAL_BUSINESS.address}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Контактные данные</h2>
          <ul className="mt-4 grid gap-3 text-[#1F2A37]/90">
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

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Ответственный за публикацию</h2>
          <p className="mt-4 leading-7 text-[#1F2A37]/90">
            Ответственный за публикацию материалов сайта: {LEGAL_BUSINESS.owner}. Все публикации размещаются от имени
            AzurSysTech.
          </p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Хостинг</h2>
          <dl className="mt-4 grid gap-3 text-[#1F2A37]/90">
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

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Интеллектуальная собственность</h2>
          <p className="mt-4 leading-7 text-[#1F2A37]/90">
            Все тексты, структура сайта, визуальные элементы, логотип, графика и иные материалы сайта AzurSysTech
            защищены в рамках применимого права. Любое копирование, воспроизведение или использование материалов
            без предварительного разрешения запрещено, кроме случаев, прямо допускаемых законом.
          </p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Ограничение ответственности</h2>
          <p className="mt-4 leading-7 text-[#1F2A37]/90">
            AzurSysTech стремится предоставлять актуальную и точную информацию на сайте. Однако информация
            размещается в ознакомительных целях и может обновляться. Владелец сайта не несёт ответственности за
            прямые или косвенные последствия использования информации сайта без дополнительного подтверждения,
            если иное не предусмотрено законом.
          </p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Внешние ссылки</h2>
          <p className="mt-4 leading-7 text-[#1F2A37]/90">
            Сайт может содержать ссылки на внешние ресурсы. AzurSysTech не несёт ответственности за содержание
            внешних сайтов, доступных по этим ссылкам.
          </p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Применимое право и служебная информация</h2>
          <p className="mt-4 leading-7 text-[#1F2A37]/90">
            Сайт регулируется применимым правом Франции. Использование сайта означает согласие пользователя с
            действующей структурой правовой информации и политикой конфиденциальности.
          </p>
          <p className="mt-4 text-[#1F2A37]/90">
            Подробности по обработке данных опубликованы на странице{" "}
            <Link className="font-medium text-[#1F6F78] underline" href="/privacy">
              политики конфиденциальности
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
