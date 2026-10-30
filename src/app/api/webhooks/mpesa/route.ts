import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, payments } from "@/db/schema";
import { eq } from "drizzle-orm";

interface MpesaMetadataItem {
  Name: string;
  Value?: string | number;
}

export async function POST(request: Request) {
  try {
    const rawData = await request.text();
    const body = JSON.parse(rawData);

    const callbackData = body.Body.stkCallback;
    const resultCode = callbackData.ResultCode;
    const checkoutRequestID = callbackData.CheckoutRequestID;
    const metadataItems: MpesaMetadataItem[] =
      callbackData.CallbackMetadata?.Item || [];

    if (resultCode === 0) {
      const amountItem = metadataItems.find((i) => i.Name === "Amount");
      const receiptItem = metadataItems.find(
        (i) => i.Name === "MpesaReceiptNumber",
      );

      await db.insert(payments).values({
        orderId: checkoutRequestID,
        gateway: "mpesa",
        amount:
          amountItem && amountItem.Value !== undefined
            ? String(amountItem.Value)
            : "0",
        status: "paid",
        providerReference:
          receiptItem && receiptItem.Value !== undefined
            ? String(receiptItem.Value)
            : checkoutRequestID,
        rawPayload: rawData,
      });

      await db
        .update(orders)
        .set({ orderStatus: "confirmed" })
        .where(eq(orders.id, checkoutRequestID));
    } else {
      await db
        .update(orders)
        .set({ orderStatus: "cancelled" })
        .where(eq(orders.id, checkoutRequestID));
    }

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Accepted successfully",
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      {
        ResultCode: 1,
        ResultDesc: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
