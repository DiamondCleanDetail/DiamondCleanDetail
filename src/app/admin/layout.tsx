import { cookies } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import { ADMIN_ACCESS_COOKIE, hashPassphrase, isOwnerEmail } from "@/lib/siteAccess";
import AdminGate from "@/components/AdminGate";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Owner login is the first door: if Farhan is signed in with the business
  // email — verified, and matching it exactly — he's straight in, no
  // passphrase. Verified matters: an unverified address could be typed by
  // anyone at sign-up, so an attacker could otherwise claim the owner email
  // and never prove it.
  const user = await currentUser();
  if (user) {
    const primary = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId);
    const isVerifiedOwner =
      Boolean(primary) &&
      primary!.verification?.status === "verified" &&
      isOwnerEmail(primary!.emailAddress);
    if (isVerifiedOwner) return <>{children}</>;
  }

  // The passphrase stays as a second door — it needs no Clerk account and is
  // the way in if the owner login ever isn't available.
  const passphrase = process.env.ADMIN_UNLOCK_PASSPHRASE;
  if (!passphrase) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center text-muted text-sm">
        Admin access isn&apos;t configured yet — sign in with the business email, or set
        ADMIN_UNLOCK_PASSPHRASE.
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
