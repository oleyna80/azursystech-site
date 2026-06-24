"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getSubmitFallbackMessage,
  type ContactLocale,
  type ContactSubmitApiResult,
} from "@/lib/contact-submit";

type Segment = "particulier" | "tpe";

const CONTACT = {
  phoneDisplay: "+33 7 80 72 09 94",
  phoneHref: "tel:+33780720994",
  whatsappDisplay: "+33 7 80 72 09 94",
  whatsappHref: "https://wa.me/33780720994",
  email: "contact@azursystech.fr",
};

const PAGE_COPY = {
  fr: {
    eyebrow: "AzurSysTech",
    title: "Contact et demande",
    intro:
      "Décrivez votre besoin via le formulaire ou contactez-nous directement. Les canaux disponibles sont le téléphone, WhatsApp et l’email.",
    contactMethodsTitle: "Canaux de contact",
    phoneLabel: "Téléphone",
    whatsappLabel: "WhatsApp",
    emailLabel: "Email",
    formTitle: "Formulaire principal",
    formIntro:
      "Décrivez brièvement le besoin. Nous utilisons ces informations pour la qualification initiale de la demande.",
    nameLabel: "Nom *",
    namePlaceholder: "Votre nom",
    phoneFieldLabel: "Téléphone *",
    phonePlaceholder: "Numéro pour vous joindre",
    emailFieldLabel: "Email",
    emailPlaceholder: "Email",
    cityLabel: "Ville *",
    cityPlaceholder: "Ville et pays",
    segmentLegend: "Vous nous contactez en tant que *",
    segmentParticulier: "Particulier",
    segmentTpe: "Entreprise / TPE",
    serviceLabel: "Que faut-il faire ? *",
    servicePlaceholder: "Choisissez un service",
    descriptionLabel: "Courte description du besoin *",
    descriptionPlaceholder: "Décrivez brièvement le besoin ou le problème rencontré",
    deviceCountLabel: "Nombre d’appareils",
    deviceCountDefault: "Non précisé",
    onsiteLegend: "Déplacement nécessaire",
    yes: "Oui",
    no: "Non",
    notSure: "Je ne sais pas",
    urgencyLabel: "Urgence",
    urgencyDefault: "Non précisée",
    urgencyUrgent: "Urgent",
    urgencyStandard: "Demande standard",
    urgencyPlanning: "Peut être planifié",
    businessTitle: "Informations pour l’entreprise",
    companyNameLabel: "Nom de l’entreprise",
    businessTypeLabel: "Type de site",
    businessTypeDefault: "Non précisé",
    businessTypeOffice: "Bureau",
    businessTypeShop: "Commerce",
    businessTypeCabinet: "Cabinet",
    businessTypeCoworking: "Espace de travail",
    businessTypeOther: "Autre",
    workstationCountLabel: "Nombre de postes",
    businessNeedsLegend: "Ce qu’il faut prévoir",
    businessNeeds: {
      wifi: "Wi‑Fi",
      printers: "Imprimantes",
      local_network: "Réseau local",
      shared_folders: "Dossiers partagés",
      new_workstations: "Nouveaux postes",
      onsite_support: "Intervention sur site",
    },
    businessAddressLabel: "Adresse du site",
    homeInfoTitle: "Informations sur le besoin",
    homeDeviceLegend: "Équipement concerné",
    homeDevices: {
      desktop_pc: "Ordinateur fixe",
      laptop: "Ordinateur portable",
      wifi: "Wi‑Fi",
      printer: "Imprimante",
      multiple_devices: "Plusieurs appareils",
    },
    deviceStateLegend: "Ordinateur neuf ou déjà utilisé",
    deviceStateNew: "Neuf",
    deviceStateExisting: "Déjà utilisé",
    deviceStateNotApplicable: "Non applicable",
    homeNeedLegend: "Ce qu’il faut faire",
    homeNeeds: {
      repair: "Diagnostic / réparation",
      setup: "Configuration",
      migration: "Transfert de données",
      speedup: "Amélioration des performances",
      installation: "Installation du système / des logiciels",
    },
    consentNotice:
      "En envoyant la demande, vous acceptez le traitement des données pour la réponse à votre demande.",
    submitIdle: "Envoyer la demande",
    submitLoading: "Envoi en cours...",
    fallbackNote:
      "Si le formulaire est temporairement indisponible, utilisez le téléphone, WhatsApp ou l’email ci-dessus.",
    quickActionsTitle: "Actions rapides",
    callCta: `Appeler : ${CONTACT.phoneDisplay}`,
    whatsappCta: `WhatsApp : ${CONTACT.whatsappDisplay}`,
    serviceAreaTitle: "Zone de service",
    serviceAreaText:
      "Sites, automatisation et intake IA peuvent être cadrés à distance dans l’Union européenne. Les interventions sur site sont possibles uniquement après accord préalable.",
    nextStepTitle: "Après l’envoi",
    nextStepText:
      "Après réception de la demande, nous utilisons les informations du formulaire pour la qualification initiale et le prochain pas. En cas d’urgence, utilisez WhatsApp ou le téléphone.",
    serviceOptions: [
      { value: "automatisation_ia", label: "Automatisation IA / agent pour demandes entrantes" },
      { value: "site_web", label: "Site web / landing page" },
      { value: "site_automation_bundle", label: "Site + formulaire + automatisation" },
      { value: "depannage_pc", label: "Dépannage / diagnostic PC" },
      { value: "installation_pc", label: "Configuration d’un nouveau PC" },
      { value: "wifi", label: "Configuration Wi‑Fi" },
      { value: "imprimante", label: "Configuration imprimante" },
      { value: "reseau_local", label: "Réseau local" },
      { value: "partage_fichiers", label: "Dossiers partagés / accès aux fichiers" },
      { value: "poste_travail", label: "Poste de travail / plusieurs appareils" },
      { value: "petite_infra_tpe", label: "Environnement IT pour petite entreprise" },
      { value: "autre", label: "Autre" },
    ],
  },
  ru: {
    eyebrow: "AzurSysTech",
    title: "Контакты и заявка",
    intro:
      "Опишите задачу через форму или свяжитесь напрямую. Каналы связи: телефон, WhatsApp и email.",
    contactMethodsTitle: "Методы связи",
    phoneLabel: "Телефон",
    whatsappLabel: "WhatsApp",
    emailLabel: "Email",
    formTitle: "Основная форма заявки",
    formIntro:
      "Коротко опишите задачу, и мы используем эту информацию для первичной квалификации обращения.",
    nameLabel: "Имя *",
    namePlaceholder: "Ваше имя",
    phoneFieldLabel: "Телефон *",
    phonePlaceholder: "Телефон для связи",
    emailFieldLabel: "Email",
    emailPlaceholder: "Email",
    cityLabel: "Город *",
    cityPlaceholder: "Город и страна",
    segmentLegend: "Вы обращаетесь как *",
    segmentParticulier: "Частный клиент",
    segmentTpe: "Бизнес / TPE",
    serviceLabel: "Что нужно сделать *",
    servicePlaceholder: "Выберите услугу",
    descriptionLabel: "Краткое описание задачи *",
    descriptionPlaceholder: "Коротко опишите, что нужно сделать или какая проблема возникла",
    deviceCountLabel: "Сколько устройств",
    deviceCountDefault: "Не указано",
    onsiteLegend: "Нужен выезд",
    yes: "Да",
    no: "Нет",
    notSure: "Не знаю",
    urgencyLabel: "Срочность",
    urgencyDefault: "Не указано",
    urgencyUrgent: "Срочно",
    urgencyStandard: "Обычный запрос",
    urgencyPlanning: "Можно запланировать",
    businessTitle: "Информация для бизнеса",
    companyNameLabel: "Название компании",
    businessTypeLabel: "Тип объекта",
    businessTypeDefault: "Не указано",
    businessTypeOffice: "Офис",
    businessTypeShop: "Магазин",
    businessTypeCabinet: "Кабинет",
    businessTypeCoworking: "Рабочее пространство",
    businessTypeOther: "Другое",
    workstationCountLabel: "Сколько рабочих мест",
    businessNeedsLegend: "Что из этого нужно",
    businessNeeds: {
      wifi: "Wi-Fi",
      printers: "Принтеры",
      local_network: "Локальная сеть",
      shared_folders: "Общие папки",
      new_workstations: "Новые рабочие места",
      onsite_support: "Выездная помощь",
    },
    businessAddressLabel: "Адрес объекта",
    homeInfoTitle: "Информация по задаче",
    homeDeviceLegend: "Что нужно настроить",
    homeDevices: {
      desktop_pc: "Стационарный компьютер",
      laptop: "Ноутбук",
      wifi: "Wi-Fi",
      printer: "Принтер",
      multiple_devices: "Несколько устройств",
    },
    deviceStateLegend: "Это новый компьютер или существующий",
    deviceStateNew: "Новый",
    deviceStateExisting: "Уже используемый",
    deviceStateNotApplicable: "Не относится",
    homeNeedLegend: "Что именно нужно",
    homeNeeds: {
      repair: "Диагностика / ремонт",
      setup: "Настройка",
      migration: "Перенос данных",
      speedup: "Ускорение работы",
      installation: "Установка системы / программ",
    },
    consentNotice:
      "Отправляя заявку, вы соглашаетесь с обработкой данных для связи по вашему запросу.",
    submitIdle: "Отправить заявку",
    submitLoading: "Отправляем...",
    fallbackNote:
      "Если форма временно недоступна, используйте телефон, WhatsApp или email из блока выше.",
    quickActionsTitle: "Быстрые действия",
    callCta: `Позвонить: ${CONTACT.phoneDisplay}`,
    whatsappCta: `WhatsApp: ${CONTACT.whatsappDisplay}`,
    serviceAreaTitle: "Зона работы",
    serviceAreaText:
      "Сайты, автоматизацию и AI-intake можно обсуждать и запускать удаленно по Европейскому союзу. Выездные работы возможны только по отдельному согласованию.",
    nextStepTitle: "Что ожидать после контакта",
    nextStepText:
      "После получения обращения мы используем данные из формы для первичной квалификации и следующего шага. Если вопрос срочный, используйте WhatsApp или звонок.",
    serviceOptions: [
      { value: "automatisation_ia", label: "AI-автоматизация / агент для заявок" },
      { value: "site_web", label: "Сайт / landing page" },
      { value: "site_automation_bundle", label: "Сайт + форма + автоматизация" },
      { value: "depannage_pc", label: "Ремонт / диагностика ПК" },
      { value: "installation_pc", label: "Настройка нового ПК" },
      { value: "wifi", label: "Настройка Wi-Fi" },
      { value: "imprimante", label: "Настройка принтера" },
      { value: "reseau_local", label: "Локальная сеть" },
      { value: "partage_fichiers", label: "Общие папки / доступ к файлам" },
      { value: "poste_travail", label: "Рабочее место / несколько устройств" },
      { value: "petite_infra_tpe", label: "Настройка IT-среды для малого бизнеса" },
      { value: "autre", label: "Другое" },
    ],
  },
} as const satisfies Record<ContactLocale, Record<string, unknown>>;

