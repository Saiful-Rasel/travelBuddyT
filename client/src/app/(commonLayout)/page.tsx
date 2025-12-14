import Hero from "@/components/modules/home/hero";


export default async function Home() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/travel-plans/feed`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  const travelPlans = data.data?.data || [];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Hero travelPlans={travelPlans} />
    </div>
  );
}
