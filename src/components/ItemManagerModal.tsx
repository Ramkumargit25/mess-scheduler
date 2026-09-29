import React, { useState } from 'react';
import { X, Plus, Trash2, RotateCcw, Check, Sparkles } from 'lucide-react';
import type { FoodItem } from '../types';
import { DEFAULT_FOOD_ITEMS } from '../data/defaultItems';

interface ItemManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: FoodItem[];
  onSaveItems: (items: FoodItem[]) => void;
}

export const ItemManagerModal: React.FC<ItemManagerModalProps> = ({
  isOpen,
  onClose,
  items,
  onSaveItems,
}) => {
  const [editingItems, setEditingItems] = useState<FoodItem[]>(items);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState<number>(20);
  const [newItemUnit, setNewItemUnit] = useState('piece');
  const [newItemCategory, setNewItemCategory] = useState<'breakfast' | 'lunch' | 'dinner' | 'all'>('all');
  const [successToast, setSuccessToast] = useState(false);

  if (!isOpen) return null;

  // Handle price change for an existing item
  const handlePriceChange = (id: string, newPrice: number) => {
    setEditingItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, price: Math.max(0, newPrice) } : item
      )
    );
  };

  // Add new food item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || newItemPrice < 0) return;

    const id = `item_${Date.now()}`;
    const newItem: FoodItem = {
      id,
      name: newItemName.trim(),
      price: newItemPrice,
      unit: newItemUnit.trim() || 'piece',
      category: newItemCategory,
      isCustom: true,
    };

    const updated = [...editingItems, newItem];
    setEditingItems(updated);
    onSaveItems(updated);

    // Reset inputs
    setNewItemName('');
    setNewItemPrice(20);
    showToast();
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    const updated = editingItems.filter(item => item.id !== id);
    setEditingItems(updated);
    onSaveItems(updated);
  };

  // Reset to original defaults
  const handleResetDefaults = () => {
    if (window.confirm('Reset all food items and prices back to default values?')) {
      setEditingItems(DEFAULT_FOOD_ITEMS);
      onSaveItems(DEFAULT_FOOD_ITEMS);
      showToast();
    }
  };

  // Save changes
  const handleSaveAll = () => {
    onSaveItems(editingItems);
    showToast();
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const showToast = () => {
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Manage Mess Food & Price Catalog
            </h3>
            <p className="text-xs text-slate-500">
              Adjust default rates or add new items to your daily mess menu
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Add New Item Form */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Add Custom Mess Item
            </h4>
            <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="Food name (e.g. Parotta, Coffee)"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Price"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    required
                    className="w-full text-xs pl-6 pr-2.5 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <select
                  value={newItemUnit}
                  onChange={(e) => setNewItemUnit(e.target.value)}
                  className="w-full text-xs px-2 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="piece">piece</option>
                  <option value="plate">plate</option>
                  <option value="cup">cup</option>
                  <option value="item">item</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as any)}
                  className="w-full text-xs px-2 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="all">All Meals</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full h-full min-h-[34px] px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 shadow-xs transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </form>
          </div>

          {/* Current Items List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Current Menu & Rates ({editingItems.length} items)
              </span>
              <button
                onClick={handleResetDefaults}
                className="text-xs font-medium text-slate-500 hover:text-rose-600 flex items-center transition"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Reset Defaults
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {editingItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-white flex items-center justify-between hover:bg-slate-50/70 transition"
                >
                  <div>
                    <div className="font-semibold text-xs sm:text-sm text-slate-800">
                      {item.name}
                      {item.isCustom && (
                        <span className="ml-2 text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                          Custom
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 capitalize">
                      Unit: {item.unit || 'piece'}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                      <span className="text-xs font-semibold text-slate-500">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={(e) => handlePriceChange(item.id, Number(e.target.value))}
                        className="w-16 text-xs font-bold text-slate-800 bg-transparent text-right focus:outline-none"
                      />
                    </div>

                    {item.isCustom && (
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        title="Delete item"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            {successToast && (
              <span className="text-xs text-emerald-700 font-semibold flex items-center animate-fade-in">
                <Check className="w-4 h-4 mr-1 text-emerald-600" />
                Saved successfully!
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-200 transition"
            >
              Save All Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
