"use client";

import { useCart } from "@/context/CartContext";
import { processSecureCheckout } from "@/actions/checkout";
import Link from "next/link";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    gateway: "mpesa",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const shippingCost = items.length > 0 ? 350 : 0;
  const finalTotal = totalAmount + shippingCost;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setStatusMessage("");

    const result = await processSecureCheckout({
      ...formData,
      items: items.map(({ id, quantity }) => ({ id, quantity })),
    });

    setIsSubmitting(false);
    setStatusMessage(result.message);

    if (result.success) {
      clearCart();
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 md:p-12 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-3xl border border-slate-100 max-w-sm shadow-xs">
          <p className="text-lg font-bold text-slate-900">
            Your basket is empty
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Add items from the store catalogue before checking out.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block w-full bg-teal-700 text-white font-bold py-3 rounded-xl hover:bg-teal-800 transition"
          >
            Return to Catalogue
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-8">
          Secure Checkout
        </h1>
        {statusMessage && (
          <p className="mb-6 rounded-xl bg-teal-50 p-4 text-sm font-semibold text-teal-800">
            {statusMessage}
          </p>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          <form
            onSubmit={handleCheckoutSubmit}
            className="md:col-span-2 space-y-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs"
          >
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-50 pb-2">
                1. Delivery Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-hidden transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Phone Number (For M-Pesa STK)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 0712345678"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-hidden transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Shipping Address Details
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. Apartment Suite, Street name, Town or Town Area details"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-hidden transition resize-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-50 pb-2">
                2. Settlement Strategy
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                <label
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition cursor-pointer text-center ${formData.gateway === "mpesa" ? "border-teal-700 bg-teal-50/30" : "border-slate-100 bg-slate-50/30 hover:border-slate-200"}`}
                >
                  <input
                    type="radio"
                    name="gateway"
                    value="mpesa"
                    checked={formData.gateway === "mpesa"}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-bold text-slate-900">
                    M-Pesa
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 font-medium">
                    STK Push Verification
                  </span>
                </label>

                <label
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition cursor-pointer text-center ${formData.gateway === "stripe" ? "border-teal-700 bg-teal-50/30" : "border-slate-100 bg-slate-50/30 hover:border-slate-200"}`}
                >
                  <input
                    type="radio"
                    name="gateway"
                    value="stripe"
                    checked={formData.gateway === "stripe"}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-bold text-slate-900">
                    Stripe
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 font-medium">
                    International Cards
                  </span>
                </label>

                <label
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition cursor-pointer text-center ${formData.gateway === "cod" ? "border-teal-700 bg-teal-50/30" : "border-slate-100 bg-slate-50/30 hover:border-slate-200"}`}
                >
                  <input
                    type="radio"
                    name="gateway"
                    value="cod"
                    checked={formData.gateway === "cod"}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-bold text-slate-900">
                    Cash on Delivery
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 font-medium">
                    Pay upon reception
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-teal-700 py-4 text-center text-base font-bold text-white hover:bg-teal-800 transition shadow-sm cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Locking down order records..."
                : `Authorize Payment of KSh ${finalTotal.toLocaleString("en-KE", { minimumFractionDigits: 2 })}`}
            </button>
          </form>


          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
              <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-4">
                Investment Ledger
              </h2>
              <div className="divide-y divide-slate-50 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-3 text-sm"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-bold text-slate-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Quantity: {item.quantity} units
                      </p>
                    </div>
                    <span className="font-black text-slate-900 whitespace-nowrap">
                      KSh{" "}
                      {(Number(item.priceKes) * item.quantity).toLocaleString(
                        "en-KE",
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 mt-4 pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Cart Subtotal</span>
                  <span>
                    KSh{" "}
                    {totalAmount.toLocaleString("en-KE", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Dynamic Courier Fee</span>
                  <span>
                    KSh{" "}
                    {shippingCost.toLocaleString("en-KE", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-900 font-black text-base border-t border-slate-50 pt-3 mt-1">
                  <span>Total Amount</span>
                  <span className="text-teal-700">
                    KSh{" "}
                    {finalTotal.toLocaleString("en-KE", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
