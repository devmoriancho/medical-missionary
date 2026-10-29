"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    totalAmount,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-100 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-white shadow-2xl transition duration-300 flex flex-col h-full border-l border-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Shopping Cart
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition cursor-pointer"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 text-sm font-semibold">
                  Your cart is completely empty.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 border-b border-slate-50 pb-4"
                >
                  <picture>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-16 w-16 rounded-xl object-contain bg-slate-50 border border-slate-100"
                    />
                  </picture>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.weightGrams}g per unit
                    </p>
                    <p className="text-sm font-black text-slate-900 mt-2">
                      KSh&nbsp;
                      {Number(item.priceKes).toLocaleString("en-KE", {
                        minimumFractionDigits: 2,
                      })}
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="rounded-md border border-slate-200 h-7 w-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer text-sm font-bold transition"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-slate-800 w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="rounded-md border border-slate-200 h-7 w-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer text-sm font-bold transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v4M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50 p-6 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold text-slate-500">
                  Subtotal
                </span>
                <span className="text-2xl font-black text-slate-900">
                  KSh&nbsp;
                  {totalAmount.toLocaleString("en-KE", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="block w-full rounded-2xl bg-teal-700 py-4 text-center text-base font-bold text-white hover:bg-teal-800 transition shadow-sm"
              >
                Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
