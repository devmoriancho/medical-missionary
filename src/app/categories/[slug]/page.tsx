import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = (
    await db.select().from(categories).where(eq(categories.slug, slug)).limit(1)
  )[0];

  if (!category) notFound();

  const categoryProducts = await db
    .select()
    .from(products)
    .where(eq(products.categoryId, category.id));

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 md:px-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-black text-slate-900">{category.name}</h1>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categoryProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1"
            >
              <img src={product.imageUrl} alt={product.name} className="aspect-square w-full object-contain" />
              <h2 className="mt-4 font-bold text-slate-900">{product.name}</h2>
              <p className="mt-2 font-black text-teal-700">
                KSh {Number(product.priceKes).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
