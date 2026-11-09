import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8 sm:p-16 font-sans max-w-4xl mx-auto space-y-8">
      <Link href="/" className="text-amber-400 hover:text-amber-300 text-sm font-semibold">
        ← Back to Life Hub
      </Link>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Terms of Service for Life Hub</h1>
      <p className="text-xs text-neutral-400">Last updated: November 9, 2026</p>

      <section className="space-y-4 text-sm text-neutral-300 leading-relaxed">
        <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
        <p>
          By accessing and using Life Hub, you agree to these terms. Life Hub is an all-in-one personal productivity,
          habit tracking, scripture inspiration, and music dashboard.
        </p>

        <h2 className="text-lg font-bold text-white">2. Use of Third-Party Services</h2>
        <p>
          Life Hub connects with YouTube Music APIs. By using music integration features, you also agree to be bound by
          YouTube's Terms of Service and Google's Privacy Policy.
        </p>

        <h2 className="text-lg font-bold text-white">3. Disclaimer</h2>
        <p>
          Life Hub is provided "as is" for personal productivity and spiritual study without warranties of any kind.
        </p>

        <h2 className="text-lg font-bold text-white">4. Contact</h2>
        <p>
          For inquiries regarding these terms, contact <code>jaisonsam47@gmail.com</code>.
        </p>
      </section>
    </div>
  );
}
