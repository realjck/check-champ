import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical } from 'lucide-react';
import clsx from 'clsx';
import { Product, Category } from '../types';
import { DeleteConfirmation } from './DeleteConfirmation';
import { useStore } from '../store';

interface ProductItemProps {
  product: Product;
  category: Category;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateCategory: (id: string, categoryId: string) => void;
}

export function ProductItem({ 
  product, 
  category, 
  onToggle, 
  onDelete,
  onUpdateCategory 
}: ProductItemProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const { categories } = useStore();
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsEditingCategory(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: isDragging ? 'relative' : 'static',
    zIndex: isDragging ? 999 : 'auto',
  };

  const getDotColor = (colorClass: string) => {
    const baseColor = colorClass.split(' ')[0];
    const colorName = baseColor.replace(/bg-(\w+)-\d+.*/, '$1');
    return `bg-${colorName}-500`;
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={clsx(
          'flex items-center p-4 rounded-lg mb-2 shadow-sm transition-colors duration-200',
          !product.purchased && category.color
        )}
      >
        <div {...listeners} {...attributes} className="cursor-grab">
          <GripVertical className="text-gray-600 dark:text-gray-300" />
        </div>
        <input
          type="checkbox"
          checked={product.purchased}
          onChange={() => onToggle(product.id)}
          className="ml-3 h-7 w-7 rounded border-gray-300 dark:border-gray-600 accent-black dark:accent-white"
        />
        <span
          className={clsx(
            'ml-3 text-xl flex-1 transition-colors duration-200 max-w-[100%] truncate',
            product.purchased && 'line-through text-gray-500 dark:text-gray-400'
          )}
        >
          {product.name}
        </span>
        
        <div className="relative" ref={categoryRef}>
          <span
            onClick={() => setIsEditingCategory(true)}
            className="text-sm mr-4 cursor-pointer hover:underline transition-colors duration-200 flex items-center gap-2"
            title="Click to change category"
          >
            <span className={clsx(
              'w-6 h-6 rounded-full inline-block mr-2',
              getDotColor(category.color)
            )} />
            {category.name}
          </span>

          {isEditingCategory && (
            <div 
              className="absolute z-10 right-4 mt-1 rounded-md bg-white dark:bg-gray-700 shadow-lg overflow-hidden"
              style={{
                top: '100%',
              }}
            >
              <div className="flex flex-row">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={clsx(
                      'flex items-center px-4 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white',
                      cat.id === category.id && 'bg-gray-50 dark:bg-gray-600'
                    )}
                    onClick={() => {
                      onUpdateCategory(product.id, cat.id);
                      setIsEditingCategory(false);
                    }}
                  >
                    <span className={clsx(
                      'w-6 h-6 rounded-full inline-block',
                      getDotColor(cat.color)
                    )} />
                    <span>{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={() => setShowDeleteModal(true)}
          className="text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition-colors duration-200"
        >
          <Trash2 size={22} />
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