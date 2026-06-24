"use client";

import { FormEvent, useState } from "react";
import type { ContactSubmitApiResult } from "@/lib/contact-submit";

type Segment = "particulier" | "tpe";
type SubmitState = "" | "submitting" | "success" | "error";
type ContactLocale = "fr" | "ru";

const CONTACT = {
  phoneDisplay: "+33 7 80 72 09 94",
  phoneHref: "tel:+33780720994",
  whatsappDisplay: "+33 7 80 72 09 94",
  whatsappHref: "https://wa.me/33780720994",
  email: "contact@azursystech.fr",
};

const CONTACT_COPY = {
  fr: {
    eyebrow: "Contact",
    title: "Décrivez le besoin avec des mots simples",
    intro: "Une description courte suffit. Nous clarifierons ensuite les détails et la suite de façon compréhensible.",
    directChannels: "Canaux directs",
    urgentWhatsapp: "WhatsApp pour les demandes urgentes",
    segmentLabel: "Vous nous contactez en tant que *",
    segmentBusiness: "Entreprise / équipe",
    segmentOther: "Particulier / autre besoin",
    name: "Votre nom *",
    phone: "Téléphone *",
    email: "Email (facultatif)",
    city: "Ville *",
    companySection: "Informations pour l’entreprise",
    companyName: "Nom de l’entreprise",
    businessType: "Type de lieu",
    workstations: "Nombre de postes",
    businessAddress: "Adresse du site",
    service: "Quel type d’aide ? *",
    description: "Description courte du besoin *",
    deviceCount: "Nombre d’appareils",
    onsite: "Déplacement nécessaire",
    urgency: "Urgence",
    submitIdle: "Envoyer la demande",
    submitLoading: "Envoi en cours...",
    privacy: "En envoyant la demande, vous acceptez le traitement des données pour la prise de contact liée à votre besoin.",
    successTitle: "Demande envoyée",
    successText: "Merci. Nous avons bien reçu votre demande et nous vérifierons les détails avant de revenir vers vous.",
    fallbackError: "Impossible d’envoyer la demande. Réessayez ou écrivez-nous sur WhatsApp.",
    urgentHint: "Si le besoin est urgent, il vaut mieux écrire directement :",
    urgentCta: "Écrire sur WhatsApp",
    placeholders: {
      name: "Nom",
      phone: "+33 6 XX XX XX XX",
      email: "email@example.com",
      city: "Ville et pays",
      companyName: "Nom de l’entreprise",
      businessAddress: "Pour évaluer un déplacement",
      description: "Décrivez brièvement ce qu’il faut faire ou le problème rencontré",
    },
    businessTypes: [
      { value: "", label: "Choisissez une option..." },
      { value: "office", label: "Bureau" },
      { value: "shop", label: "Commerce" },
      { value: "cabinet", label: "Cabinet" },
      { value: "coworking", label: "Espace partagé" },
      { value: "other", label: "Autre" },
    ],
    counts: [
      { value: "", label: "Choisissez un nombre..." },
      { value: "1", label: "1" },
      { value: "2-3", label: "2-3" },
      { value: "4-10", label: "4-10" },
      { value: "10+", label: "10+" },
    ],
    deviceCounts: [
      { value: "", label: "Peu importe" },
      { value: "1", label: "1" },
      { value: "2-3", label: "2-3" },
      { value: "4-10", label: "4-10" },
      { value: "10+", label: "10+" },
    ],
    serviceOptions: [
      { value: "", label: "Choisissez une option..." },
      { value: "automatisation_ia", label: "Automatisation IA / agent pour demandes entrantes" },
      { value: "site_web", label: "Site web / landing page" },
      { value: "site_automation_bundle", label: "Site + formulaire + automatisation" },
      { value: "depannage_pc", label: "Dépannage / diagnostic PC" },
      { value: "installation_pc", label: "Configuration d’un nouveau PC" },
      { value: "reseau_local", label: "Wi-Fi / réseau local" },
      { value: "imprimante", label: "Imprimantes / connexion d’appareils" },
      { value: "poste_travail", label: "Poste de travail / plusieurs appareils" },
      { value: "petite_infra_tpe", label: "Environnement IT pour petite entreprise" },
      { value: "partage_fichiers", label: "Dossiers partagés / accès aux fichiers" },
      { value: "autre", label: "Autre" },
    ],
    onsiteOptions: {
      yes: "Oui",
      no: "Non",
      notSure: "Je ne sais pas",
    },
    urgencyOptions: [
      { value: "", label: "Standard" },
      { value: "urgent", label: "Urgent" },
      { value: "planning", label: "Peut être planifié" },
    ],
  },
  ru: {
    eyebrow: "Связь",
    title: "Опишите задачу простыми словами",
    intro: "Достаточно коротко описать проблему. Мы уточним детали и предложим понятный следующий шаг без лишней переписки.",
    directChannels: "Прямые каналы",
    urgentWhatsapp: "WhatsApp для срочных задач",
    segmentLabel: "Вы обращаетесь как *",
    segmentBusiness: "Бизнес / компания",
    segmentOther: "Другой тип обращения",
    name: "Ваше имя *",
    phone: "Телефон *",
    email: "Электронная почта (необязательно)",
    city: "Город *",
    companySection: "Параметры бизнеса",
    companyName: "Название компании",
    businessType: "Формат места",
    workstations: "Рабочих мест",
    businessAddress: "Адрес объекта",
    service: "Какая помощь нужна? *",
    description: "Краткое описание задачи *",
    deviceCount: "Сколько устройств",
    onsite: "Нужен выезд",
    urgency: "Срочность",
    submitIdle: "Отправить заявку",
    submitLoading: "Отправка...",
    privacy: "Отправляя заявку, вы соглашаетесь с обработкой данных для связи по вашему запросу.",
    successTitle: "Заявка отправлена",
    successText: "Спасибо. Мы получили вашу заявку и свяжемся с вами для уточнения деталей.",
    fallbackError: "Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами в WhatsApp.",
    urgentHint: "Если задача срочная, лучше сразу написать:",
    urgentCta: "Написать в WhatsApp",
    placeholders: {
      name: "Имя",
      phone: "+33 6 XX XX XX XX",
      email: "email@example.com",
      city: "Город и страна",
      companyName: "Название",
      businessAddress: "Для оценки выезда",
      description: "Коротко опишите, что нужно сделать или какая проблема возникла",
    },
    businessTypes: [
      { value: "", label: "Выберите вариант..." },
      { value: "office", label: "Офис" },
      { value: "shop", label: "Магазин" },
      { value: "cabinet", label: "Кабинет" },
      { value: "coworking", label: "Общее рабочее пространство" },
      { value: "other", label: "Другое" },
    ],
    counts: [
      { value: "", label: "Выберите число..." },
      { value: "1", label: "1" },
      { value: "2-3", label: "2-3" },
      { value: "4-10", label: "4-10" },
      { value: "10+", label: "10+" },
    ],
    deviceCounts: [
      { value: "", label: "Не важно" },
      { value: "1", label: "1" },
      { value: "2-3", label: "2-3" },
      { value: "4-10", label: "4-10" },
      { value: "10+", label: "10+" },
    ],
    serviceOptions: [
      { value: "", label: "Выберите вариант..." },
      { value: "automatisation_ia", label: "AI-автоматизация / агент для заявок" },
      { value: "site_web", label: "Сайт / landing page" },
      { value: "site_automation_bundle", label: "Сайт + форма + автоматизация" },
      { value: "depannage_pc", label: "Ремонт / диагностика ПК" },
      { value: "installation_pc", label: "Настройка нового ПК" },
      { value: "reseau_local", label: "Wi-Fi / локальная сеть" },
      { value: "imprimante", label: "Принтеры / подключение устройств" },
      { value: "poste_travail", label: "Рабочее место / несколько устройств" },
      { value: "petite_infra_tpe", label: "IT-среда для малого бизнеса" },
      { value: "partage_fichiers", label: "Общие папки / доступ к файлам" },
      { value: "autre", label: "Другое" },
    ],
    onsiteOptions: {
      yes: "Да",
      no: "Нет",
      notSure: "Не знаю",
    },
    urgencyOptions: [
      { value: "", label: "Обычная" },
      { value: "urgent", label: "Срочно" },
      { value: "planning", label: "Можно запланировать" },
    ],
  },
} as const;

