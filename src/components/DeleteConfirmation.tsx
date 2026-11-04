import { useEffect } from 'react';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmation({ isOpen, onClose, onConfirm }: Readonly<DeleteConfirmationProps>) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-confirmation-title"
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full z-50"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="delete-confirmation-title" className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Confirmer la suppression&nbsp;?</h2>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            autoFocus
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
