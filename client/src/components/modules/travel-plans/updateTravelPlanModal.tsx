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
import { TravelPlan, ItineraryItem } from "@/components/types/travelPlan";

interface FormItineraryItem {
  day: number;
  activity: string;
}

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: TravelPlan;
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function UpdateModal({ isOpen, onClose, initialData, onSubmit }: UpdateModalProps) {
  const mapToFormItinerary = (itinerary: ItineraryItem[]): FormItineraryItem[] =>
    itinerary.length
      ? itinerary.map((item) => ({ day: item.day, activity: item.title ?? "" }))
      : [{ day: 1, activity: "" }];

  const [formData, setFormData] = useState({
    ...initialData,
    minBudget: Number(initialData.minBudget) || 0,
    maxBudget: Number(initialData.maxBudget) || 0,
    itinerary: mapToFormItinerary(initialData.itinerary),
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData({
      ...initialData,
      minBudget: Number(initialData.minBudget) || 0,
      maxBudget: Number(initialData.maxBudget) || 0,
      itinerary: mapToFormItinerary(initialData.itinerary),
    });
    setImageFile(null);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "minBudget" || name === "maxBudget") {
      setFormData((prev) => ({ ...prev, [name]: value === "" ? 0 : Number(value) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
  };

  const handleItineraryChange = (index: number, value: string) => {
    const updated = [...formData.itinerary];
    updated[index].activity = value || "";

    if (index === updated.length - 1 && value.trim() !== "") {
      updated.push({ day: updated.length + 1, activity: "" });
    }

    setFormData((prev) => ({ ...prev, itinerary: updated }));
  };

  const mapToApiItinerary = (itinerary: FormItineraryItem[]): ItineraryItem[] =>
    itinerary
      .filter((i) => typeof i.activity === "string" && i.activity.trim() !== "")
      .map((i, idx) => ({ day: idx + 1, title: i.activity.trim() }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        minBudget: Number(formData.minBudget),
        maxBudget: Number(formData.maxBudget),
        travelType: formData.travelType,
        description: formData.description || "",
        itinerary: mapToApiItinerary(formData.itinerary),
      };

      const fd = new FormData();
      fd.append("data", JSON.stringify(payload));
      if (imageFile) fd.append("file", imageFile);

      await onSubmit(fd);
      toast.success("Travel plan updated successfully");
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
          <div>
            <Label>Title</Label>
            <Input name="title" value={formData.title} onChange={handleChange} />
          </div>

          <div>
            <Label>Destination</Label>
            <Input name="destination" value={formData.destination} onChange={handleChange} />
          </div>

          <div>
            <Label>Start Date</Label>
            <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
          </div>

          <div>
            <Label>End Date</Label>
            <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
          </div>

          <div>
            <Label>Min Budget</Label>
            <Input type="number" name="minBudget" value={formData.minBudget} onChange={handleChange} />
          </div>

          <div>
            <Label>Max Budget</Label>
            <Input type="number" name="maxBudget" value={formData.maxBudget} onChange={handleChange} />
          </div>

          <div>
            <Label>Travel Type</Label>
            <select
              name="travelType"
              value={formData.travelType}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">Select</option>
              <option value="SOLO">SOLO</option>
              <option value="FRIENDS">FRIENDS</option>
              <option value="FAMILY">FAMILY</option>
              <option value="COUPLE">COUPLE</option>
            </select>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea name="description" value={formData.description || ""} onChange={handleChange} />
          </div>

          <div>
            <Label>Image</Label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="space-y-2">
            <Label>Itinerary</Label>
            {formData.itinerary.map((item, idx) => (
              <Input
                key={idx}
                placeholder={`Day ${item.day} activity`}
                value={item.activity}
                onChange={(e) => handleItineraryChange(idx, e.target.value)}
              />
            ))}
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
