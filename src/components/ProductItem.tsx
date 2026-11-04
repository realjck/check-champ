import { useState, useRef, useEffect, CSSProperties } from 'react';
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

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: isDragging ? 'relative' : 'static',
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={clsx(
          'flex items-center touch-pan-y p-3 rounded-lg mb-2 shadow-sm transition-colors duration-200',
          !product.purchased && category.color
        )}
      >
        {/* Conteneur du grip avec pointer-events: all */}
        <div
          {...listeners}
          {...attributes}
          aria-label={`Déplacer ${product.name}`}
          className="cursor-grab"
          style={{ pointerEvents: 'all', touchAction: 'none' }} // Capture les événements sur les pixels transparents
        >
          <GripVertical className="h-7 w-7 mr-1 text-gray-600 dark:text-gray-300" />
        </div>

        {/* Checkbox pour marquer le produit comme acheté */}
        <input
          type="checkbox"
          checked={product.purchased}
          onChange={() => onToggle(product.id)}
          aria-label={`Marquer ${product.name} comme acheté`}
          className="h-7 w-7 rounded border-gray-300 dark:border-gray-600 accent-black dark:accent-white"
        />

        {/* Nom du produit */}
        <span
          className={clsx(
            'ml-2 text-xl flex-1 pb-1 -mb-1 transition-colors duration-200 max-w-[100%] truncate',
            product.purchased && 'line-through text-gray-500 dark:text-gray-400'
          )}
        >
          {product.name}
        </span>

        {/* Sélecteur de catégorie */}
        <div className="relative" ref={categoryRef}>
          <button
            type="button"
            onClick={() => setIsEditingCategory(true)}
            className="text-sm mr-2 cursor-pointer hover:underline transition-colors duration-200 flex items-center gap-2"
            title="Changer la catégorie"
            aria-label={`Catégorie ${category.label}, changer la catégorie`}
            aria-haspopup="true"
            aria-expanded={isEditingCategory}
          >
            <span className={clsx(
              'w-6 h-6 rounded-full inline-block mr-2',
              category.dotColor
            )} />
            {category.name}
          </button>

          {/* Menu déroulant pour changer de catégorie */}
          {isEditingCategory && (
            <div 
              className="absolute z-10 right-0 mt-1 rounded-md bg-white dark:bg-gray-700 shadow-lg overflow-hidden"
              style={{
                top: '100%',
              }}
            >
              <div className="flex flex-row">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    aria-label={`Catégorie ${cat.label}`}
                    aria-pressed={cat.id === category.id}
                    className={clsx(
                      'flex items-center px-4 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white',
                      cat.id === category.id && 'bg-gray-100 dark:bg-gray-600'
                    )}
                    onClick={() => {
                      onUpdateCategory(product.id, cat.id);
                      setIsEditingCategory(false);
                    }}
                  >
                    <span className={clsx(
                      'w-6 h-6 rounded-full inline-block',
                      cat.dotColor
                    )} />
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bouton de suppression */}
        <button
          onClick={() => setShowDeleteModal(true)}
          aria-label={`Supprimer ${product.name}`}
          className="text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition-colors duration-200"
        >
          <Trash2 size={22} />
        </button>
      </div>

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDelete(product.id)}
      />
    </>
  );
}