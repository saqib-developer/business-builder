"use client";

export default function StorefrontNotFoundPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12 flex items-center justify-center">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">404</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Storefront Not Found</h1>
        <p className="mt-3 text-sm text-slate-600">
          This subdomain is not connected to any storefront.
        </p>
      </section>
    </main>
  );
}