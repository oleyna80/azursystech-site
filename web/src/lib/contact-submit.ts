export const CONTACT_SUBMIT_SOURCE = "website_form" as const;
export const CONTACT_CHAT_SOURCE = "website_chat" as const;
export const CONTACT_DEFAULT_STATUS = "New" as const;

const SOURCES = [CONTACT_SUBMIT_SOURCE, CONTACT_CHAT_SOURCE] as const;

const SEGMENTS = ["particulier", "tpe"] as const;
const SERVICE_TYPES = [
  "depannage_pc",
  "installation_pc",
  "wifi",
  "imprimante",
  "reseau_local",
  "partage_fichiers",
  "poste_travail",
  "petite_infra_tpe",
  "autre",
] as const;
const DEVICE_COUNTS = ["1", "2-3", "4-10", "10+"] as const;
const ONSITE_OPTIONS = ["yes", "no", "not_sure"] as const;
const URGENCY_OPTIONS = ["urgent", "standard", "planning"] as const;
const BUSINESS_TYPES = ["office", "shop", "cabinet", "coworking", "other"] as const;
const BUSINESS_NEEDS = ["wifi", "printers", "local_network", "shared_folders", "new_workstations", "onsite_support"] as const;
const HOME_DEVICE_TYPES = ["desktop_pc", "laptop", "wifi", "printer", "multiple_devices"] as const;
const DEVICE_STATES = ["new", "existing", "not_applicable"] as const;
const HOME_NEED_TYPES = ["repair", "setup", "migration", "speedup", "installation"] as const;

export type ContactSubmitSegment = (typeof SEGMENTS)[number];

export type ContactSubmitPayload = {
  source: (typeof SOURCES)[number];
  status: typeof CONTACT_DEFAULT_STATUS;
  name: string;
  phone: string;
  email?: string;
  city: string;
  segment: ContactSubmitSegment;
  service_type: (typeof SERVICE_TYPES)[number];
  problem_description: string;
  device_count?: (typeof DEVICE_COUNTS)[number];
  onsite_required?: (typeof ONSITE_OPTIONS)[number];
  urgency?: (typeof URGENCY_OPTIONS)[number];
  company_name?: string;
  business_type?: (typeof BUSINESS_TYPES)[number];
  workstation_count?: (typeof DEVICE_COUNTS)[number];
  business_needs?: Array<(typeof BUSINESS_NEEDS)[number]>;
  business_address?: string;
  home_device_type?: Array<(typeof HOME_DEVICE_TYPES)[number]>;
  device_state?: (typeof DEVICE_STATES)[number];
  home_need_type?: Array<(typeof HOME_NEED_TYPES)[number]>;
};

export type ContactSubmitValidationIssue = {
  field: string;
  message: string;
};

type ValidationResult =
  | { kind: "ok"; payload: ContactSubmitPayload }
  | { kind: "spam_detected" }
  | { kind: "validation_error"; issues: ContactSubmitValidationIssue[] };

const FALLBACK_MESSAGE =
  "Сейчас не удалось отправить заявку через форму. Используйте резервные каналы: телефон +33 7 49 70 54 65, WhatsApp +33 7 49 70 54 65, email contact@azursystech.fr или страницу /contact.";

