/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { getFieldError } from "@/lib/getFieldError";
import { createTravelPlan } from "@/service/travelPlan/createTravelPlan";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ItineraryItem {
  day: number;
  activity: string;
}

interface CreateTravelPlanFormProps {
  onSuccess?: () => void; // optional callback when plan is created
}

export default function CreateTravelPlanForm({onSuccess}:CreateTravelPlanFormProps) {
  const [state, formAction, isPending] = useActionState(createTravelPlan, null);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([{ day: 1, activity: "" }]);

  useEffect(() => {
    if (state?.success) {
      toast.success("Travel plan created successfully");
      setItinerary([{ day: 1, activity: "" }]);
       onSuccess?.();
    }

    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  const handleItineraryChange = (index: number, value: string) => {
    const newItinerary = [...itinerary];
    newItinerary[index].activity = value;
    setItinerary(newItinerary);
  };

  const addDay = (index: number) => {
    const newItinerary = [...itinerary];
    newItinerary.splice(index + 1, 0, { day: newItinerary.length + 1, activity: "" });
    setItinerary(newItinerary.map((item, i) => ({ ...item, day: i + 1 })));
  };

  const removeDay = (index: number) => {
    if (itinerary.length === 1) return; // always keep at least 1 day
    const newItinerary = [...itinerary];
    newItinerary.splice(index, 1);
    setItinerary(newItinerary.map((item, i) => ({ ...item, day: i + 1 })));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (itinerary.length > 0) {
      formData.append("itinerary", JSON.stringify(itinerary));
    }

    await formAction(formData);
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <FieldGroup className="space-y-3">
        {/* TITLE */}
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input name="title" placeholder="Trip to Cox's Bazar" />
          {getFieldError(state, "title") && (
            <FieldDescription className="text-red-600">
              {getFieldError(state, "title")}
            </FieldDescription>
          )}
        </Field>

        {/* DESTINATION */}
        <Field>
          <FieldLabel>Destination</FieldLabel>
          <Input name="destination" placeholder="Cox's Bazar" />
          {getFieldError(state, "destination") && (
            <FieldDescription className="text-red-600">
              {getFieldError(state, "destination")}
            </FieldDescription>
          )}
        </Field>

        {/* START DATE */}
        <Field>
          <FieldLabel>Start Date</FieldLabel>
          <Input type="date" name="startDate" />
          {getFieldError(state, "startDate") && (
            <FieldDescription className="text-red-600">
              {getFieldError(state, "startDate")}
            </FieldDescription>
          )}
        </Field>

        {/* END DATE */}
        <Field>
          <FieldLabel>End Date</FieldLabel>
          <Input type="date" name="endDate" />
          {getFieldError(state, "endDate") && (
            <FieldDescription className="text-red-600">
              {getFieldError(state, "endDate")}
            </FieldDescription>
          )}
        </Field>

        {/* MIN/MAX BUDGET */}
        <Field>
          <FieldLabel>Min Budget</FieldLabel>
          <Input type="number" name="minBudget" />
          {getFieldError(state, "minBudget") && (
            <FieldDescription className="text-red-600">
              {getFieldError(state, "minBudget")}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel>Max Budget</FieldLabel>
          <Input type="number" name="maxBudget" />
          {getFieldError(state, "maxBudget") && (
            <FieldDescription className="text-red-600">
              {getFieldError(state, "maxBudget")}
            </FieldDescription>
          )}
        </Field>

        {/* TRAVEL TYPE */}
        <Field>
          <FieldLabel>Travel Type</FieldLabel>
          <select name="travelType" className="w-full rounded border px-3 py-2">
            <option value="">Select type</option>
            <option value="SOLO">SOLO</option>
            <option value="FRIENDS">FRIENDS</option>
            <option value="FAMILY">FAMILY</option>
            <option value="COUPLE">COUPLE</option>
          </select>
          {getFieldError(state, "travelType") && (
            <FieldDescription className="text-red-600">
              {getFieldError(state, "travelType")}
            </FieldDescription>
          )}
        </Field>

        {/* DESCRIPTION */}
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Textarea name="description" />
          {getFieldError(state, "description") && (
            <FieldDescription className="text-red-600">
              {getFieldError(state, "description")}
            </FieldDescription>
          )}
        </Field>

        {/* IMAGE */}
        <Field>
          <FieldLabel>Image</FieldLabel>
          <Input type="file" name="file" accept="image/*" />
          {getFieldError(state, "file") && (
            <FieldDescription className="text-red-600">
              {getFieldError(state, "file")}
            </FieldDescription>
          )}
        </Field>

        {/* ITINERARY */}
        <Field>
          <FieldLabel>Itinerary</FieldLabel>
          {itinerary.map((item, index) => (
            <div key={index} className="flex gap-2 items-center mb-2">
              <Input
                className="flex-1"
                placeholder={`Day ${item.day} activity`}
                value={item.activity}
                onChange={(e) => handleItineraryChange(index, e.target.value)}
              />
              <Button type="button" size="sm" onClick={() => addDay(index)}>
                +
              </Button>
              <Button type="button" size="sm" onClick={() => removeDay(index)}>
                -
              </Button>
            </div>
          ))}
        </Field>

        {/* SUBMIT */}
        <FieldGroup className="mt-4">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Creating..." : "Create Plan"}
          </Button>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
}
