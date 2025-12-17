"use client";

import { useRouter } from "next/navigation";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-yellow-50 dark:bg-yellow-900 p-4">
      <h1 className="text-4xl font-bold text-yellow-800 dark:text-yellow-200 mb-4">
        ⚠️ Payment Cancelled
      </h1>
      <p className="text-lg text-yellow-700 dark:text-yellow-300 mb-6">
        You cancelled the payment process.
      </p>
      <button
        className="px-6 py-3 bg-yellow-800 text-white rounded-lg hover:bg-yellow-700 transition"
        onClick={() => router.push("/")}
      >
        Back to Home
      </button>
    </div>
  );
}
