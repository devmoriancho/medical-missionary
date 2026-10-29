import Link from "next/link";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { BookIcon } from "@/components/icons/book";

export async function LiteratureHighlight() {
  const literature = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      priceKes: products.priceKes,
      imageUrl: products.imageUrl,
      stockQuantity: products.stockQuantity,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.isActive, true),
        eq(categories.slug, "lifestyle-health-literature"),
      ),
    )
    .limit(4);

  return (
    <section className="w-full border-b border-slate-100 bg-slate-50 px-6 py-16 md:px-12 md:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-3 text-teal-700">
              <BookIcon size={32} />
              <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Lifestyle Health Literature
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600">
              Explore books and publications covering healthy living, lifestyle
              principles, and natural health education.
            </p>
          </div>

          <Link
            href="/categories/lifestyle-health-literature"
            className="whitespace-nowrap rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-bold text-slate-700 transition hover:border-teal-600 hover:text-teal-700"
          >
            View All Literature
          </Link>
        </div>

        {literature.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center">
            <p className="text-sm text-slate-500">
              No literature products are available right now.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {literature.map((product) => {
              const outOfStock = Number(product.stockQuantity) <= 0;

              return (
                <article
                  key={product.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:flex-row"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    aria-label={`View ${product.name}`}
                    className="flex aspect-square w-full items-center justify-center bg-white p-5 sm:w-48 sm:shrink-0"
                  >
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full rounded-xl object-contain"
                      />
                    ) : (
                      <BookIcon size={56} className="text-teal-700" />
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                    <div>
                      <h3 className="text-base font-bold leading-snug text-slate-900">
                        {product.name}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <span className="text-base font-black text-slate-900">
                        KSh{" "}
                        {Number(product.priceKes).toLocaleString("en-KE", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>

                      <Link
                        href={`/products/${product.slug}`}
                        className="rounded-lg bg-teal-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-teal-800"
                      >
                        {outOfStock ? "View Product" : "View Details"}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
