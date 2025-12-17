"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const tranId = query.get("tran_id");
    if (tranId) {
      toast.success("Payment successful!");
      // Optional: verify with backend API
      // router.push("/ai-itinerary/use");
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Payment Successful!</h1>
    </div>
  );
}
