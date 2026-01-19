"use server";

import SubscriberTable from "@/components/modules/admin/subscription";
import { getCookie } from "@/service/auth/tokenHandler";

export default async function NewsletterPage() {
  const token = await getCookie("accessToken");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newsletter/admin/list`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  console.log(res);

  const data = await res.json();
  const subscribers = data.data || [];


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Newsletter Subscribers</h1>
      <SubscriberTable initialSubscribers={subscribers} />
    </div>
  );
}
