import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical } from 'lucide-react';
import clsx from 'clsx';
import { Product, Category } from '../types';
import { DeleteConfirmation } from './DeleteConfirmation';

interface ProductItemProps {
  product: Product;
  category: Category;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProductItem({ product, category, onToggle, onDelete }: Readonly<ProductItemProps>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={clsx(
          'flex items-center p-4 rounded-lg mb-2 shadow-sm transition-colors duration-200',
          category.color,
          product.purchased && 'opacity-60'
        )}
      >
        <div {...listeners} {...attributes} className="cursor-grab">
          <GripVertical className="text-gray-600 dark:text-gray-300" />
        </div>
        <input
          type="checkbox"
          checked={product.purchased}
          onChange={() => onToggle(product.id)}
          className="ml-2 h-5 w-5 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800"
        />
        <span
          className={clsx(
            'ml-3 flex-1 transition-colors duration-200',
            product.purchased && 'line-through text-gray-500 dark:text-gray-400'
          )}
        >
          {product.name}
        </span>
        <span className="text-sm mr-4 transition-colors duration-200">{category.name}</span>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition-colors duration-200"
        >
          <Trash2 size={18} />
        </button>
      </div>
      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDelete(product.id)}
      />
    </>
  );
}