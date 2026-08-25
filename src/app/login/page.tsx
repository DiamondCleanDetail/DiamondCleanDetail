export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Login</h1>
      <p className="text-muted mb-8">
        Client accounts aren&apos;t wired up yet — this is a placeholder for
        where login/signup will live once authentication is connected.
      </p>

      <form className="bg-surface border border-border rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted"
          />
        </div>
        <button
          type="button"
          disabled
          className="w-full bg-surface-2 text-muted cursor-not-allowed py-3 rounded-lg font-medium border border-border"
        >
          Sign In (not yet active)
        </button>
      </form>
    </div>
  );
}
