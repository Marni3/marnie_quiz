import Link from "next/link";
import { Sparkles, ArrowLeft, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PrivacyPolicyPage() {
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
              <Shield className="w-3.5 h-3.5" />
              <span>Legal & Data Protection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[var(--text)] tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text3)] mt-1 font-mono">
              Last updated: August 25, 2026
            </p>
          </div>

          <div className="space-y-6 text-sm text-[var(--text2)] leading-relaxed font-sans">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-[var(--text)] font-serif">1. Overview</h2>
              <p>
                <strong>Marnie Quiz</strong> is a free, non-commercial board-exam review platform designed for personal and educational use. We are committed to protecting your privacy and storing only the minimal amount of data necessary to provide personalized spaced-repetition quiz analytics.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[var(--text)] font-serif">2. Information We Collect</h2>
              <p>When you use Marnie Quiz, we collect the following limited information:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Account Information:</strong> When you sign in via Google OAuth, we receive your public name, email address, and profile picture to create and identify your examinee account.
                </li>
                <li>
                  <strong>Study & Quiz Metrics:</strong> We record your quiz attempts, selected answers, timestamps, time spent per question, and spaced repetition (FSRS) memory stability and retrievability scores.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[var(--text)] font-serif">3. How We Use Your Information</h2>
              <p>Your data is used solely to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Authenticate your identity across study sessions.</li>
                <li>Calculate Board Readiness Index (BRI) and Spaced Repetition forgetting curves.</li>
                <li>Generate targeted daily refresher drills based on your past quiz performance.</li>
              </ul>
              <p className="mt-2 text-xs text-[var(--text3)]">
                We do <strong>not</strong> sell, rent, monetize, or share your personal information with third-party advertisers or data brokers under any circumstances.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[var(--text)] font-serif">4. Data Storage & Security</h2>
              <p>
                Your account information and quiz progress are securely stored in serverless PostgreSQL databases protected by standard encryption in transit (HTTPS/TLS) and at rest. Authentication tokens are securely encrypted in HTTP-only session cookies.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[var(--text)] font-serif">5. Account Deletion & Rights</h2>
              <p>
                You may request complete deletion of your account and all associated quiz attempts at any time by contacting the platform administrator or disconnecting the app via your Google Account Permissions settings.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[var(--text)] font-serif">6. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, you can reach out via GitHub or through your designated study group administrator.
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
