// components/FloatingSignup.tsx
"use client";

import { useState, useEffect } from "react";
import NewsletterSignupForm from './NewsletterSignupForm';

export default function FloatingSignup() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 shadow-lg border border-gray-300 rounded-lg bg-white max-w-sm w-[320px]">
      <div className="relative p-2">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-1 right-1 text-gray-500 hover:text-black text-sm"
        >
          ✕
        </button>
        <NewsletterSignupForm />
      </div>
    </div>
  );
}
