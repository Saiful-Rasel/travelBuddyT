// app/(commonLayout)/find-buddy/page.tsx
import FindBuddyClient from "@/components/modules/findBuddy/findBuddyClient";
import { User } from "@/components/types/user";



export default async function FindBuddyPage() {
  // Fetch first page only for server-side render
  const limit = 50;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user?page=1&limit=${limit}`,
    { cache: "no-store" }
  );

  if (!res.ok) return <div>Failed to fetch users</div>;

  const data = await res.json();
  const allTravelers: User[] = data.data?.data || [];
  console.log(allTravelers)

  return <FindBuddyClient initialTravelers={allTravelers} />;
}
