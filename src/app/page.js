import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-lg font-semibold text-sky-400">Smart Bookmark</span>
          <Link
            href="/login"
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500"
          >
            Sign in
          </Link>
        </div>
      </nav>

      <header className="relative overflow-hidden border-b border-slate-800/80 px-4 py-20 sm:px-6 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Save and sync your links, everywhere
          </h1>
          <p className="mt-4 text-lg text-slate-400 sm:text-xl">
            One place for all your bookmarks. Sign in with Google and access them from any device, with live updates across tabs.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-500"
            >
              Get started with Google
            </Link>
            <span className="text-sm text-slate-500">No password — one click</span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
          Why Smart Bookmark?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-400">
          Built for speed, privacy, and real-time sync.
        </p>
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Google sign-in only",
              description: "No passwords to remember. Sign in with your Google account and start saving in seconds.",
              icon: "🔐",
            },
            {
              title: "Real-time sync",
              description: "Open two tabs? Add a bookmark in one — it appears in the other instantly. No refresh needed.",
              icon: "⚡",
            },
            {
              title: "Private to you",
              description: "Your bookmarks are yours alone. Stored securely and never shared.",
              icon: "🛡️",
            },
          ].map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-slate-700"
            >
              <span className="text-2xl" aria-hidden>{item.icon}</span>
              <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-slate-400">{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-slate-800/80 bg-slate-900/30 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to organize your links?
          </h2>
          <p className="mt-3 text-slate-400">
            Join with Google and keep your bookmarks in one place, synced in real time.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-xl bg-sky-600 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-sky-500"
          >
            Sign in with Google
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800/80 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-sm text-slate-500">Smart Bookmark — Abstrabit challenge</span>
          <Link href="/login" className="text-sm text-sky-400 hover:text-sky-300">
            Sign in
          </Link>
        </div>
      </footer>
    </div>
  );
}
