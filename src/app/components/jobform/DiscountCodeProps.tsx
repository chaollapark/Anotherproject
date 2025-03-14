'use client';

import { useState } from "react";

interface DiscountCodeProps {
  originalPrice: number;
  onApplyDiscount: (discountedPrice: number) => void;
}

export default function DiscountCodeInput({ originalPrice, onApplyDiscount }: DiscountCodeProps) {
  const [code, setCode] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState(originalPrice);
  const [error, setError] = useState<string | null>(null);

  const validDiscountCodes: Record<string, number> = {
    "EUOBSERVER25": 0.25,
    "SAVE25": 0.25,
  };

  const handleApply = () => {
    const discount = validDiscountCodes[code.trim().toUpperCase()];

    if (!discount) {
      setError("Invalid discount code.");
      return;
    }

    setError(null);

    let finalPrice = originalPrice;

    if (discount < 1) {
      // Percentage-based discount
      finalPrice = originalPrice * (1 - discount);
    } else {
      // Flat discount
      finalPrice = Math.max(originalPrice - discount, 0);
    }

    setDiscountedPrice(finalPrice);
    onApplyDiscount(finalPrice);
  };

  return (
    <div className="my-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code</label>
      <div className="flex items-center">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border border-gray-300 rounded-l-md px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Enter your discount code"
        />
        <button
          onClick={handleApply}
          type="button"
          className="bg-indigo-500 text-white px-4 py-2 rounded-r-md hover:bg-indigo-600 transition"
        >
          Apply
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <p className="text-gray-600 mt-2">
        {discountedPrice < originalPrice && (
          <>New Price: <span className="text-green-600 font-semibold">€{discountedPrice.toFixed(2)}</span></>
        )}
      </p>
    </div>
  );
}
