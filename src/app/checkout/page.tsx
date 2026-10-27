"use client";

import { useCart } from "@/context/CartContext";
import { processSecureCheckout } from "@/actions/checkout";
import { MissionLogo } from "@/components/icons/logo";
import { MpesaIcon } from "@/components/icons/mpesa";
import { StripeIcon } from "@/components/icons/stripe";
import { CodIcon } from "@/components/icons/cod";
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
          <div className="rounded-full bg-teal-50 p-4 text-teal-700 mb-4">
            <MissionLogo size={48} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Order Allocation Locked
          </h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Your medical missionary order footprint has been reserved safely in
            memory. Please complete validation steps on your handset if mobile
            money prompts appear.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block w-full bg-teal-700 text-white font-bold py-3.5 rounded-xl hover:bg-teal-800 transition text-center shadow-xs"
          >
            Return to Store Catalogue
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 md:p-12 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-3xl border border-slate-100 max-w-sm shadow-xs flex flex-col items-center">
          <p className="text-lg font-bold text-slate-900">
            Your basket is empty
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Add loose herbs or natural remedy items before checking out.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block w-full bg-teal-700 text-white font-bold py-3.5 rounded-xl hover:bg-teal-800 transition text-center shadow-xs"
          >
            Return to Store Catalogue
          </Link>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <MissionLogo size={36} className="text-teal-700" />
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Secure Checkout Station
          </h1>
        </div>

        {statusMessage && (
          <div className="mb-6 rounded-xl bg-teal-50 p-4 text-sm font-semibold text-teal-800">
            {statusMessage}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          <form
            onSubmit={handleCheckoutSubmit}
            className="md:col-span-2 space-y-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs"
          >
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-50 pb-2">
                1. Delivery and Identity Records
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
                    Email Address (For Ledger Receipts)
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. john@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-hidden transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Mobile Number (For M-Pesa Verification)
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
                    Fulfillment Delivery Address Waypoints
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. Apartment Suite, Street name, Town or Parcel Office Location"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-hidden transition resize-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-50 pb-2">
                2. Automated Payment Strategy Selection
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                <label
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition context-box cursor-pointer text-center ${formData.gateway === "mpesa" ? "border-teal-700 bg-teal-50/30" : "border-slate-100 bg-slate-50/30 hover:border-slate-200"}`}
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
                  <MpesaIcon className="text-emerald-600 mb-2" />
                  <span className="text-sm font-bold text-slate-900">
                    M-Pesa
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    STK Push Verification
                  </span>
                </label>

                <label
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition context-box cursor-pointer text-center ${formData.gateway === "stripe" ? "border-teal-700 bg-teal-50/30" : "border-slate-100 bg-slate-50/30 hover:border-slate-200"}`}
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
                  <StripeIcon className="text-indigo-600 mb-2" />
                  <span className="text-sm font-bold text-slate-900">
                    Stripe
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    International Cards
                  </span>
                </label>

                <label
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition context-box cursor-pointer text-center ${formData.gateway === "cod" ? "border-teal-700 bg-teal-50/30" : "border-slate-100 bg-slate-50/30 hover:border-slate-200"}`}
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
                  <CodIcon className="text-slate-600 mb-2" />
                  <span className="text-sm font-bold text-slate-900">
                    Delivery Pay
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    Pay Upon Reception
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
                ? "Locking order allocations down..."
                : `Authorize Payment of KSh ${finalTotal.toLocaleString("en-KE", { minimumFractionDigits: 2 })}`}
            </button>
          </form>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
              <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-4">
                Remedy Investment Ledger
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
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <span className="font-black text-slate-900 whitespace-nowrap">
                      KSh{" "}
                      {(
                        Number(item.priceKes) * Number(item.quantity)
                      ).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
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
