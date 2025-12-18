"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";


interface DeleteTravelPlanDialogProps {
  planId: number;
  planTitle: string;
  onDelete: (id: number) => Promise<void>;
}

export default function DeleteTravelPlanDialog({
  planId,
  planTitle,
  onDelete,
}: DeleteTravelPlanDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(planId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialogPrimitive.Root>
      <AlertDialogPrimitive.Trigger asChild>
        <Button size="sm" variant="destructive">
          <Trash/>
        </Button>
      </AlertDialogPrimitive.Trigger>

      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <AlertDialogPrimitive.Content className="fixed top-[50%] left-[50%] z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
          <AlertDialogPrimitive.Title className="text-lg font-semibold">
            Delete Travel Plan
          </AlertDialogPrimitive.Title>
          <AlertDialogPrimitive.Description className="mt-2 text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{planTitle}</strong>? This action cannot be undone.
          </AlertDialogPrimitive.Description>

          <div className="mt-4 flex justify-end gap-2">
            <AlertDialogPrimitive.Cancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action asChild>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogPrimitive.Action>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
