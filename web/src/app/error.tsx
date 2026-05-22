"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

const ERROR_COPY = {
  fr: {
    title: "Une erreur est survenue",
    message: "La page est temporairement indisponible. Essayez de la recharger ou revenez à l'accueil.",
    retry: "Réessayer",
    home: "Accueil",
  },
  ru: {
    title: "Что-то пошло не так",
    message: "Страница временно недоступна. Попробуйте обновить её или вернуться на главную.",
    retry: "Попробовать снова",
    home: "На главную",
  },
} as const;

type ErrorLocale = keyof typeof ERROR_COPY;
const DEFAULT_ERROR_LOCALE: ErrorLocale = "fr";

function getRuntimeLocaleSnapshot(): ErrorLocale {
  return document.documentElement.lang?.toLowerCase().startsWith("ru") ? "ru" : DEFAULT_ERROR_LOCALE;
}

function subscribeToLocaleChanges() {
  return () => {};
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global app error boundary caught an error", error);
  }, [error]);

  const locale = useSyncExternalStore(subscribeToLocaleChanges, getRuntimeLocaleSnapshot, () => DEFAULT_ERROR_LOCALE);
  const copy = ERROR_COPY[locale];

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F1E8] px-4 py-10 text-[#1F2A37]">
      <section className="w-full max-w-xl rounded-[1.5rem] border border-[#D8D0C4] bg-[#FFFDFC] p-6 shadow-[0_18px_55px_rgba(23,35,49,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1F6F78]">
          AzurSysTech
        </p>
        <h1 className="mt-3 text-2xl font-semibold">{copy.title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#5C6670]">
          {copy.message}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#18565D]"
          >
            {copy.retry}
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-[#D8D0C4] bg-white px-5 py-3 text-sm font-semibold text-[#1F2A37] transition-colors hover:bg-[#F6F1E8]"
          >
            {copy.home}
          </Link>
        </div>
      </section>
    </main>
  );
}
