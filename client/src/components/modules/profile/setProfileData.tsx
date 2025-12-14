"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "@/components/types/user";
import UpdateProfileModal from "../modals/updateProfileModal";

interface Props {
  initialData: User;
  loggedInUser?: User;
}

export default function ProfileClient({ initialData, loggedInUser }: Props) {
  const [profileData, setProfileData] = useState(initialData);

  const isOwnProfile = loggedInUser?.id === profileData.id;

  return (
    <div className="max-w-4xl mx-auto mt-24 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        {profileData.fullName} Profile
      </h1>

      <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
        {/* Profile Image */}
        <div className="flex justify-center w-full md:w-1/3">
          <Image
            src={profileData.profileImage || "/images/download.png"}
            alt={profileData.fullName}
            width={160}
            height={160}
            className="rounded-full w-32 h-32 sm:w-40 sm:h-40 object-cover border"
          />
        </div>

        {/* Profile Info */}
        <div className="w-full md:w-2/3 space-y-3 text-center md:text-left">
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
          <p>
            <strong>Bio:</strong> {profileData.bio || "N/A"}
          </p>
          <p>
            <strong>Current Location:</strong> {profileData.currentLocation || "N/A"}
          </p>
          <p>
            <strong>Travel Interests:</strong> {profileData.travelInterests?.join(", ") || "N/A"}
          </p>
          <p>
            <strong>Visited Countries:</strong> {profileData.visitedCountries?.join(", ") || "N/A"}
          </p>

          {isOwnProfile && (
            <div className="mt-4 flex justify-center md:justify-start">
              <UpdateProfileModal
                user={profileData}
                onUpdate={(updatedUser) => setProfileData(updatedUser)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
