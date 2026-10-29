import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
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
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Products Catalog
          </h1>
        </header>

        {catalogProducts.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center border border-slate-100 shadow-xs">
            <p className="text-sm font-semibold text-slate-500">
              No products are available right now.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {catalogProducts.map((product) => {
              const currentStock = Number(product.stockQuantity);
              const isOutOfStock = currentStock <= 0;

              return (
                <article
                  key={product.id}
                  className="flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-sm"
                >
                  <div className="relative aspect-square w-full bg-slate-50 p-4">
                    <picture className="flex h-full w-full items-center justify-center">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </picture>
                    <span className="absolute top-3 left-3 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                      {product.categoryName}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex-1">
                      <h2 className="text-sm font-bold text-slate-900 line-clamp-2 h-10 leading-tight">
                        {product.name}
                      </h2>
                      <p className="mt-2 text-xs text-slate-500 line-clamp-3">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <div className="flex items-baseline justify-between mb-4">
                        <span className="text-base font-black text-slate-900">
                          KSh&nbsp;
                          {Number(product.priceKes).toLocaleString("en-KE", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${isOutOfStock ? "text-rose-600" : "text-emerald-600"}`}
                        >
                          {isOutOfStock
                            ? "Out of Stock"
                            : `${currentStock} units`}
                        </span>
                      </div>

                      <Link
                        href={`/products/${product.slug}`}
                        className="block w-full rounded-xl bg-teal-700 py-3 text-center text-xs font-bold text-white uppercase tracking-wider hover:bg-teal-800 transition"
                      >
                        View Details
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
