export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <main className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          AzurSysTech
        </p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
          Infrastructure bootstrap is live
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Next.js app is running with Docker/VPS deployment scaffold and health
          endpoint.
        </p>
      </main>
    </div>
  );
}
