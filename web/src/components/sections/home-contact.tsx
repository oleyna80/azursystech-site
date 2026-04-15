"use client";

import { FormEvent, useState } from "react";
import type { ContactSubmitApiResult } from "@/lib/contact-submit";

type Segment = "particulier" | "tpe";
type SubmitState = "" | "submitting" | "success" | "error";

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
  { value: "reseau_local", label: "Wi-Fi / локальная сеть" },
  { value: "imprimante", label: "Принтеры / подключение устройств" },
  { value: "poste_travail", label: "Рабочее место / несколько устройств" },
  { value: "petite_infra_tpe", label: "Автоматизация и ИИ" },
  { value: "partage_fichiers", label: "Общие папки / доступ к файлам" },
  { value: "autre", label: "Другое" },
];

export function HomeContactSection() {
  const [segment, setSegment] = useState<Segment>("tpe");
  const [submitState, setSubmitState] = useState<SubmitState>("");
  const [submitNotice, setSubmitNotice] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitState === "submitting") {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    if (formData.get("website")) {
      return;
    }

    setSubmitState("submitting");
    setSubmitNotice("");
    setFieldErrors([]);

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

      if (response.ok && result?.status === "success") {
        setSubmitState("success");
        setSubmitNotice("");
        form.reset();
        setSegment("tpe");
        return;
      }

      if (result?.status === "validation_error") {
        setSubmitState("error");
        setSubmitNotice(result.userMessage);
        setFieldErrors(result.issues.map((issue) => issue.message));
        return;
      }

      setSubmitState("error");
      setSubmitNotice(result?.userMessage ?? "Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами в WhatsApp.");
    } catch {
      setSubmitState("error");
      setSubmitNotice("Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами в WhatsApp.");
    }
  };

  return (
    <section id="contact" className="relative bg-surface py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid gap-10 rounded-[2rem] bg-base-alt/70 p-6 shadow-premium-soft ring-1 ring-graphite/5 md:p-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14 lg:p-12">
          <div className="lg:pt-4">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-accent-teal">
              Связь
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-5xl">
              Опишите задачу простыми словами
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-graphite/72">
              Достаточно коротко описать проблему. Мы уточним детали и предложим понятный
              следующий шаг без лишней переписки.
            </p>

            <div className="mt-10 space-y-4 border-t border-graphite/8 pt-6">
              <div className="text-sm font-bold uppercase tracking-[0.16em] text-graphite/45">
                Прямые каналы
              </div>
              <div className="space-y-3 text-base font-semibold text-graphite/80">
                <a href={CONTACT.phoneHref} className="block hover:text-accent-teal">
                  {CONTACT.phoneDisplay}
                </a>
                <a href={`mailto:${CONTACT.email}`} className="block hover:text-accent-teal">
                  {CONTACT.email}
                </a>
                <a href={CONTACT.whatsappHref} target="_blank" rel="noreferrer" className="block hover:text-accent-teal">
                  WhatsApp для срочных задач
                </a>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="rounded-2xl border border-graphite/5 bg-surface p-6 shadow-sm">
              <label className="mb-4 block text-base font-bold text-graphite">Вы обращаетесь как *</label>
              <div className="flex flex-col gap-4 sm:flex-row">
                <label
                  className={`flex-1 cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                    segment === "tpe" ? "border-accent-teal bg-accent-teal/5" : "border-graphite/10 hover:border-graphite/30"
                  }`}
                >
                  <input required type="radio" name="segment" value="tpe" checked={segment === "tpe"} onChange={() => setSegment("tpe")} className="text-accent-teal focus:ring-accent-teal" />
                  <span className="text-base font-bold text-graphite">Бизнес / компания</span>
                </label>
                <label
                  className={`flex-1 cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                    segment === "particulier" ? "border-accent-teal bg-accent-teal/5" : "border-graphite/10 hover:border-graphite/30"
                  }`}
                >
                  <input required type="radio" name="segment" value="particulier" checked={segment === "particulier"} onChange={() => setSegment("particulier")} className="text-accent-teal focus:ring-accent-teal" />
                  <span className="text-base font-bold text-graphite">Другой тип обращения</span>
                </label>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-base font-bold text-graphite">Ваше имя *</label>
                <input required type="text" name="name" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 shadow-sm transition-colors focus:border-accent-teal focus:outline-none" placeholder="Имя" />
              </div>
              <div>
                <label className="mb-2 block text-base font-bold text-graphite">Телефон *</label>
                <input required type="tel" name="phone" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 shadow-sm transition-colors focus:border-accent-teal focus:outline-none" placeholder="+33 6 XX XX XX XX" />
              </div>
              <div>
                <label className="mb-2 block text-base font-bold text-graphite">Электронная почта (необязательно)</label>
                <input type="email" name="email" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 shadow-sm transition-colors focus:border-accent-teal focus:outline-none" placeholder="email@example.com" />
              </div>
              <div>
                <label className="mb-2 block text-base font-bold text-graphite">Город *</label>
                <input required type="text" name="city" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 shadow-sm transition-colors focus:border-accent-teal focus:outline-none" placeholder="Например: Ницца" />
              </div>
            </div>

            {segment === "tpe" ? (
              <div className="space-y-6 rounded-2xl border border-graphite/5 bg-base p-6">
                <h3 className="mb-2 text-lg font-bold text-graphite">Параметры бизнеса</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-base font-bold text-graphite">Название компании</label>
                    <input type="text" name="company_name" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 focus:border-accent-teal focus:outline-none" placeholder="Название" />
                  </div>
                  <div>
                    <label className="mb-2 block text-base font-bold text-graphite">Формат места</label>
                    <select name="business_type" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 focus:border-accent-teal focus:outline-none">
                      <option value="">Выберите вариант...</option>
                      <option value="office">Офис</option>
                      <option value="shop">Магазин</option>
                      <option value="cabinet">Кабинет</option>
                      <option value="coworking">Общее рабочее пространство</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-base font-bold text-graphite">Рабочих мест</label>
                    <select name="workstation_count" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 focus:border-accent-teal focus:outline-none">
                      <option value="">Выберите число...</option>
                      <option value="1">1</option>
                      <option value="2-3">2-3</option>
                      <option value="4-10">4-10</option>
                      <option value="10+">10+</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-base font-bold text-graphite">Адрес объекта</label>
                    <input type="text" name="business_address" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 focus:border-accent-teal focus:outline-none" placeholder="Для оценки выезда" />
                  </div>
                </div>
              </div>
            ) : null}

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-base font-bold text-graphite">Какая помощь нужна? *</label>
                <select required name="service_type" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 shadow-sm transition-colors focus:border-accent-teal focus:outline-none">
                  <option value="">Выберите вариант...</option>
                  {SERVICE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-base font-bold text-graphite">Краткое описание задачи *</label>
                <textarea required name="problem_description" rows={4} minLength={15} className="w-full resize-none rounded-xl border border-graphite/10 bg-surface px-4 py-3 shadow-sm transition-colors focus:border-accent-teal focus:outline-none" placeholder="Коротко опишите, что нужно сделать или какая проблема возникла" />
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-base font-bold text-graphite">Сколько устройств</label>
                  <select name="device_count" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 focus:border-accent-teal focus:outline-none">
                    <option value="">Не важно</option>
                    <option value="1">1</option>
                    <option value="2-3">2-3</option>
                    <option value="4-10">4-10</option>
                    <option value="10+">10+</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-base font-bold text-graphite">Нужен выезд</label>
                  <div className="mt-2 flex gap-4 text-base font-medium">
                    <label className="flex items-center gap-2"><input type="radio" name="onsite_required" value="yes" className="text-accent-teal" /> Да</label>
                    <label className="flex items-center gap-2"><input type="radio" name="onsite_required" value="no" className="text-accent-teal" /> Нет</label>
                    <label className="flex items-center gap-2"><input type="radio" name="onsite_required" value="not_sure" className="text-accent-teal" /> Не знаю</label>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-base font-bold text-graphite">Срочность</label>
                  <select name="urgency" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 focus:border-accent-teal focus:outline-none">
                    <option value="">Обычная</option>
                    <option value="urgent">Срочно</option>
                    <option value="planning">Можно запланировать</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-graphite/5 pt-4">
              <button
                type="submit"
                disabled={submitState === "submitting"}
                className="mb-4 w-full rounded-full bg-accent-teal px-8 py-4 font-bold text-white shadow-premium-soft transition-all hover:bg-accent-teal/90 disabled:opacity-50 md:w-auto"
              >
                {submitState === "submitting" ? "Отправка..." : "Отправить заявку"}
              </button>

              <div className="text-sm font-medium text-graphite/55">
                Отправляя заявку, вы соглашаетесь с обработкой данных для связи по вашему запросу.
              </div>

              {submitState === "success" ? (
                <div className="mt-6 rounded-xl border border-green-100 bg-green-50 p-4 text-green-800">
                  <span className="mb-1 block font-bold">Заявка отправлена</span>
                  Спасибо. Мы получили вашу заявку и свяжемся с вами для уточнения деталей.
                </div>
              ) : null}

              {submitState === "error" ? (
                <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-red-800">
                  <span className="font-medium">
                    {submitNotice || "Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами в WhatsApp."}
                  </span>
                  {fieldErrors.length > 0 ? (
                    <ul className="mt-3 list-disc pl-5 text-sm">
                      {fieldErrors.map((error) => (
                        <li key={error}>{error}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-graphite/5 bg-surface p-4 text-base font-medium sm:flex-row sm:items-center sm:justify-between">
                <span className="text-graphite/70">Если задача срочная, лучше сразу написать:</span>
                <a href={CONTACT.whatsappHref} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-bold text-accent-teal hover:underline">
                  Написать в WhatsApp
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
