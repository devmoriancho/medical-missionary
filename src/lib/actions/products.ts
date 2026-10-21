"use server";

import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";

export async function fetchProductsByCategory(categorySlug: string) {
  try {
    const targetCategoryArray = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, categorySlug))
      .limit(1);

    if (targetCategoryArray.length === 0) {
      return { success: false, error: "Category not found", data: [] };
    }

    const singleCategory = targetCategoryArray[0];

    const matchedProducts = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.categoryId, singleCategory.id),
          eq(products.isActive, true),
        ),
      );

    return { success: true, error: null, data: matchedProducts };
  } catch {
    return { success: false, error: "Database error occurred", data: [] };
  }
}

export async function verifyAndDeductStock(
  productId: string,
  quantity: number,
) {
  try {
    const targetedProductArray = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (targetedProductArray.length === 0) {
      return { success: false, error: "Product not found" };
    }

    const singleProduct = targetedProductArray[0];

    if (singleProduct.stockQuantity < quantity) {
      return { success: false, error: "Insufficient stock available" };
    }

    const updatedStock = singleProduct.stockQuantity - quantity;

    await db
      .update(products)
      .set({ stockQuantity: updatedStock })
      .where(eq(products.id, productId));

    return { success: true, error: null };
  } catch {
    return { success: false, error: "Stock update failed" };
  }
}
