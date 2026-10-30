"use server";

async function getMpesaAccessToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error("M-Pesa environment keys are missing from your setup.");
  }

  const authCredentials = Buffer.from(
    `${consumerKey}:${consumerSecret}`,
  ).toString("base64");

  const response = await fetch("https://safaricom.co.ke", {
    method: "GET",
    headers: {
      Authorization: `Basic ${authCredentials}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to retrieve access token from Safaricom.");
  }

  const data = await response.json();
  return data.access_token as string;
}

export async function initiateMpesaPayment(
  orderId: string,
  phone: string,
  amount: number,
) {
  try {
    const accessToken = await getMpesaAccessToken();

    const shortCode = process.env.MPESA_SHORTCODE || "174379";
    const passKey = process.env.MPESA_PASSKEY;

    if (!passKey) {
      throw new Error(
        "M-Pesa passkey is missing from your setup configuration.",
      );
    }

    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);

    const password = Buffer.from(`${shortCode}${passKey}${timestamp}`).toString(
      "base64",
    );

    const mpesaPayload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: phone,
      PartyB: shortCode,
      PhoneNumber: phone,
      CallBackURL: process.env.NEXT_PUBLIC_MPESA_CALLBACK_URL,
      AccountReference: `Order-${orderId.slice(0, 5)}`,
      TransactionDesc: "Medical Missionary Store Checkout Payment",
    };

    const response = await fetch("https://safaricom.co.ke", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mpesaPayload),
    });

    const responseData = await response.json();

    if (response.ok && responseData.ResponseCode === "0") {
      return {
        success: true,
        message:
          "An M-Pesa verification prompt has been sent directly to your screen!",
      };
    } else {
      return {
        success: false,
        message:
          responseData.CustomerMessage ||
          "Safaricom rejected the payment prompt request.",
      };
    }
  } catch (error) {
    console.error("M-Pesa execution workflow failed:", error);
    return {
      success: false,
      message:
        "A server connection issue occurred while prompting your wallet.",
    };
  }
}
