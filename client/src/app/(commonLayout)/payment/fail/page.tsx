"use client";

import { useRouter } from "next/navigation";

export default function PaymentFailPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50 dark:bg-red-900 p-4">
      <h1 className="text-4xl font-bold text-red-800 dark:text-red-200 mb-4">
        ❌ Payment Failed
      </h1>
      <p className="text-lg text-red-700 dark:text-red-300 mb-6">
        Something went wrong. Please try again.
      </p>
      <button
        className="px-6 py-3 bg-red-800 text-white rounded-lg hover:bg-red-700 transition"
        onClick={() => router.push("/payment")}
      >
        Retry Payment
      </button>
    </div>
  );
}
