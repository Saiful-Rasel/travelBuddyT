// app/(commonLayout)/find-buddy/FindBuddyClient.tsx
"use client";

import { User } from "@/components/types/user";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Props {
  initialTravelers: User[];
}

export default function FindBuddyClient({ initialTravelers }: Props) {
  const [travelers] = useState(initialTravelers);
  const [location, setLocation] = useState("");
  const [interest, setInterest] = useState("");

  const filteredTravelers = travelers.filter((user) => {
    const matchesLocation = location
      ? user.currentLocation?.toLowerCase().includes(location.toLowerCase())
      : true;

    const matchesInterest = interest
      ? user.travelInterests?.some((i) =>
          i.toLowerCase().includes(interest.toLowerCase())
        )
      : true;

    return matchesLocation && matchesInterest;
  });

  return (
    <div className="min-h-screen w-full p-6 md:p-8 bg-white text-black dark:bg-black dark:text-white">
      <div className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">
            Find Your Perfect Travel Buddy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with travelers who share your interests and destinations.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <input
            type="text"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full sm:w-1/3 rounded-lg border px-4 py-2 bg-white text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-black dark:text-white dark:border-gray-700"
          />

          <input
            type="text"
            placeholder="Interest..."
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="w-full sm:w-1/3 rounded-lg border px-4 py-2 bg-white text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-black dark:text-white dark:border-gray-700"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTravelers.map((user) => (
            <div
              key={user.id}
              className="flex flex-col items-center rounded-lg border p-4 bg-white border-gray-200 shadow-sm hover:shadow-md transition dark:bg-gray-900 dark:border-gray-800"
            >
              <Image
                src={user.profileImage || "/images/download.png"}
                alt={user.fullName}
                width={120}
                height={120}
                className="rounded-full object-cover mb-3"
              />

              <h2 className="text-lg font-semibold">{user.fullName}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>

              <p className="mt-2 text-sm text-center">
                <span className="font-semibold">Interests:</span>{" "}
                {user.travelInterests?.join(", ") || "N/A"}
              </p>

              <p className="text-sm text-center">
                <span className="font-semibold">Visited:</span>{" "}
                {user.visitedCountries?.join(", ") || "N/A"}
              </p>

              {user.currentLocation && (
                <p className="text-sm text-center">
                  <span className="font-semibold">Location:</span>{" "}
                  {user.currentLocation}
                </p>
              )}

              <Link
                href={`/profile/${user.id}`}
                className="mt-4 px-4 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
