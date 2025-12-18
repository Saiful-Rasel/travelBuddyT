/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ItineraryItem {
  day: number;
  activity: string;
}

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    id: number;
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    minBudget?: number;
    maxBudget?: number;
    travelType: string;
    description?: string;
    image?: string | null;
    itinerary?: ItineraryItem[] | null;
  };
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function UpdateModal({ isOpen, onClose, initialData, onSubmit }: UpdateModalProps) {
  const [formData, setFormData] = useState({
    ...initialData,
    itinerary: Array.isArray(initialData.itinerary) ? initialData.itinerary : [{ day: 1, activity: "" }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    setFormData({
      ...initialData,
      itinerary: Array.isArray(initialData.itinerary) ? initialData.itinerary : [{ day: 1, activity: "" }],
    });
    setImageFile(null);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleItineraryChange = (index: number, value: string) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index].activity = value;
    setFormData(prev => ({ ...prev, itinerary: newItinerary }));

    if (index === formData.itinerary.length - 1 && value.trim() !== "") {
      newItinerary.push({ day: newItinerary.length + 1, activity: "" });
      setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const filteredItinerary = formData.itinerary
        .filter(item => item.activity.trim() !== "")
        .map((item, idx) => ({ day: idx + 1, activity: item.activity }));

      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify({
        title: formData.title,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        minBudget: formData.minBudget || 0,
        maxBudget: formData.maxBudget || 0,
        travelType: formData.travelType,
        description: formData.description || "",
        itinerary: filteredItinerary,
      }));

      if (imageFile) formDataToSend.append("file", imageFile);

      await onSubmit(formDataToSend);
      toast.success("Travel plan updated successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-auto">
    <DialogHeader>
      <DialogTitle>Update Travel Plan</DialogTitle>
      <DialogDescription>Update your travel plan details below.</DialogDescription>
    </DialogHeader>

    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="destination">Destination</Label>
        <Input id="destination" name="destination" value={formData.destination} onChange={handleChange} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="startDate">Start Date</Label>
        <Input id="startDate" type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="endDate">End Date</Label>
        <Input id="endDate" type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="minBudget">Min Budget</Label>
        <Input id="minBudget" type="number" name="minBudget" value={formData.minBudget || ""} onChange={handleChange} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="maxBudget">Max Budget</Label>
        <Input id="maxBudget" type="number" name="maxBudget" value={formData.maxBudget || ""} onChange={handleChange} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="travelType">Travel Type</Label>
        <select
          id="travelType"
          name="travelType"
          value={formData.travelType}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
        >
          <option value="">Select type</option>
          <option value="SOLO">SOLO</option>
          <option value="FRIENDS">FRIENDS</option>
          <option value="FAMILY">FAMILY</option>
          <option value="COUPLE">COUPLE</option>
        </select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description || ""} onChange={handleChange} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="image">Travel Plan Image</Label>
        <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <div className="space-y-2">
        <Label>Itinerary</Label>
        {formData.itinerary.map((item, index) => (
          <Input
            key={index}
            placeholder={`Day ${item.day} Activity`}
            value={item.activity}
            onChange={(e) => handleItineraryChange(index, e.target.value)}
          />
        ))}
      </div>

      <DialogFooter className="flex justify-end gap-2 mt-4 sticky bottom-0 bg-white pt-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Updating..." : "Update"}</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>

  );
}
