"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import CreateTravelPlanForm from "../travel-plans/createTravelPlanClient";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded hover:bg-gray-200"
        >
          <X size={20} />
        </button>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function AdminCreateButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        <Plus size={16} /> Create Travel Plan
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h3 className="text-lg font-medium mb-4">Create Travel Plan</h3>
        <CreateTravelPlanForm onSuccess={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}
