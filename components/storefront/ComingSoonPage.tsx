"use client";

interface ComingSoonPageProps {
  businessName: string;
  logoUrl?: string;
}

export default function ComingSoonPage({ businessName, logoUrl }: ComingSoonPageProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />
        <div className="absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <section className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${businessName} logo`}
            className="mb-8 h-20 w-20 rounded-2xl border border-white/30 bg-white/10 p-2 object-contain shadow-2xl"
          />
        ) : (
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/30 bg-white/10 text-3xl font-bold shadow-2xl">
            {businessName.charAt(0).toUpperCase()}
          </div>
        )}

        <p className="rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
          Storefront Preparing For Launch
        </p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          {businessName}
        </h1>
        <p className="mt-5 max-w-2xl text-base text-slate-200 sm:text-lg">
          We are putting the final touches on this store. Check back soon for the full shopping experience.
        </p>

        <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 backdrop-blur">
          <p className="text-sm text-slate-100">Status: Under Construction</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cyan-100">Public Access Temporarily Disabled</p>
        </div>
      </section>
    </main>
  );
}