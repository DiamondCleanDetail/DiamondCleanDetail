const mockStaff = [
  { name: "Farhan", role: "Owner / Detailer" },
  { name: "(Unassigned)", role: "Detailer" },
];

const mockJobs = [
  { customer: "Jane Doe", service: "Full Interior & Exterior Detail", date: "Aug 26", time: "10:30 AM", assigned: "Farhan" },
  { customer: "Mike Ross", service: "Basic Wash & Vacuum", date: "Aug 27", time: "9:00 AM", assigned: "Unassigned" },
];

const mockInvoices = [
  { customer: "Jane Doe", amount: 175, status: "Unpaid" },
  { customer: "Alex Kim", amount: 45, status: "Paid" },
];

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted mb-10">
        Placeholder view for Farhan and staff. Real data, login protection,
        and staff scheduling will be added later.
      </p>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Jobs</h2>
          <div className="space-y-3">
            {mockJobs.map((job, i) => (
              <div
                key={i}
                className="bg-surface-2 rounded-lg p-4 flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-medium">{job.customer}</p>
                  <p className="text-muted">{job.service}</p>
                </div>
                <div className="text-right">
                  <p>{job.date} · {job.time}</p>
                  <p className="text-muted">Assigned: {job.assigned}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Staff</h2>
          <div className="space-y-3">
            {mockStaff.map((staff, i) => (
              <div
                key={i}
                className="bg-surface-2 rounded-lg p-4 flex items-center justify-between text-sm"
              >
                <span className="font-medium">{staff.name}</span>
                <span className="text-muted">{staff.role}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface border border-border rounded-xl p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Invoices</h2>
          <div className="space-y-3">
            {mockInvoices.map((inv, i) => (
              <div
                key={i}
                className="bg-surface-2 rounded-lg p-4 flex items-center justify-between text-sm"
              >
                <span className="font-medium">{inv.customer}</span>
                <span>${inv.amount}</span>
                <span
                  className={
                    inv.status === "Paid" ? "text-green-400" : "text-accent"
                  }
                >
                  {inv.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
