"use client";

import { useState } from "react";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";

export default function ComingSoonPage() {
  const [showForm, setShowForm] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passphrase }),
    });
    if (res.ok) {
      window.location.href = "/";
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <FadeIn>
        <div className="max-w-lg text-center">
          <Image
            src="/brand/logo.png"
            alt="Diamond Clean Detail"
            width={64}
            height={64}
            className="h-16 w-16 mx-auto"
          />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-6">
            Something New Is On The Way
          </h1>
          <p className="text-muted mt-4 leading-relaxed">
            We&apos;re putting the finishing touches on online booking for Diamond Clean Detail.
            Check back soon — or call us directly to get your detail scheduled in the meantime.
          </p>

          <div className="mt-10">
            {!showForm ? (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="text-xs text-muted hover:text-foreground transition-colors underline underline-offset-4"
              >
                Preview access
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
                <input
                  type="password"
                  autoFocus
                  value={passphrase}
                  onChange={(e) => {
                    setPassphrase(e.target.value);
                    setError(false);
                  }}
                  placeholder="Passphrase"
                  className="w-full max-w-xs bg-surface border border-border rounded-lg px-4 py-2 text-sm text-center focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading || !passphrase}
                  className="chrome-btn px-6 py-2 rounded-lg font-semibold text-sm disabled:opacity-50"
                >
                  {loading ? "Checking..." : "Enter"}
                </button>
                {error && (
                  <p className="text-xs text-red-400">That passphrase didn&apos;t work — try again.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
