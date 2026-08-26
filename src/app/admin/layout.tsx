import { cookies } from "next/headers";
import { ADMIN_ACCESS_COOKIE, hashPassphrase } from "@/lib/siteAccess";
import AdminGate from "@/components/AdminGate";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const passphrase = process.env.ADMIN_UNLOCK_PASSPHRASE;
  if (!passphrase) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center text-muted text-sm">
        Admin access isn&apos;t configured yet — set ADMIN_UNLOCK_PASSPHRASE to enable it.
      </div>
    );
  }

  const expected = await hashPassphrase(passphrase);
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_ACCESS_COOKIE)?.value;

  if (cookie === expected) {
    return <>{children}</>;
  }

  return <AdminGate />;
}
