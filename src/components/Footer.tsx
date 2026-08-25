export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} Diamond Clean Detail. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="/admin" className="hover:text-foreground transition-colors">
            Staff / Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
