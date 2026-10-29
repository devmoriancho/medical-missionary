export default function ServicesPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-16 md:px-12">
      <h1 className="text-4xl font-black text-slate-900">Services</h1>
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {["Natural wellness products", "Health education", "Kenya-wide delivery"].map((service) => (
          <div key={service} className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-bold text-slate-900">{service}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}