export function HomeContactSection({ locale }: { locale: ContactLocale }) {
  const [segment, setSegment] = useState<Segment>("tpe");
  const [submitState, setSubmitState] = useState<SubmitState>("");
  const [submitNotice, setSubmitNotice] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const copy = CONTACT_COPY[locale];

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
      setSubmitNotice(result?.userMessage ?? copy.fallbackError);
    } catch {
      setSubmitState("error");
      setSubmitNotice(copy.fallbackError);
    }
  };

  return (
    <section id="contact" className="relative bg-surface py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid gap-10 rounded-[2rem] bg-base-alt/70 p-6 shadow-premium-soft ring-1 ring-graphite/5 md:p-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14 lg:p-12">
          <div className="lg:pt-4">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-accent-teal">
              {copy.eyebrow}
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-5xl">
              {copy.title}
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-graphite/72">
              {copy.intro}
            </p>

            <div className="mt-10 space-y-4 border-t border-graphite/8 pt-6">
              <div className="text-sm font-bold uppercase tracking-[0.16em] text-graphite/45">
                {copy.directChannels}
              </div>
              <div className="space-y-3 text-base font-semibold text-graphite/80">
                <a href={CONTACT.phoneHref} className="block hover:text-accent-teal">
                  {CONTACT.phoneDisplay}
                </a>
                <a href={`mailto:${CONTACT.email}`} className="block hover:text-accent-teal">
                  {CONTACT.email}
                </a>
                <a href={CONTACT.whatsappHref} target="_blank" rel="noreferrer" className="block hover:text-accent-teal">
                  {copy.urgentWhatsapp}
                </a>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="rounded-2xl border border-graphite/5 bg-surface p-6 shadow-sm">
              <label className="mb-4 block text-base font-bold text-graphite">{copy.segmentLabel}</label>
              <div className="flex flex-col gap-4 sm:flex-row">
                <label
                  className={`flex-1 cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                    segment === "tpe" ? "border-accent-teal bg-accent-teal/5" : "border-graphite/10 hover:border-graphite/30"
                  }`}
                >
                  <input required type="radio" name="segment" value="tpe" checked={segment === "tpe"} onChange={() => setSegment("tpe")} className="text-accent-teal focus:ring-accent-teal" />
                  <span className="text-base font-bold text-graphite">{copy.segmentBusiness}</span>
                </label>
                <label
                  className={`flex-1 cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                    segment === "particulier" ? "border-accent-teal bg-accent-teal/5" : "border-graphite/10 hover:border-graphite/30"
                  }`}
                >
                  <input required type="radio" name="segment" value="particulier" checked={segment === "particulier"} onChange={() => setSegment("particulier")} className="text-accent-teal focus:ring-accent-teal" />
                  <span className="text-base font-bold text-graphite">{copy.segmentOther}</span>
                </label>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-base font-bold text-graphite">{copy.name}</label>
                <input required type="text" name="name" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 shadow-sm transition-colors focus:border-accent-teal focus:outline-none" placeholder={copy.placeholders.name} />
              </div>
              <div>
                <label className="mb-2 block text-base font-bold text-graphite">{copy.phone}</label>
                <input required type="tel" name="phone" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 shadow-sm transition-colors focus:border-accent-teal focus:outline-none" placeholder={copy.placeholders.phone} />
              </div>
              <div>
                <label className="mb-2 block text-base font-bold text-graphite">{copy.email}</label>
                <input type="email" name="email" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 shadow-sm transition-colors focus:border-accent-teal focus:outline-none" placeholder={copy.placeholders.email} />
              </div>
              <div>
                <label className="mb-2 block text-base font-bold text-graphite">{copy.city}</label>
                <input required type="text" name="city" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 shadow-sm transition-colors focus:border-accent-teal focus:outline-none" placeholder={copy.placeholders.city} />
              </div>
            </div>

            {segment === "tpe" ? (
              <div className="space-y-6 rounded-2xl border border-graphite/5 bg-base p-6">
                <h3 className="mb-2 text-lg font-bold text-graphite">{copy.companySection}</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-base font-bold text-graphite">{copy.companyName}</label>
                    <input type="text" name="company_name" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 focus:border-accent-teal focus:outline-none" placeholder={copy.placeholders.companyName} />
                  </div>
                  <div>
                    <label className="mb-2 block text-base font-bold text-graphite">{copy.businessType}</label>
                    <select name="business_type" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 focus:border-accent-teal focus:outline-none">
                      {copy.businessTypes.map((option) => (
                        <option key={option.value || option.label} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-base font-bold text-graphite">{copy.workstations}</label>
                    <select name="workstation_count" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 focus:border-accent-teal focus:outline-none">
                      {copy.counts.map((option) => (
                        <option key={option.value || option.label} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-base font-bold text-graphite">{copy.businessAddress}</label>
                    <input type="text" name="business_address" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 focus:border-accent-teal focus:outline-none" placeholder={copy.placeholders.businessAddress} />
                  </div>
                </div>
              </div>
            ) : null}

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-base font-bold text-graphite">{copy.service}</label>
                <select required name="service_type" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 shadow-sm transition-colors focus:border-accent-teal focus:outline-none">
                  {copy.serviceOptions.map((option) => (
                    <option key={option.value || option.label} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-base font-bold text-graphite">{copy.description}</label>
                <textarea required name="problem_description" rows={4} minLength={15} className="w-full resize-none rounded-xl border border-graphite/10 bg-surface px-4 py-3 shadow-sm transition-colors focus:border-accent-teal focus:outline-none" placeholder={copy.placeholders.description} />
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-base font-bold text-graphite">{copy.deviceCount}</label>
                  <select name="device_count" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 focus:border-accent-teal focus:outline-none">
                    {copy.deviceCounts.map((option) => (
                      <option key={option.value || option.label} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-base font-bold text-graphite">{copy.onsite}</label>
                  <div className="mt-2 flex gap-4 text-base font-medium">
                    <label className="flex items-center gap-2"><input type="radio" name="onsite_required" value="yes" className="text-accent-teal" /> {copy.onsiteOptions.yes}</label>
                    <label className="flex items-center gap-2"><input type="radio" name="onsite_required" value="no" className="text-accent-teal" /> {copy.onsiteOptions.no}</label>
                    <label className="flex items-center gap-2"><input type="radio" name="onsite_required" value="not_sure" className="text-accent-teal" /> {copy.onsiteOptions.notSure}</label>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-base font-bold text-graphite">{copy.urgency}</label>
                  <select name="urgency" className="w-full rounded-xl border border-graphite/10 bg-surface px-4 py-3 focus:border-accent-teal focus:outline-none">
                    {copy.urgencyOptions.map((option) => (
                      <option key={option.value || option.label} value={option.value}>
                        {option.label}
                      </option>
                    ))}
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
                {submitState === "submitting" ? copy.submitLoading : copy.submitIdle}
              </button>

              <div className="text-sm font-medium text-graphite/55">
                {copy.privacy}
              </div>

              {submitState === "success" ? (
                <div className="mt-6 rounded-xl border border-green-100 bg-green-50 p-4 text-green-800">
                  <span className="mb-1 block font-bold">{copy.successTitle}</span>
                  {copy.successText}
                </div>
              ) : null}

              {submitState === "error" ? (
                <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-red-800">
                  <span className="font-medium">
                    {submitNotice || copy.fallbackError}
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
                <span className="text-graphite/70">{copy.urgentHint}</span>
                <a href={CONTACT.whatsappHref} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-bold text-accent-teal hover:underline">
                  {copy.urgentCta}
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
