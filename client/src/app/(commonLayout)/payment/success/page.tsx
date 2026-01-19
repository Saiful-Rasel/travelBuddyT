"use client";


import { useEffect } from "react";
import { toast } from "sonner";

export default function PaymentSuccessPage() {


  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const tranId = query.get("tranId");
    console.log(tranId,"transid")
    if (tranId) {
      toast.success("Payment successful!");
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Payment Successful!</h1>
    </div>
  );
}
