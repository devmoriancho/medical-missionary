"use server";

import { db } from "@/db";
import {
  inventoryMovements,
  orderItems,
  orders,
  payments,
  products,
} from "@/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";

const checkoutInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  phone: z.string().min(9, "Valid phone number is required"),
  address: z.string().min(5, "Comprehensive address details are required"),
  gateway: z.enum(["mpesa", "stripe", "cod"]),
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, "Basket cannot be empty"),
});

export async function processSecureCheckout(rawInput: unknown) {
  try {
    const parsedData = checkoutInputSchema.parse(rawInput);
    const { name, phone, address, gateway, items } = parsedData;

    const orderResult = await db.transaction(async (tx) => {
      let cumulativeSubtotal = 0;
      const itemsToInsert = [];

      for (const item of items) {
        const productRows = await tx
          .select({
            id: products.id,
            name: products.name,
            priceKes: products.priceKes,
            stockQuantity: products.stockQuantity,
            isActive: products.isActive,
          })
          .from(products)
          .where(eq(products.id, item.id))
          .limit(1);

        const product = productRows[0];

        if (!product || !product.isActive) {
          throw new Error(
            `Product reference identifier '${item.id}' is inactive or invalid.`,
          );
        }

        if (product.stockQuantity < item.quantity) {
          throw new Error(
            `Overselling alert: '${product.name}' has insufficient stock (${product.stockQuantity} remaining).`,
          );
        }

        const updatedRows = await tx
          .update(products)
          .set({
            stockQuantity: sql`${products.stockQuantity} - ${item.quantity}`,
          })
          .where(
            and(
              eq(products.id, item.id),
              gte(products.stockQuantity, item.quantity),
            ),
          )
          .returning({ id: products.id });

        if (updatedRows.length === 0) {
          throw new Error(
            `Overselling alert: '${product.name}' is no longer available in the requested quantity.`,
          );
        }

        const itemCost = Number(product.priceKes) * item.quantity;
        cumulativeSubtotal += itemCost;

        itemsToInsert.push({
          productId: product.id,
          quantity: item.quantity,
          priceAtPurchase: product.priceKes,
          productNameSnapshot: product.name,
        });
      }

      const shippingCost = 350.0;
      const absoluteTotal = cumulativeSubtotal + shippingCost;

      const [insertedOrder] = await tx
        .insert(orders)
        .values({
          buyerName: name,
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

      const historyMovements = itemsToInsert.map((item) => ({
        productId: item.productId,
        orderId: insertedOrder.id,
        quantityChange: -item.quantity,
        type: "reservation" as const,
        reason: `Checkout initialization hold tracking marker for Order ledger row ID: ${insertedOrder.id}`,
      }));

      await tx.insert(inventoryMovements).values(historyMovements);
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
      message:
        "Order allocation footprint locked down and inventory holds reserved safely.",
    };
  } catch (error: unknown) {
    console.error("Checkout transaction failed:", error);
    const message =
      error instanceof Error
        ? error.message
        : "An unhandled error occurred while processing checkout.";
    return {
      success: false,
      message,
    };
  }
}
