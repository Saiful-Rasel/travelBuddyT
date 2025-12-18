import UserTableClient from "@/components/modules/admin/userManagementAdminTable";
import { getCookie } from "@/service/auth/tokenHandler";

export default async function UserPage() {
  const token = await getCookie("accessToken")
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users?limit=1000`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  );
  const data = await res.json();

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4 text-center">User Management</h1>

      <UserTableClient initialUsers={data?.data?.data} />
    </div>
  );
}
