// Server component - fetches initial data

import ProfileClient from "@/components/modules/profile/setProfileData";
import { getUserInfo } from "@/service/auth/getUserInfo";

interface ProfilePageProps {
  params?: Promise<{ id: number }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const profileUserId = Number((await params)?.id);
  const loggedInUser = (await getUserInfo()) || undefined;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${profileUserId}`,
    { cache: "no-store" },
  );

  if (!res.ok) return <div>User not found</div>;

  const profileUser = await res.json();

  return <ProfileClient initialData={profileUser.data} loggedInUser={loggedInUser} />;
}
