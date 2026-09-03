"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, RefreshCw, AlertCircle } from "lucide-react";

interface LaunchDrillButtonProps {
  className?: string;
  label?: string;
  domain?: string;
}

export function LaunchDrillButton({
  className,
  label = "Launch 20-Q Refresher Drill",
  domain,
}: LaunchDrillButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLaunch = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/srs/daily-drill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      if (data.success && data.attemptId) {
        router.push(`/attempts/${data.attemptId}`);
      } else {
        setErrorMessage(data.error || "Unable to assemble refresher drill. Please try again.");
      }
    } catch (err) {
      console.error("Failed to launch daily drill:", err);
      setErrorMessage("Network error while assembling drill. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleLaunch}
        disabled={loading}
        className={
          className ||
          "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs sm:text-sm font-bold shadow-md hover:brightness-110 active:scale-95 transition-all self-start cursor-pointer disabled:opacity-50"
        }
      >
        {loading ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <Zap className="w-4 h-4 fill-current" />
        )}
        <span>{loading ? "Generating Drill..." : label}</span>
      </button>

      {errorMessage && (
        <div className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
