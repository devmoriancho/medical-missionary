"use server";

import { db } from "@/db";
import {
  inventoryMovements,
  orderItems,
  orders,
  payments,
  products,
} from "@/db/schema";
import { and, eq, gte, inArray, sql } from "drizzle-orm";
import { z } from "zod";

const checkoutInputSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9),
  address: z.string().min(5),
  gateway: z.enum(["mpesa", "stripe", "cod"]),
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1)
    .refine(
      (items) => new Set(items.map((item) => item.id)).size === items.length,
      "Each product may only appear once in the basket.",
    ),
});

export async function processSecureCheckout(rawInput: unknown) {
  try {
    const parsedData = checkoutInputSchema.parse(rawInput);
    const { name, email, phone, address, gateway, items } = parsedData;

    const uniqueProductIds = items.map((item) => item.id);

    const orderResult = await db.transaction(async (tx) => {
      const catalogProducts = await tx
        .select({
          id: products.id,
          name: products.name,
          priceKes: products.priceKes,
          stockQuantity: products.stockQuantity,
          isActive: products.isActive,
        })
        .from(products)
        .where(inArray(products.id, uniqueProductIds));

      const productLookupMap = new Map(catalogProducts.map((p) => [p.id, p]));

      let cumulativeSubtotalInCents = 0;
      const itemsToInsert = [];

      for (const inputItem of items) {
        const dbProduct = productLookupMap.get(inputItem.id);

        if (!dbProduct || !dbProduct.isActive) {
          throw new Error(`Product '${inputItem.id}' is unavailable.`);
        }

        if (dbProduct.stockQuantity < inputItem.quantity) {
          throw new Error(
            `Insufficient stock for '${dbProduct.name}'. Only ${dbProduct.stockQuantity} items remain.`,
          );
        }

        const itemCostInCents =
          Math.round(Number(dbProduct.priceKes) * 100) * inputItem.quantity;
        cumulativeSubtotalInCents += itemCostInCents;

        itemsToInsert.push({
          productId: dbProduct.id,
          quantity: inputItem.quantity,
          priceAtPurchase: dbProduct.priceKes,
          productNameSnapshot: dbProduct.name,
        });

        const updatedRows = await tx
          .update(products)
          .set({
            stockQuantity: sql`${products.stockQuantity} - ${inputItem.quantity}`,
          })
          .where(
            and(
              eq(products.id, dbProduct.id),
              gte(products.stockQuantity, inputItem.quantity),
            ),
          )
          .returning({ id: products.id });

        if (updatedRows.length === 0) {
          throw new Error(
            `Inventory for '${dbProduct.name}' changed mid-checkout. Please try again.`,
          );
        }
      }

      const cumulativeSubtotal = cumulativeSubtotalInCents / 100;
      const shippingCost = 350.0;
      const absoluteTotal = cumulativeSubtotal + shippingCost;

      const [insertedOrder] = await tx
        .insert(orders)
        .values({
          buyerName: name,
          buyerEmail: email,
          buyerPhone: phone,
          shippingAddress: address,
          totalAmount: absoluteTotal.toFixed(2),
          shippingCost: shippingCost.toFixed(2),
          orderStatus: "pending",
          paymentStatus: "pending",
          deliveryStatus: "processing",
        })
        .returning({ id: orders.id });

      const itemsWithOrderId = itemsToInsert.map((item) => ({
        ...item,
        orderId: insertedOrder.id,
      }));

      await tx.insert(orderItems).values(itemsWithOrderId);

      await tx.insert(inventoryMovements).values(
        itemsToInsert.map((item) => ({
          productId: item.productId,
          orderId: insertedOrder.id,
          quantityChange: -item.quantity,
          type: "reservation" as const,
          reason: `Checkout reservation for order ${insertedOrder.id}`,
        })),
      );

      await tx.insert(payments).values({
        orderId: insertedOrder.id,
        gateway,
        amount: absoluteTotal.toFixed(2),
        providerReference: `pending-${insertedOrder.id}`,
        status: "pending",
      });

      return {
        orderId: insertedOrder.id,
        totalAmount: absoluteTotal,
      };
    });

    return {
      success: true,
      orderId: orderResult.orderId,
      totalAmount: orderResult.totalAmount,
      message: "Order placed successfully! Stock has been reserved.",
    };
  } catch (error: unknown) {
    console.error("Checkout transaction error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "A critical runtime error occurred during checkout.",
    };
  }
}
