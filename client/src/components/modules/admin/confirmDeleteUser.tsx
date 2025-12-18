"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"; 

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ConfirmDeleteModalProps {
  userId: number;
  userName: string;
  onDeleted: () => void; 
}

export default function ConfirmDeleteModal({
  userId,
  userName,
  onDeleted,
}: ConfirmDeleteModalProps) {
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/user/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("User deleted successfully!");
        onDeleted();
      } else {
        toast.error(`Failed to delete user: ${data.message}`);
      }
    } catch (err) {
      toast.error("Something went wrong while deleting user!");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Are you sure you want to delete <strong>{userName}</strong>?
        </AlertDialogDescription>
        <AlertDialogFooter className="mt-4 flex justify-end gap-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
