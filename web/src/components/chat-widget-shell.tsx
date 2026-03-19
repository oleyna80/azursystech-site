"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type ChatStage = "intake_intro" | "handoff" | "safe_fallback";

const CONTACT = {
  phoneDisplay: "+33 7 49 70 54 65",
  phoneHref: "tel:+33749705465",
  whatsappDisplay: "+33 7 49 70 54 65",
  whatsappHref: "https://wa.me/33749705465",
  email: "contact@azursystech.fr",
};

export function ChatWidgetShell() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<ChatStage>("intake_intro");
  const isContactPage = pathname === "/contact";

  if (pathname === "/health" || pathname === "/legal" || pathname === "/privacy") {
    return null;
  }

  const openWidget = () => {
    setIsOpen(true);
    setStage("intake_intro");
  };

  return (
    <div
      className={`fixed right-3 z-40 sm:right-6 ${
        isContactPage ? "bottom-24 sm:bottom-6" : "bottom-20 sm:bottom-6"
      }`}
    >
      {isOpen ? (
        <section
          className="w-[min(23rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] shadow-lg"
          aria-label="Чат-помощник AzurSysTech"
        >
          <header className="flex items-center justify-between border-b border-[#D8D0C4] bg-[#F6F1E8] px-4 py-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1F6F78]">Чат-помощник</p>
              <p className="text-sm font-semibold text-[#1F2A37]">Поможем уточнить запрос и выбрать удобный канал связи</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md border border-[#D8D0C4] bg-[#FFFDFC] px-2 py-1 text-xs font-medium text-[#1F2A37] hover:bg-[#F6F1E8]"
            >
              Свернуть
            </button>
          </header>

          <div className="max-h-[65vh] overflow-y-auto px-4 py-4">
            {stage === "intake_intro" ? (
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-[#1F2A37]">Поможем быстро сориентироваться</h2>
                <p className="text-sm leading-6 text-[#1F2A37]/90">
                  Коротко подскажем, как удобнее передать задачу и связаться с нами. Для точной
                  оценки и согласования деталей используйте форму, телефон, WhatsApp или email.
                </p>
                <ul className="grid gap-2 text-sm text-[#1F2A37]/90">
                  <li className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2">• Для бизнеса или для дома?</li>
                  <li className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2">• Что нужно сделать и насколько срочно?</li>
                  <li className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2">• Где вы находитесь и нужен ли выезд?</li>
                </ul>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setStage("handoff")}
                    className="rounded-lg bg-[#1F6F78] px-3 py-2 text-sm font-semibold text-white hover:bg-[#185A61]"
                  >
                    Продолжить
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage("safe_fallback")}
                    className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2 text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
                  >
                    Показать варианты связи
                  </button>
                </div>
              </div>
            ) : null}

            {stage === "handoff" ? (
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-[#1F2A37]">Выберите удобный способ связи</h2>
                <p className="text-sm leading-6 text-[#1F2A37]/90">
                  Для продолжения нужны контакт и короткое описание задачи. Выберите удобный канал.
                </p>
                <ul className="grid gap-2 text-sm text-[#1F2A37]/90">
                  <li className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2">• Имя и телефон</li>
                  <li className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2">• Город и формат (бизнес / дом)</li>
                  <li className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2">• Краткое описание обращения</li>
                </ul>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Link
                    href="/contact"
                    className="rounded-lg bg-[#1F6F78] px-3 py-2 text-center text-sm font-semibold text-white hover:bg-[#185A61]"
                  >
                    Открыть форму заявки
                  </Link>
                  <a
                    href={CONTACT.whatsappHref}
                    className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2 text-center text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={CONTACT.phoneHref}
                    className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2 text-center text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
                  >
                    Позвонить
                  </a>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2 text-center text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
                  >
                    Email
                  </a>
                </div>
                <p className="text-xs leading-5 text-[#1F2A37]/75">
                  Оставляя контакты, вы соглашаетесь на обработку данных для связи по вашему запросу.
                  Подробнее: 
                  <Link href="/legal" className="underline">
                    Правовая информация
                  </Link>
                  {" "}и{" "}
                  <Link href="/privacy" className="underline">
                    Политика конфиденциальности
                  </Link>
                  .
                </p>
              </div>
            ) : null}

            {stage === "safe_fallback" ? (
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-[#1F2A37]">Если удобнее связаться напрямую</h2>
                <p className="text-sm leading-6 text-[#1F2A37]/90">
                  Если чат сейчас не подходит, используйте любой удобный канал связи ниже.
                </p>
                <div className="rounded-xl border border-[#D8D0C4] bg-[#F6F1E8] p-3 text-sm text-[#1F2A37]">
                  Точную стоимость и время выезда согласовываем после уточнения деталей по заявке.
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Link
                    href="/contact"
                    className="rounded-lg bg-[#1F6F78] px-3 py-2 text-center text-sm font-semibold text-white hover:bg-[#185A61]"
                  >
                    Оставить заявку
                  </Link>
                  <a
                    href={CONTACT.whatsappHref}
                    className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2 text-center text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
                  >
                    WhatsApp: {CONTACT.whatsappDisplay}
                  </a>
                  <a
                    href={CONTACT.phoneHref}
                    className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2 text-center text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
                  >
                    Телефон: {CONTACT.phoneDisplay}
                  </a>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2 text-center text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
                  >
                    Email: {CONTACT.email}
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={openWidget}
          className="rounded-full border border-[#D8D0C4] bg-[#F6F1E8] px-3.5 py-2.5 text-sm font-medium text-[#1F2A37] shadow-md transition hover:bg-[#EFE7DA]"
          aria-label="Открыть чат-помощник"
        >
          Чат-помощник
        </button>
      )}
    </div>
  );
}
