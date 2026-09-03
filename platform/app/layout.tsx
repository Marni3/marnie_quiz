import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marnie Quiz — Board Exam Review Platform",
  description: "Interactive board exam study platform with LaTeX math support, folder organization, and instant grading.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${inter.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} h-full`}
    >
      <body className="min-h-[100dvh] flex flex-col antialiased selection:bg-[var(--accent)] selection:text-white pb-20 md:pb-0">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
