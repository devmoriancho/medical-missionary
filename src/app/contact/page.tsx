export default function ContactPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-16 md:px-12">
      <h1 className="text-4xl font-black text-slate-900">Contact Us</h1>
      <p className="mt-6 text-lg text-slate-600">
        Have a question about a product or delivery? Reach us at{" "}
        <a className="font-bold text-teal-700" href="mailto:hello@medicalmissionary.co.ke">
          hello@medicalmissionary.co.ke
        </a>
        .
      </p>
    </main>
  );
}
