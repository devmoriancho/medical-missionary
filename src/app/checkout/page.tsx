"use client";

import { useCart } from "@/context/CartContext";
import { processSecureCheckout } from "@/actions/checkout";
import Link from "next/link";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gateway: "mpesa" as "mpesa" | "stripe" | "cod",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

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

    let standardizedPhone = formData.phone.trim();
    if (standardizedPhone.startsWith("0")) {
      standardizedPhone = "254" + standardizedPhone.substring(1);
    } else if (standardizedPhone.startsWith("+")) {
      standardizedPhone = standardizedPhone.substring(1);
    }

    const result = await processSecureCheckout({
      name: formData.name,
      email: formData.email,
      phone: standardizedPhone,
      address: formData.address,
      gateway: formData.gateway,
      items: items.map(({ id, quantity }) => ({
        id,
        quantity: Number(quantity),
      })),
    });

    setIsSubmitting(false);
    setStatusMessage(result.message);

    if (result.success) {
      setIsSuccess(true);
      clearCart();
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 md:p-12 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-3xl border border-slate-100 max-w-md shadow-xs flex flex-col items-center">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Order Confirmed
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Your stock allocation has been successfully reserved. Please check
            your handset for any verification prompts if using mobile money
            options.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block w-full bg-teal-700 text-white text-xs font-bold py-3.5 rounded-xl hover:bg-teal-800 uppercase tracking-wider transition text-center shadow-xs"
          >
            Return to Catalog
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 md:p-12 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-3xl border border-slate-100 max-w-sm shadow-xs flex flex-col items-center">
          <p className="text-sm font-bold text-slate-900">Your cart is empty</p>
          <p className="text-xs text-slate-400 mt-1">
            Please add remedy or literature items before checking out.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block w-full bg-teal-700 text-white text-xs font-bold py-3.5 rounded-xl hover:bg-teal-800 uppercase tracking-wider transition text-center shadow-xs"
          >
            Return to Catalog
          </Link>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-8">
          Checkout
        </h1>

        <div className="grid gap-8 md:grid-cols-3">
          <form
            onSubmit={handleCheckoutSubmit}
            className="md:col-span-2 space-y-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs"
          >
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-50 pb-2">
                Delivery and Identity Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-hidden transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. john@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-hidden transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 0712345678"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-hidden transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Fulfillment Delivery Address
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. Apartment, Street name, Town or Parcel Office Location"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-hidden transition resize-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-50 pb-2">
                Payment Option Selection
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
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, gateway: "mpesa" }))
                    }
                    className="sr-only"
                  />
                  <span className="text-xs font-bold text-slate-900">
                    M-Pesa
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
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, gateway: "stripe" }))
                    }
                    className="sr-only"
                  />
                  <span className="text-xs font-bold text-slate-900">
                    Stripe
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
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, gateway: "cod" }))
                    }
                    className="sr-only"
                  />
                  <span className="text-xs font-bold text-slate-900">
                    Pay on Delivery
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-teal-700 py-4 text-center text-xs font-bold uppercase tracking-wider text-white hover:bg-teal-800 transition shadow-sm cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Processing Checkout..."
                : `Place Order - KSh ${finalTotal.toLocaleString("en-KE", { minimumFractionDigits: 2 })}`}
            </button>
          </form>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
              <h2 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-4">
                Order Summary
              </h2>
              <div className="divide-y divide-slate-50 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-3 text-xs"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-bold text-slate-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-black text-slate-900 whitespace-nowrap">
                      KSh&nbsp;
                      {(
                        Number(item.priceKes) * Number(item.quantity)
                      ).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 mt-4 pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    KSh&nbsp;
                    {totalAmount.toLocaleString("en-KE", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-slate-900">
                    KSh&nbsp;
                    {shippingCost.toLocaleString("en-KE", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-900 font-black text-sm border-t border-slate-50 pt-3 mt-1">
                  <span>Total Amount</span>
                  <span className="text-teal-700">
                    KSh&nbsp;
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
