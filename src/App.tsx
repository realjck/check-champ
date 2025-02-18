import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Moon, Sun } from 'lucide-react';
import { useStore } from './store';
import { ProductItem } from './components/ProductItem';

function App() {
  const [newProductName, setNewProductName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { 
    products, 
    categories, 
    isDarkMode,
    addProduct, 
    toggleProduct, 
    deleteProduct, 
    reorderProducts,
    toggleTheme 
  } = useStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = products.findIndex((p) => p.id === active.id);
      const newIndex = products.findIndex((p) => p.id === over.id);
      const newProducts = arrayMove(products, oldIndex, newIndex).map(
        (product, index) => ({ ...product, order: index })
      );
      reorderProducts(newProducts);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProductName.trim() && selectedCategory) {
      addProduct(newProductName.trim(), selectedCategory);
      setNewProductName('');
      setSelectedCategory('');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (a.purchased !== b.purchased) return a.purchased ? 1 : -1;
    return a.order - b.order;
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 transition-colors duration-200">
      <div className="max-w-3xl mx-auto relative">
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <Moon className="w-6 h-6 text-white" />
        ) : (
          <Sun className="w-6 h-6 text-yellow-500" />
        )}
      </button>

        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Shopping List</h1>
        
        <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex gap-4">
            <input
              type="text"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="Add new item"
              className="flex-1 p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!newProductName.trim() || !selectedCategory}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus size={18} />
              Add
            </button>
          </div>
        </form>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedProducts}
            strategy={verticalListSortingStrategy}
          >
            <div>
              {sortedProducts.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  category={categories.find((c) => c.id === product.categoryId)!}
                  onToggle={toggleProduct}
                  onDelete={deleteProduct}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

export default App;