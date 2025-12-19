"use server";

import ExploreClient from "@/service/explore/exploreTravler";

interface ExplorePageProps {
  searchParams?: { page?: string };
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const page = Number(params?.page || 1);
  const limit = 6;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user?page=${page}&limit=${limit}`,
    { cache: "no-store" }
  );

  const json = await res.json();

  const { meta, data } = json.data || { meta: {}, data: [] };

  return <ExploreClient users={data} meta={{ ...meta, page }} />;
}
