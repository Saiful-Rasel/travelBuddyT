/* eslint-disable @typescript-eslint/no-explicit-any */

"use server"
import ExploreClient from "@/service/explore/exploreTravler";

// export const dynamic = "force-dynamic"; // always fetch fresh data

interface ExplorePageProps {
  searchParams?: { page?: string };
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const page = Number(params?.page || 1);
  const limit = 6;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user?page=${page}&limit=${limit}`,
    { cache: "no-store" }
  );

  const json = await res.json();
  const { meta, data } = json.data;

  return <ExploreClient users={data} meta={{ ...meta, page }} />;
}
