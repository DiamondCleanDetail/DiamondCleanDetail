"use client";

import { useState, type FormEvent } from "react";

export default function AdminGate() {
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const res = await fetch("/api/admin-unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passphrase }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-24 text-center">
      <h1 className="text-2xl font-bold mb-2">Staff Access</h1>
      <p className="text-muted mb-8 text-sm">Enter the staff passphrase to continue.</p>
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
          className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm text-center focus:outline-none focus:border-accent transition-colors"
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
    </div>
  );
}
