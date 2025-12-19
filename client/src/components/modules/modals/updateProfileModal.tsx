"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "@/components/types/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

export default function UpdateProfileModal({ user, onUpdate }: Props) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: user.fullName || "",
    bio: user.bio || "",
    currentLocation: user.currentLocation || "",
    travelInterests: user.travelInterests?.join(", ") || "",
    visitedCountries: user.visitedCountries?.join(", ") || "",
    profileImage: null as File | null,
    previewImage: user.profileImage || "/images/download.png",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const target = e.target as HTMLInputElement;

    if (target.files && target.files[0]) {
      const file = target.files[0];
      setForm({
        ...form,
        profileImage: file,
        previewImage: URL.createObjectURL(file),
      });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      if (form.profileImage) formData.append("file", form.profileImage);

      const dataPayload = {
        fullName: form.fullName,
        bio: form.bio,
        currentLocation: form.currentLocation,
        travelInterests: form.travelInterests.split(",").map((t) => t.trim()),
        visitedCountries: form.visitedCountries.split(",").map((c) => c.trim()),
      };

      formData.append("data", JSON.stringify(dataPayload));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${user.id}`,
        { method: "PATCH", body: formData }
      );

      if (res.ok) {
        const updatedUser = await res.json();
        toast.success("Profile updated successfully!");
        setIsOpen(false);
        onUpdate(updatedUser.data);
        router.refresh()
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex justify-center">
            <Image
              src={form.previewImage}
              alt="Profile Preview"
              className="w-32 h-32 rounded-full object-cover border"
              width={128}
              height={128}
            />
          </div>

          <input
            type="file"
            name="profileImage"
            onChange={handleChange}
            className="border p-1 rounded-md"
          />

          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="border p-2 rounded-md w-full"
          />

          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Bio"
            className="border p-2 rounded-md w-full"
          />

          <input
            type="text"
            name="currentLocation"
            value={form.currentLocation}
            onChange={handleChange}
            placeholder="Current Location"
            className="border p-2 rounded-md w-full"
          />

          <input
            type="text"
            name="travelInterests"
            value={form.travelInterests}
            onChange={handleChange}
            placeholder="Travel Interests (comma separated)"
            className="border p-2 rounded-md w-full"
          />

          <input
            type="text"
            name="visitedCountries"
            value={form.visitedCountries}
            onChange={handleChange}
            placeholder="Visited Countries (comma separated)"
            className="border p-2 rounded-md w-full"
          />
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
