import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8 sm:p-16 font-sans max-w-4xl mx-auto space-y-8">
      <Link href="/" className="text-amber-400 hover:text-amber-300 text-sm font-semibold">
        ← Back to Life Hub
      </Link>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy Policy for Life Hub</h1>
      <p className="text-xs text-neutral-400">Last updated: November 9, 2026</p>

      <section className="space-y-4 text-sm text-neutral-300 leading-relaxed">
        <h2 className="text-lg font-bold text-white">1. Information We Access</h2>
        <p>
          Life Hub connects to the Google / YouTube Data API solely to display your personal YouTube Music playlists,
          titles, and artwork directly on your personal dashboard. We only request read-only access
          (<code>https://www.googleapis.com/auth/youtube.readonly</code>).
        </p>

        <h2 className="text-lg font-bold text-white">2. How Information is Used & Stored</h2>
        <p>
          Your authorization credentials are stored securely in temporary, encrypted HTTP-only cookies in your browser.
          Life Hub does not sell, transfer, or share your Google user data with any third parties or advertisers.
        </p>

        <h2 className="text-lg font-bold text-white">3. User Control & Data Deletion</h2>
        <p>
          You may disconnect your YouTube account at any time using the "Disconnect" button on the dashboard, which
          immediately purges all access tokens from your browser.
        </p>

        <h2 className="text-lg font-bold text-white">4. Contact</h2>
        <p>
          For questions regarding your privacy, contact the developer at <code>jaisonsam47@gmail.com</code>.
        </p>
      </section>
    </div>
  );
}
