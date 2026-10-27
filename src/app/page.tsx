import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { LeafIcon } from "@/components/icons/leaf";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const catalogProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      priceKes: products.priceKes,
      stockQuantity: products.stockQuantity,
      imageUrl: products.imageUrl,
      categoryName: categories.name,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.isActive, true));

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 text-center md:text-left flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-3">
            <LeafIcon size={40} className="text-teal-700" />
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Medical Missionary Store
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl">
            Pure natural remedies, cold-pressed botanical oils, and historical
            lifestyle health literature aligned with the 8 Laws of Health.
          </p>
        </header>

        {catalogProducts.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center border border-slate-100 shadow-xs">
            <p className="text-lg text-slate-500 font-semibold">
              No products are available in the catalogue right now.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {catalogProducts.map((product) => {
              const currentStock = Number(product.stockQuantity);
              const isOutOfStock = currentStock <= 0;

              return (
                <article
                  key={product.id}
                  className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-md border border-slate-100"
                >
                  <div className="relative aspect-square w-full bg-slate-100">
                    <picture>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition-opacity duration-300"
                        loading="lazy"
                      />
                    </picture>
                    <span className="absolute top-3 left-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                      {product.categoryName}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-slate-900 line-clamp-2">
                        {product.name}
                      </h2>
                      <p className="mt-2 text-sm text-slate-500 line-clamp-3">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <div className="flex items-baseline justify-between mb-4">
                        <span className="text-xl font-black text-slate-900">
                          KSh{" "}
                          {Number(product.priceKes).toLocaleString("en-KE", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            isOutOfStock ? "text-rose-600" : "text-emerald-600"
                          }`}
                        >
                          {isOutOfStock
                            ? "Out of Stock"
                            : `${currentStock.toFixed(3)} kg available`}
                        </span>
                      </div>

                      <Link
                        href={`/products/${product.slug}`}
                        className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition cursor-pointer ${
                          isOutOfStock
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-teal-700 text-white hover:bg-teal-800 shadow-sm"
                        }`}
                      >
                        {isOutOfStock ? "Unavailable" : "View Product Details"}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
