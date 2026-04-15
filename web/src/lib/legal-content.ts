export const LEGAL_CONTACT = {
  email: "contact@azursystech.fr",
  phoneDisplay: "+33 7 80 72 09 94",
  phoneHref: "tel:+33780720994",
  whatsappDisplay: "+33 7 80 72 09 94",
  whatsappHref: "https://wa.me/33780720994",
} as const;

export const LEGAL_BUSINESS = {
  owner: "OLEINIK DMITRII",
  status: "Entrepreneur individuel - micro-entrepreneur",
  registration: "SIREN 940 870 140 / SIRET 940 870 140 00016",
  address: "9 AV EMMANUEL BRIDAULT, 06000 NICE",
} as const;

export const LEGAL_HOSTING = {
  provider: "Hetzner Online GmbH",
  address: "Industriestr. 25, 91710 Gunzenhausen, Germany",
  website: "https://www.hetzner.com",
} as const;

export const PRIVACY_TOOLS = [
  "Форма сайта и контактные каналы (телефон, WhatsApp, email)",
  "Маршрут intake через n8n + Google Sheets (launch baseline)",
  "Чат-модуль сайта (если включен в production)",
  "CRM-инструмент (подключается на следующем этапе после launch)",
  "Инструменты аналитики сайта (если фактически включены)",
] as const;
