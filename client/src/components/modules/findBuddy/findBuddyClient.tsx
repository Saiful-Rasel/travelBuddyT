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
  const [travelers, setTravelers] = useState(initialTravelers);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [interest, setInterest] = useState("");

  // Filter function
  const filteredTravelers = travelers.filter((user) => {

    const matchesLocation = location
      ? user.currentLocation?.toLowerCase().includes(location.toLowerCase())
      : true;
    const matchesInterest = interest
      ? user.travelInterests?.some((i) => i.toLowerCase().includes(interest.toLowerCase()))
      : true;

    return  matchesLocation && matchesInterest;
  });

  return (
    <div className="max-w-7xl mx-auto mt-24 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Find Your Perfect Travel Buddy</h1>
        <p className="text-gray-600">
          Connect with travelers who share your interests and destinations.
        </p>
      </div>

   
      <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
      
        <input
          type="text"
          placeholder="Location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Interest..."
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Travel Buddy Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredTravelers.map((user) => (
          <div
            key={user.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col items-center"
          >
            <Image
              src={user.profileImage || "/images/download.png"}
              alt={user.fullName}
              width={120}
              height={120}
              className="rounded-full object-cover mb-3"
            />
            <h2 className="text-lg font-semibold">{user.fullName}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>

            <p className="mt-2 text-sm">
              <strong>Interests:</strong> {user.travelInterests?.join(", ") || "N/A"}
            </p>

            <p className="text-sm">
              <strong>Visited:</strong> {user.visitedCountries?.join(", ") || "N/A"}
            </p>

            {user.currentLocation && (
              <p className="text-sm">
                <strong>Location:</strong> {user.currentLocation}
              </p>
            )}

            <Link
              href={`/profile/${user.id}`}
              className="mt-3 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
