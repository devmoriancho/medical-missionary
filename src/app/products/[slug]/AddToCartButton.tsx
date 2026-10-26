"use client";

import { useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    priceKes: string;
    imageUrl: string;
    weightGrams: number;
    stockQuantity: number;
  };
  isOutOfStock: boolean;
}

export function AddToCartButton({
  product,
  isOutOfStock,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();

  return (
    <button
      disabled={isOutOfStock}
      onClick={() =>
        addToCart({
          id: product.id,
          name: product.name,
          slug: "", // Derived or blank for internal identification mapping
          priceKes: product.priceKes,
          imageUrl: product.imageUrl,
          weightGrams: product.weightGrams,
          stockQuantity: product.stockQuantity,
        })
      }
      className={`mt-6 w-full rounded-2xl py-4 text-center text-base font-bold transition shadow-sm cursor-pointer ${
        isOutOfStock
          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
          : "bg-teal-700 text-white hover:bg-teal-800"
      }`}
    >
      {isOutOfStock ? "Product Unavailable" : "Add Item to Basket"}
    </button>
  );
}
