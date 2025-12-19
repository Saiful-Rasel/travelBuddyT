import Hero from "@/components/modules/home/hero";
import { getCookie } from "@/service/auth/tokenHandler";

export default async function Home() {
  const token = await getCookie("accessToken")
 
  const authResponse = await fetch(
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`,
  {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token }`, 
    },
  }
);

  const userData = await authResponse.json();
  const user = userData.data || null;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/travel-plans/feed`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  const travelPlans = data.data?.data || [];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Hero travelPlans={travelPlans} user={user} />
    </div>
  );
}
