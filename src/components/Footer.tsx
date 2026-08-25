import DiamondDivider from "@/components/DiamondDivider";
import { serviceArea } from "@/data/serviceArea";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <DiamondDivider />
      <div className="mx-auto max-w-6xl px-6 pb-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-muted">
        <a href={`tel:${serviceArea.phoneHref}`} className="hover:text-foreground transition-colors">
          {serviceArea.phone}
        </a>
        <span className="hidden sm:inline text-border">&bull;</span>
        <a href={`mailto:${serviceArea.email}`} className="hover:text-foreground transition-colors">
          {serviceArea.email}
        </a>
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-8 text-center text-xs text-muted tracking-wide">
        A cut above every car wash.
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
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