const COUNT_OPTIONS = ["1", "2-3", "4-10", "10+"] as const;

export function ContactPageClient({ locale }: { locale: ContactLocale }) {
  const router = useRouter();
  const [segment, setSegment] = useState<Segment | "">("");
  const [submitNotice, setSubmitNotice] = useState("");
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const copy = PAGE_COPY[locale];

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
        setSubmitNotice(getSubmitFallbackMessage(locale));
        return;
      }

      setSubmitNotice(getSubmitFallbackMessage(locale));
    } catch {
      setSubmitNotice(getSubmitFallbackMessage(locale));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F1E8] px-4 py-8 text-[#1F2A37] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">
            {copy.eyebrow}
          </p>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl">{copy.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#1F2A37]/90">{copy.intro}</p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">{copy.contactMethodsTitle}</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            <li className="rounded-xl border border-[#D8D0C4] p-4">
              <p className="text-sm text-[#1F2A37]/70">{copy.phoneLabel}</p>
              <a className="mt-2 inline-block font-medium text-[#1F6F78] underline" href={CONTACT.phoneHref}>
                {CONTACT.phoneDisplay}
              </a>
            </li>
            <li className="rounded-xl border border-[#D8D0C4] p-4">
              <p className="text-sm text-[#1F2A37]/70">{copy.whatsappLabel}</p>
              <a className="mt-2 inline-block font-medium text-[#8A4A2F] underline" href={CONTACT.whatsappHref}>
                {CONTACT.whatsappDisplay}
              </a>
            </li>
            <li className="rounded-xl border border-[#D8D0C4] p-4 sm:col-span-2">
              <p className="text-sm text-[#1F2A37]/70">{copy.emailLabel}</p>
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
          <h2 className="font-serif text-2xl">{copy.formTitle}</h2>
          <p className="mt-3 text-[#1F2A37]/90">{copy.formIntro}</p>

          <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
            <input type="hidden" name="locale" value={locale} />
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
                <span className="text-sm font-medium">{copy.nameLabel}</span>
                <input
                  required
                  name="name"
                  type="text"
                  placeholder={copy.namePlaceholder}
                  className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium">{copy.phoneFieldLabel}</span>
                <input
                  required
                  name="phone"
                  type="tel"
                  placeholder={copy.phonePlaceholder}
                  className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium">{copy.emailFieldLabel}</span>
                <input
                  name="email"
                  type="email"
                  placeholder={copy.emailPlaceholder}
                  className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium">{copy.cityLabel}</span>
                <input
                  required
                  name="city"
                  type="text"
                  placeholder={copy.cityPlaceholder}
                  className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2"
                />
              </label>
            </div>

            <fieldset className="grid gap-3 rounded-xl border border-[#D8D0C4] p-4">
              <legend className="px-2 text-sm font-medium">{copy.segmentLegend}</legend>
              <label className="flex items-center gap-2">
                <input
                  required
                  type="radio"
                  name="segment"
                  value="particulier"
                  checked={segment === "particulier"}
                  onChange={() => setSegment("particulier")}
                />
                <span>{copy.segmentParticulier}</span>
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
                <span>{copy.segmentTpe}</span>
              </label>
            </fieldset>

            <label className="grid gap-2">
              <span className="text-sm font-medium">{copy.serviceLabel}</span>
              <select
                required
                name="service_type"
                defaultValue=""
                className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2"
              >
                <option value="" disabled>
                  {copy.servicePlaceholder}
                </option>
                {copy.serviceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium">{copy.descriptionLabel}</span>
              <textarea
                required
                name="problem_description"
                minLength={15}
                maxLength={1500}
                placeholder={copy.descriptionPlaceholder}
                className="min-h-32 rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-sm font-medium">{copy.deviceCountLabel}</span>
                <select
                  name="device_count"
                  defaultValue=""
                  className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2"
                >
                  <option value="">{copy.deviceCountDefault}</option>
                  {COUNT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <fieldset className="grid gap-2 rounded-lg border border-[#D8D0C4] p-3 sm:col-span-2">
                <legend className="px-1 text-sm font-medium">{copy.onsiteLegend}</legend>
                <label className="flex items-center gap-2">
                  <input type="radio" name="onsite_required" value="yes" />
                  <span>{copy.yes}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="onsite_required" value="no" />
                  <span>{copy.no}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="onsite_required" value="not_sure" />
                  <span>{copy.notSure}</span>
                </label>
              </fieldset>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-medium">{copy.urgencyLabel}</span>
              <select name="urgency" defaultValue="" className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2">
                <option value="">{copy.urgencyDefault}</option>
                <option value="urgent">{copy.urgencyUrgent}</option>
                <option value="standard">{copy.urgencyStandard}</option>
                <option value="planning">{copy.urgencyPlanning}</option>
              </select>
            </label>

            {segment === "tpe" ? (
              <fieldset className="grid gap-4 rounded-xl border border-[#D8D0C4] p-4">
                <legend className="px-2 text-sm font-medium">{copy.businessTitle}</legend>

                <label className="grid gap-2">
                  <span className="text-sm font-medium">{copy.companyNameLabel}</span>
                  <input name="company_name" type="text" className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2" />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium">{copy.businessTypeLabel}</span>
                    <select name="business_type" defaultValue="" className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2">
                      <option value="">{copy.businessTypeDefault}</option>
                      <option value="office">{copy.businessTypeOffice}</option>
                      <option value="shop">{copy.businessTypeShop}</option>
                      <option value="cabinet">{copy.businessTypeCabinet}</option>
                      <option value="coworking">{copy.businessTypeCoworking}</option>
                      <option value="other">{copy.businessTypeOther}</option>
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium">{copy.workstationCountLabel}</span>
                    <select
                      name="workstation_count"
                      defaultValue=""
                      className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2"
                    >
                      <option value="">{copy.deviceCountDefault}</option>
                      {COUNT_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <fieldset className="grid gap-2 rounded-lg border border-[#D8D0C4] p-3">
                  <legend className="px-1 text-sm font-medium">{copy.businessNeedsLegend}</legend>
                  {Object.entries(copy.businessNeeds).map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2">
                      <input type="checkbox" name="business_needs" value={value} />
                      <span>{label}</span>
                    </label>
                  ))}
                </fieldset>

                <label className="grid gap-2">
                  <span className="text-sm font-medium">{copy.businessAddressLabel}</span>
                  <input name="business_address" type="text" className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2" />
                </label>
              </fieldset>
            ) : null}

            {segment === "particulier" ? (
              <fieldset className="grid gap-4 rounded-xl border border-[#D8D0C4] p-4">
                <legend className="px-2 text-sm font-medium">{copy.homeInfoTitle}</legend>

                <fieldset className="grid gap-2 rounded-lg border border-[#D8D0C4] p-3">
                  <legend className="px-1 text-sm font-medium">{copy.homeDeviceLegend}</legend>
                  {Object.entries(copy.homeDevices).map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2">
                      <input type="checkbox" name="home_device_type" value={value} />
                      <span>{label}</span>
                    </label>
                  ))}
                </fieldset>

                <fieldset className="grid gap-2 rounded-lg border border-[#D8D0C4] p-3">
                  <legend className="px-1 text-sm font-medium">{copy.deviceStateLegend}</legend>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="device_state" value="new" />
                    <span>{copy.deviceStateNew}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="device_state" value="existing" />
                    <span>{copy.deviceStateExisting}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="device_state" value="not_applicable" />
                    <span>{copy.deviceStateNotApplicable}</span>
                  </label>
                </fieldset>

                <fieldset className="grid gap-2 rounded-lg border border-[#D8D0C4] p-3">
                  <legend className="px-1 text-sm font-medium">{copy.homeNeedLegend}</legend>
                  {Object.entries(copy.homeNeeds).map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2">
                      <input type="checkbox" name="home_need_type" value={value} />
                      <span>{label}</span>
                    </label>
                  ))}
                </fieldset>
              </fieldset>
            ) : null}

            <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              {copy.consentNotice}
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#1F6F78] px-4 py-3 font-medium text-white hover:bg-[#185A61] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? copy.submitLoading : copy.submitIdle}
              </button>
              <p className="text-sm text-[#1F2A37]/75">{copy.fallbackNote}</p>
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
          <h2 className="font-serif text-2xl">{copy.quickActionsTitle}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a
              href={CONTACT.whatsappHref}
              className="rounded-lg border border-[#C96F4A] bg-[#FFF3EE] px-4 py-3 text-center font-medium text-[#8A4A2F] hover:bg-[#FBE8DF]"
            >
              {copy.whatsappCta}
            </a>
            <a
              href={CONTACT.phoneHref}
              className="rounded-lg bg-[#1F6F78] px-4 py-3 text-center font-medium text-white hover:bg-[#185A61]"
            >
              {copy.callCta}
            </a>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">{copy.serviceAreaTitle}</h2>
          <p className="mt-3 text-[#1F2A37]/90">{copy.serviceAreaText}</p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl">{copy.nextStepTitle}</h2>
          <p className="mt-3 text-[#1F2A37]/90">{copy.nextStepText}</p>
        </section>
      </div>
    </main>
  );
}
