"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { getSubmitFallbackMessage, type ContactSubmitApiResult } from "@/lib/contact-submit";

type Segment = "particulier" | "tpe";

const CONTACT = {
  phoneDisplay: "+33 7 80 72 09 94",
  phoneHref: "tel:+33780720994",
  whatsappDisplay: "+33 7 80 72 09 94",
  whatsappHref: "https://wa.me/33780720994",
  email: "contact@azursystech.fr",
};

const SERVICE_OPTIONS = [
  { value: "depannage_pc", label: "Ремонт / диагностика ПК" },
  { value: "installation_pc", label: "Настройка нового ПК" },
  { value: "wifi", label: "Настройка Wi-Fi" },
  { value: "imprimante", label: "Настройка принтера" },
  { value: "reseau_local", label: "Локальная сеть" },
  { value: "partage_fichiers", label: "Общие папки / доступ к файлам" },
  { value: "poste_travail", label: "Рабочее место / несколько устройств" },
  { value: "petite_infra_tpe", label: "Настройка IT-среды для малого бизнеса" },
  { value: "autre", label: "Другое" },
];

export default function ContactPage() {
  const router = useRouter();
  const [segment, setSegment] = useState<Segment | "">("");
  const [submitNotice, setSubmitNotice] = useState("");
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setSubmitNotice("");
    setFieldErrors([]);

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        body: formData,
      });

      let result: ContactSubmitApiResult | null = null;

      try {
        result = (await response.json()) as ContactSubmitApiResult;
      } catch {
        result = null;
      }

      if (result?.status === "success") {
        form.reset();
        setSegment("");
        router.push("/thank-you");
        return;
      }

      if (result?.status === "validation_error") {
        setSubmitNotice(result.userMessage);
        setFieldErrors(result.issues.map((issue) => issue.message));
        return;
      }

      if (
        result?.status === "integration_not_ready" ||
        result?.status === "submit_failed" ||
        result?.status === "spam_detected"
      ) {
        setSubmitNotice(result.userMessage);
        return;
      }

      if (!response.ok) {
        setSubmitNotice(getSubmitFallbackMessage());
        return;
      }

      setSubmitNotice(getSubmitFallbackMessage());
    } catch {
      setSubmitNotice(getSubmitFallbackMessage());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F1E8] px-4 py-8 text-[#1F2A37] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">
            AzurSysTech
          </p>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl">Контакты и заявка</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#1F2A37]/90">
            Опишите задачу через форму или свяжитесь напрямую. Каналы связи: телефон,
            WhatsApp и email.
          </p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Методы связи</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            <li className="rounded-xl border border-[#D8D0C4] p-4">
              <p className="text-sm text-[#1F2A37]/70">Телефон</p>
              <a className="mt-2 inline-block font-medium text-[#1F6F78] underline" href={CONTACT.phoneHref}>
                {CONTACT.phoneDisplay}
              </a>
            </li>
            <li className="rounded-xl border border-[#D8D0C4] p-4">
              <p className="text-sm text-[#1F2A37]/70">WhatsApp</p>
              <a className="mt-2 inline-block font-medium text-[#8A4A2F] underline" href={CONTACT.whatsappHref}>
                {CONTACT.whatsappDisplay}
              </a>
            </li>
            <li className="rounded-xl border border-[#D8D0C4] p-4 sm:col-span-2">
              <p className="text-sm text-[#1F2A37]/70">Email</p>
              <a
                className="mt-2 inline-block font-medium text-[#1F6F78] underline"
                href={`mailto:${CONTACT.email}`}
              >
                {CONTACT.email}
              </a>
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Основная форма заявки</h2>
          <p className="mt-3 text-[#1F2A37]/90">
            Коротко опишите задачу, и мы используем эту информацию для первичной
            квалификации обращения.
          </p>

          <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-10000px",
                top: "auto",
                width: "1px",
                height: "1px",
                overflow: "hidden",
              }}
            >
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" autoComplete="off" tabIndex={-1} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium">Имя *</span>
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="Ваше имя"
                  className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium">Телефон *</span>
                <input
                  required
                  name="phone"
                  type="tel"
                  placeholder="Телефон для связи"
                  className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium">Email</span>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium">Город *</span>
                <input
                  required
                  name="city"
                  type="text"
                  placeholder="Например: Nice"
                  className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2"
                />
              </label>
            </div>

            <fieldset className="grid gap-3 rounded-xl border border-[#D8D0C4] p-4">
              <legend className="px-2 text-sm font-medium">Вы обращаетесь как *</legend>
              <label className="flex items-center gap-2">
                <input
                  required
                  type="radio"
                  name="segment"
                  value="particulier"
                  checked={segment === "particulier"}
                  onChange={() => setSegment("particulier")}
                />
                <span>Частный клиент (particulier)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  required
                  type="radio"
                  name="segment"
                  value="tpe"
                  checked={segment === "tpe"}
                  onChange={() => setSegment("tpe")}
                />
                <span>Бизнес / TPE (tpe)</span>
              </label>
            </fieldset>

            <label className="grid gap-2">
              <span className="text-sm font-medium">Что нужно сделать *</span>
              <select
                required
                name="service_type"
                defaultValue=""
                className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2"
              >
                <option value="" disabled>
                  Выберите услугу
                </option>
                {SERVICE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium">Краткое описание задачи *</span>
              <textarea
                required
                name="problem_description"
                minLength={15}
                maxLength={1500}
                placeholder="Коротко опишите, что нужно сделать или какая проблема возникла"
                className="min-h-32 rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-sm font-medium">Сколько устройств</span>
                <select name="device_count" defaultValue="" className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2">
                  <option value="">Не указано</option>
                  <option value="1">1</option>
                  <option value="2-3">2-3</option>
                  <option value="4-10">4-10</option>
                  <option value="10+">10+</option>
                </select>
              </label>

              <fieldset className="grid gap-2 rounded-lg border border-[#D8D0C4] p-3 sm:col-span-2">
                <legend className="px-1 text-sm font-medium">Нужен выезд</legend>
                <label className="flex items-center gap-2">
                  <input type="radio" name="onsite_required" value="yes" />
                  <span>Да</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="onsite_required" value="no" />
                  <span>Нет</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="onsite_required" value="not_sure" />
                  <span>Не знаю</span>
                </label>
              </fieldset>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-medium">Срочность</span>
              <select name="urgency" defaultValue="" className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2">
                <option value="">Не указано</option>
                <option value="urgent">Срочно</option>
                <option value="standard">Обычный запрос</option>
                <option value="planning">Можно запланировать</option>
              </select>
            </label>

            {segment === "tpe" ? (
              <fieldset className="grid gap-4 rounded-xl border border-[#D8D0C4] p-4">
                <legend className="px-2 text-sm font-medium">Информация для бизнеса</legend>

                <label className="grid gap-2">
                  <span className="text-sm font-medium">Название компании</span>
                  <input name="company_name" type="text" className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2" />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium">Тип объекта</span>
                    <select name="business_type" defaultValue="" className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2">
                      <option value="">Не указано</option>
                      <option value="office">Офис</option>
                      <option value="shop">Магазин</option>
                      <option value="cabinet">Кабинет</option>
                      <option value="coworking">Рабочее пространство</option>
                      <option value="other">Другое</option>
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium">Сколько рабочих мест</span>
                    <select
                      name="workstation_count"
                      defaultValue=""
                      className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2"
                    >
                      <option value="">Не указано</option>
                      <option value="1">1</option>
                      <option value="2-3">2-3</option>
                      <option value="4-10">4-10</option>
                      <option value="10+">10+</option>
                    </select>
                  </label>
                </div>

                <fieldset className="grid gap-2 rounded-lg border border-[#D8D0C4] p-3">
                  <legend className="px-1 text-sm font-medium">Что из этого нужно</legend>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="business_needs" value="wifi" />
                    <span>Wi-Fi</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="business_needs" value="printers" />
                    <span>Принтеры</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="business_needs" value="local_network" />
                    <span>Локальная сеть</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="business_needs" value="shared_folders" />
                    <span>Общие папки</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="business_needs" value="new_workstations" />
                    <span>Новые рабочие места</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="business_needs" value="onsite_support" />
                    <span>Выездная помощь</span>
                  </label>
                </fieldset>

                <label className="grid gap-2">
                  <span className="text-sm font-medium">Адрес объекта</span>
                  <input name="business_address" type="text" className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2" />
                </label>
              </fieldset>
            ) : null}

            {segment === "particulier" ? (
              <fieldset className="grid gap-4 rounded-xl border border-[#D8D0C4] p-4">
                <legend className="px-2 text-sm font-medium">Информация по задаче</legend>

                <fieldset className="grid gap-2 rounded-lg border border-[#D8D0C4] p-3">
                  <legend className="px-1 text-sm font-medium">Что нужно настроить</legend>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="home_device_type" value="desktop_pc" />
                    <span>Стационарный компьютер</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="home_device_type" value="laptop" />
                    <span>Ноутбук</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="home_device_type" value="wifi" />
                    <span>Wi-Fi</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="home_device_type" value="printer" />
                    <span>Принтер</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="home_device_type" value="multiple_devices" />
                    <span>Несколько устройств</span>
                  </label>
                </fieldset>

                <fieldset className="grid gap-2 rounded-lg border border-[#D8D0C4] p-3">
                  <legend className="px-1 text-sm font-medium">Это новый компьютер или существующий</legend>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="device_state" value="new" />
                    <span>Новый</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="device_state" value="existing" />
                    <span>Уже используемый</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="device_state" value="not_applicable" />
                    <span>Не относится</span>
                  </label>
                </fieldset>

                <fieldset className="grid gap-2 rounded-lg border border-[#D8D0C4] p-3">
                  <legend className="px-1 text-sm font-medium">Что именно нужно</legend>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="home_need_type" value="repair" />
                    <span>Диагностика / ремонт</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="home_need_type" value="setup" />
                    <span>Настройка</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="home_need_type" value="migration" />
                    <span>Перенос данных</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="home_need_type" value="speedup" />
                    <span>Ускорение работы</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="home_need_type" value="installation" />
                    <span>Установка системы / программ</span>
                  </label>
                </fieldset>
              </fieldset>
            ) : null}

            <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              Отправляя заявку, вы соглашаетесь с обработкой данных для связи по вашему
              запросу.
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#1F6F78] px-4 py-3 font-medium text-white hover:bg-[#185A61] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Отправляем..." : "Отправить заявку"}
              </button>
              <p className="text-sm text-[#1F2A37]/75">
                Если форма временно недоступна, используйте телефон, WhatsApp или email из блока
                выше.
              </p>
              {submitNotice ? (
                <p className="text-sm font-medium text-rose-700" role="status" aria-live="polite">
                  {submitNotice}
                </p>
              ) : null}
              {fieldErrors.length > 0 ? (
                <ul className="list-disc pl-5 text-sm text-rose-700" role="status" aria-live="polite">
                  {fieldErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Быстрые действия</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a
              href={CONTACT.whatsappHref}
              className="rounded-lg border border-[#C96F4A] bg-[#FFF3EE] px-4 py-3 text-center font-medium text-[#8A4A2F] hover:bg-[#FBE8DF]"
            >
              WhatsApp: {CONTACT.whatsappDisplay}
            </a>
            <a
              href={CONTACT.phoneHref}
              className="rounded-lg bg-[#1F6F78] px-4 py-3 text-center font-medium text-white hover:bg-[#185A61]"
            >
              Позвонить: {CONTACT.phoneDisplay}
            </a>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Зона обслуживания</h2>
          <p className="mt-3 text-[#1F2A37]/90">
            Работаем в Nice и в зоне до ~30 км. Если вы рядом с этой зоной, укажите город
            в форме — формат работ уточним при контакте.
          </p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">Что ожидать после контакта</h2>
          <p className="mt-3 text-[#1F2A37]/90">
            После получения обращения мы используем данные из формы для первичной
            квалификации и следующего шага. Если вопрос срочный, используйте WhatsApp или
            звонок.
          </p>
        </section>
      </div>
    </main>
  );
}
