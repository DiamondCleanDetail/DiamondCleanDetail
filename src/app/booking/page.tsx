import BookingWizard from "@/components/BookingWizard";

export default async function BookingPage({
  searchParams,
}: PageProps<"/booking">) {
  const params = await searchParams;
  const service = typeof params.service === "string" ? params.service : undefined;
  const pkg = typeof params.package === "string" ? params.package : undefined;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Book a Detail</h1>
      <p className="text-muted mb-8">
        Choose your service, compare packages, pick a time, and book — all
        online.
      </p>
      <BookingWizard initialCategory={service} initialPackage={pkg} />
    </div>
  );
}
