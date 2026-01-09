interface Props {
  isOpen: boolean;
  onClose: () => void;
  rating: number;
  comment: string;
  onChangeRating: (val: number) => void;
  onChangeComment: (val: string) => void;
  onSubmit: () => void;
}

export default function EditModal({
  isOpen,
  onClose,
  rating,
  comment,
  onChangeRating,
  onChangeComment,
  onSubmit,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-20">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Review</h2>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => onChangeRating(star)}>
              <span
                className={`text-2xl ${
                  star <= rating ? "text-yellow-400" : "text-gray-400"
                }`}
              >
                ★
              </span>
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => onChangeComment(e.target.value)}
          rows={3}
          className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded border">
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