function readTextField(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function readOptionalField(formData: FormData, key: string): string | undefined {
  const value = readTextField(formData, key);
  return value.length > 0 ? value : undefined;
}

function readMultiField(formData: FormData, key: string): string[] {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

function isOneOf<T extends readonly string[]>(value: string | undefined, options: T): value is T[number] {
  return typeof value === "string" && options.includes(value);
}

function allInSet<T extends readonly string[]>(values: string[] | undefined, options: T): values is Array<T[number]> {
  if (!values) {
    return false;
  }

  return values.every((value) => options.includes(value));
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function hasPhoneLikeShape(value: string): boolean {
  if (value.length < 6) {
    return false;
  }

  return /\d/.test(value);
}

export function validateAndBuildContactPayload(formData: FormData): ValidationResult {
  const honeypot = readTextField(formData, "website");
  if (honeypot.length > 0) {
    return { kind: "spam_detected" };
  }

  const issues: ContactSubmitValidationIssue[] = [];

  const name = readTextField(formData, "name");
  const phone = readTextField(formData, "phone");
  const email = readOptionalField(formData, "email");
  const sourceRaw = readOptionalField(formData, "source");
  const city = readTextField(formData, "city");
  const segmentRaw = readTextField(formData, "segment");
  const serviceTypeRaw = readTextField(formData, "service_type");
  const problemDescription = readTextField(formData, "problem_description");

  const deviceCountRaw = readOptionalField(formData, "device_count");
  const onsiteRequiredRaw = readOptionalField(formData, "onsite_required");
  const urgencyRaw = readOptionalField(formData, "urgency");

  const companyName = readOptionalField(formData, "company_name");
  const businessTypeRaw = readOptionalField(formData, "business_type");
  const workstationCountRaw = readOptionalField(formData, "workstation_count");
  const businessNeedsRaw = readMultiField(formData, "business_needs");
  const businessAddress = readOptionalField(formData, "business_address");

  const homeDeviceTypeRaw = readMultiField(formData, "home_device_type");
  const deviceStateRaw = readOptionalField(formData, "device_state");
  const homeNeedTypeRaw = readMultiField(formData, "home_need_type");

  if (!name) {
    issues.push({ field: "name", message: "Укажите имя" });
  }

  if (!phone) {
    issues.push({ field: "phone", message: "Укажите телефон" });
  } else if (!hasPhoneLikeShape(phone)) {
    issues.push({ field: "phone", message: "Проверьте формат телефона" });
  }

  if (email && !isEmail(email)) {
    issues.push({ field: "email", message: "Проверьте формат email" });
  }

  if (!city) {
    issues.push({ field: "city", message: "Укажите город" });
  }

  if (sourceRaw && !isOneOf(sourceRaw, SOURCES)) {
    issues.push({ field: "source", message: "Недопустимый источник обращения" });
  }

  if (!isOneOf(segmentRaw, SEGMENTS)) {
    issues.push({ field: "segment", message: "Выберите тип обращения" });
  }

  if (!isOneOf(serviceTypeRaw, SERVICE_TYPES)) {
    issues.push({ field: "service_type", message: "Выберите услугу" });
  }

  if (!problemDescription) {
    issues.push({ field: "problem_description", message: "Коротко опишите задачу" });
  } else if (problemDescription.length < 15 || problemDescription.length > 1500) {
    issues.push({
      field: "problem_description",
      message: "Описание задачи должно быть от 15 до 1500 символов",
    });
  }

  if (deviceCountRaw && !isOneOf(deviceCountRaw, DEVICE_COUNTS)) {
    issues.push({ field: "device_count", message: "Недопустимое значение количества устройств" });
  }

  if (onsiteRequiredRaw && !isOneOf(onsiteRequiredRaw, ONSITE_OPTIONS)) {
    issues.push({ field: "onsite_required", message: "Недопустимое значение для выезда" });
  }

  if (urgencyRaw && !isOneOf(urgencyRaw, URGENCY_OPTIONS)) {
    issues.push({ field: "urgency", message: "Недопустимое значение срочности" });
  }

  if (businessTypeRaw && !isOneOf(businessTypeRaw, BUSINESS_TYPES)) {
    issues.push({ field: "business_type", message: "Недопустимый тип объекта" });
  }

  if (workstationCountRaw && !isOneOf(workstationCountRaw, DEVICE_COUNTS)) {
    issues.push({ field: "workstation_count", message: "Недопустимое количество рабочих мест" });
  }

  if (businessNeedsRaw.length > 0 && !allInSet(businessNeedsRaw, BUSINESS_NEEDS)) {
    issues.push({ field: "business_needs", message: "Недопустимые значения в нуждах бизнеса" });
  }

  if (homeDeviceTypeRaw.length > 0 && !allInSet(homeDeviceTypeRaw, HOME_DEVICE_TYPES)) {
    issues.push({ field: "home_device_type", message: "Недопустимые значения в типе устройств" });
  }

  if (deviceStateRaw && !isOneOf(deviceStateRaw, DEVICE_STATES)) {
    issues.push({ field: "device_state", message: "Недопустимое состояние устройства" });
  }

  if (homeNeedTypeRaw.length > 0 && !allInSet(homeNeedTypeRaw, HOME_NEED_TYPES)) {
    issues.push({ field: "home_need_type", message: "Недопустимые значения в типе домашней задачи" });
  }

  if (issues.length > 0) {
    return { kind: "validation_error", issues };
  }

  const segment = segmentRaw as ContactSubmitSegment;
  const payload: ContactSubmitPayload = {
    source: (sourceRaw && isOneOf(sourceRaw, SOURCES) ? sourceRaw : CONTACT_SUBMIT_SOURCE),
    status: CONTACT_DEFAULT_STATUS,
    name,
    phone,
    city,
    segment,
    service_type: serviceTypeRaw as ContactSubmitPayload["service_type"],
    problem_description: problemDescription,
    ...(email ? { email } : {}),
    ...(deviceCountRaw ? { device_count: deviceCountRaw as ContactSubmitPayload["device_count"] } : {}),
    ...(onsiteRequiredRaw ? { onsite_required: onsiteRequiredRaw as ContactSubmitPayload["onsite_required"] } : {}),
    ...(urgencyRaw ? { urgency: urgencyRaw as ContactSubmitPayload["urgency"] } : {}),
  };

  if (segment === "tpe") {
    if (companyName) {
      payload.company_name = companyName;
    }

    if (businessTypeRaw) {
      payload.business_type = businessTypeRaw as ContactSubmitPayload["business_type"];
    }

    if (workstationCountRaw) {
      payload.workstation_count = workstationCountRaw as ContactSubmitPayload["workstation_count"];
    }

    if (businessNeedsRaw.length > 0) {
      payload.business_needs = businessNeedsRaw as ContactSubmitPayload["business_needs"];
    }

    if (businessAddress) {
      payload.business_address = businessAddress;
    }
  }

  if (segment === "particulier") {
    if (homeDeviceTypeRaw.length > 0) {
      payload.home_device_type = homeDeviceTypeRaw as ContactSubmitPayload["home_device_type"];
    }

    if (deviceStateRaw) {
      payload.device_state = deviceStateRaw as ContactSubmitPayload["device_state"];
    }

    if (homeNeedTypeRaw.length > 0) {
      payload.home_need_type = homeNeedTypeRaw as ContactSubmitPayload["home_need_type"];
    }
  }

  return { kind: "ok", payload };
}

export type ContactSubmitApiResult =
  | { status: "success"; userMessage: string }
  | { status: "spam_detected"; userMessage: string }
  | { status: "validation_error"; userMessage: string; issues: ContactSubmitValidationIssue[] }
  | { status: "integration_not_ready"; userMessage: string }
  | { status: "submit_failed"; userMessage: string };

export function getSubmitFallbackMessage(): string {
  return FALLBACK_MESSAGE;
}
