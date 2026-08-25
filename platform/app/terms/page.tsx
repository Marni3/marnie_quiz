import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-8 relative z-10">
      {/* Top Navbar */}
      <div className="flex justify-between items-center max-w-4xl mx-auto w-full mb-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-[var(--text2)] hover:text-[var(--text)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marnie Quiz</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Content Card */}
      <div className="max-w-3xl w-full mx-auto my-auto py-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-10 shadow-[var(--shadow-lg)] space-y-6">
          <div className="border-b border-[var(--border)] pb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[var(--surface2)] border border-[var(--border)] text-xs font-mono text-[var(--accent)] font-semibold mb-3 shadow-xs">
              <FileText className="w-3.5 h-3.5" />
              <span>Terms of Use</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[var(--text)] tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text3)] mt-1 font-mono">
              Last updated: August 25, 2026
            </p>
          </div>

          <div className="space-y-6 text-sm text-[var(--text2)] leading-relaxed font-sans">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-[var(--text)] font-serif">1. Acceptance of Terms</h2>
              <p>
                By accessing or using <strong>Marnie Quiz</strong>, you agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue use of the platform.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[var(--text)] font-serif">2. Educational & Non-Commercial Purpose</h2>
              <p>
                Marnie Quiz is provided free of charge strictly as an educational study aid for students and examinees reviewing for professional licensure examinations (including the PRC Electronics Engineering Board Exam).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[var(--text)] font-serif">3. User Conduct & Accounts</h2>
              <p>When using Marnie Quiz, you agree to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide accurate authentication information through your Google Account.</li>
                <li>Use the platform responsibly for genuine personal study and quiz practice.</li>
                <li>Refrain from attempting to disrupt or compromise server operations.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[var(--text)] font-serif">4. Disclaimer of Warranties</h2>
              <p>
                The platform, question sets, solution explanations, and memory estimation models are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. While every effort is made to maintain high accuracy and alignment with official syllabi, we make no guarantees regarding actual board examination results or outcomes.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[var(--text)] font-serif">5. Changes to Terms</h2>
              <p>
                We may periodically update these Terms to reflect new features or curriculum updates. Continued use of the platform constitutes acceptance of any revised terms.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-[var(--text3)] max-w-4xl mx-auto w-full py-4">
        Marnie Quiz &bull; Free & Open-Source Educational Tool
      </footer>
    </div>
  );
}
