import type { Metadata } from "next";
import Link from "next/link";

import { BriefForm } from "@/components/brief/brief-form";

export const metadata: Metadata = {
  title: "Бриф на ИИ-автоматизацию | AzurSysTech",
  description:
    "Короткий бриф для первого обсуждения по ИИ-автоматизации: один главный процесс, текущий процесс, ограничения и контакт для следующего шага.",
};

export default function BriefPage() {
  return (
    <main className="bg-[#F4F0E8] text-[#1F2A37]">
      <section className="bg-[#1F2A37] text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)] lg:items-end">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                AzurSysTech / бриф
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                Короткий бриф на один процесс по ИИ-автоматизации
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
                Заполните краткий бриф, чтобы описать задачу простыми словами. Это поможет понять,
                какой процесс имеет смысл автоматизировать первым и какой следующий шаг будет
                разумным.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/ai-automation"
                  className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/6 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Назад к описанию услуги
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md bg-[#1F6F78] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#18565D]"
                >
                  Открыть контакт
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/6 p-5">
              <p className="text-sm font-semibold text-white/90">Что важно помнить</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-white/76">
                <li>Это не полное техническое задание</li>
                <li>Достаточно одного главного процесса</li>
                <li>Подсказки помогают, но не заменяют форму</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <BriefForm />
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
        <div className="mx-auto max-w-6xl border-t border-[#D8D0C4] pt-6 text-sm leading-6 text-[#5C6670]">
          После отправки бриф попадёт на ручную проверку. Это не обещание цены, сроков или
          принятия проекта.
        </div>
      </section>
    </main>
  );
}
