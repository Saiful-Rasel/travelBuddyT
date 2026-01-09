interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteModal({ isOpen, onClose, onDelete }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-20">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-80">
        <h2 className="text-lg font-semibold mb-4 text-red-600">
          Delete Review?
        </h2>
        <p className="mb-4">Are you sure you want to delete this review?</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded border">
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
