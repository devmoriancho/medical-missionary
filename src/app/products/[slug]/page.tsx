import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AddToCartButton } from "./AddToCartButton";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const productSearchResult = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      priceKes: products.priceKes,
      stockQuantity: products.stockQuantity,
      weightGrams: products.weightGrams,
      imageUrl: products.imageUrl,
      categoryName: categories.name,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);

  const product = productSearchResult[0];

  if (!product) {
    notFound();
  }

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center text-sm font-semibold text-teal-700 hover:text-teal-800 transition"
          >
            &larr; Back to Catalog
          </Link>
        </nav>

        <div className="overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-xs md:grid md:grid-cols-2">
          <div className="relative aspect-square w-full bg-slate-50 md:h-full p-6 flex items-center justify-center">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="h-full w-full object-contain p-6"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <span className="absolute top-4 left-4 rounded-full bg-slate-900/80 px-4 py-1 text-xs font-bold text-white uppercase tracking-wider">
              {product.categoryName}
            </span>
          </div>

          <div className="flex flex-col p-8 md:p-12 justify-between">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-lg bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Weight: {product.weightGrams}g
                </span>
                <span
                  className={`rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                    isOutOfStock
                      ? "bg-rose-50 text-rose-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {isOutOfStock ? "Out of Stock" : "In Stock"}
                </span>
              </div>

              <div className="mt-8">
                <p className="text-sm leading-relaxed text-slate-600">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="mt-12 border-t border-slate-100 pt-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Price
                </span>
                <span className="text-2xl font-black text-slate-900">
                  KSh&nbsp;
                  {Number(product.priceKes).toLocaleString("en-KE", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <AddToCartButton product={product} isOutOfStock={isOutOfStock} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
