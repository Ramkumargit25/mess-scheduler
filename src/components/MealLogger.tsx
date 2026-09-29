import React, { useState } from 'react';
import { 
  Sunrise, 
  Sun, 
  Sunset, 
  Plus, 
  Minus, 
  Trash2, 
  PlusCircle, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import type { FoodItem, MealType, DayRecord } from '../types';
import { formatCurrency, formatDisplayDate, calculateMealSubtotal, calculateDayTotal } from '../utils/calculations';

interface MealLoggerProps {
  selectedDate: string;
  dayRecord?: DayRecord;
  availableItems: FoodItem[];
  onUpdateDayRecord: (record: DayRecord) => void;
  onSelectDate: (date: string) => void;
}

export const MealLogger: React.FC<MealLoggerProps> = ({
  selectedDate,
  dayRecord,
  availableItems,
  onUpdateDayRecord,
  onSelectDate,
}) => {
  // Active meal card (tab or all expanded)
  const [activeTab, setActiveTab] = useState<'all' | 'breakfast' | 'lunch' | 'dinner'>('all');
  
  // Custom quick-add state
  const [quickAddMeal, setQuickAddMeal] = useState<MealType | null>(null);
  const [quickName, setQuickName] = useState('');
  const [quickPrice, setQuickPrice] = useState<number>(20);
  const [quickQty, setQuickQty] = useState<number>(1);

  // Initialize or fetch current day record
  const currentRecord: DayRecord = dayRecord || {
    date: selectedDate,
    breakfast: { items: [], subtotal: 0 },
    lunch: { items: [], subtotal: 0 },
    dinner: { items: [], subtotal: 0 },
    dailyTotal: 0,
  };

  // Helper to get consumed quantity of an item in a specific meal
  const getItemQuantity = (mealType: MealType, itemId: string): number => {
    const item = currentRecord[mealType].items.find(i => i.itemId === itemId);
    return item ? item.quantity : 0;
  };

  // Modify item quantity in real time and recalculate all subtotals
  const updateItemQuantity = (mealType: MealType, item: FoodItem, delta: number) => {
    const meal = currentRecord[mealType];
    const existingIndex = meal.items.findIndex(i => i.itemId === item.id);
    let newItems = [...meal.items];

    if (existingIndex >= 0) {
      const currentQty = newItems[existingIndex].quantity;
      const newQty = Math.max(0, currentQty + delta);
      if (newQty === 0) {
        newItems.splice(existingIndex, 1);
      } else {
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newQty,
          price: item.price, // ensure latest price
        };
      }
    } else if (delta > 0) {
      newItems.push({
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: delta,
        unit: item.unit || 'piece',
      });
    }

    const newSubtotal = newItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const updatedRecord: DayRecord = {
      ...currentRecord,
      [mealType]: {
        ...meal,
        items: newItems,
        subtotal: newSubtotal,
      },
    };

    updatedRecord.dailyTotal = calculateDayTotal(updatedRecord);
    onUpdateDayRecord(updatedRecord);
  };

  // Quick add a one-off item directly to the current meal
  const handleQuickAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddMeal || !quickName.trim() || quickPrice < 0 || quickQty <= 0) return;

    const customItemId = `custom_${Date.now()}`;
    const customFoodItem: FoodItem = {
      id: customItemId,
      name: quickName.trim(),
      price: Number(quickPrice),
      category: quickAddMeal,
      unit: 'item',
      isCustom: true,
    };

    updateItemQuantity(quickAddMeal, customFoodItem, quickQty);

    // Reset inline form
    setQuickName('');
    setQuickPrice(20);
    setQuickQty(1);
    setQuickAddMeal(null);
  };

  // Clear specific meal
  const handleClearMeal = (mealType: MealType) => {
    const updatedRecord: DayRecord = {
      ...currentRecord,
      [mealType]: {
        items: [],
        subtotal: 0,
        note: '',
      },
    };
    updatedRecord.dailyTotal = calculateDayTotal(updatedRecord);
    onUpdateDayRecord(updatedRecord);
  };

  // Update day note
  const handleNoteChange = (note: string) => {
    onUpdateDayRecord({
      ...currentRecord,
      generalNote: note,
    });
  };

  // Meal configurations
  const mealSections: {
    type: MealType;
    label: string;
    icon: React.ReactNode;
    colorClasses: {
      badge: string;
      headerBg: string;
      subtotalBg: string;
      accent: string;
    };
  }[] = [
    {
      type: 'breakfast',
      label: 'Breakfast',
      icon: <Sunrise className="w-5 h-5 text-amber-600" />,
      colorClasses: {
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        headerBg: 'bg-gradient-to-r from-amber-50/70 to-amber-100/30',
        subtotalBg: 'bg-amber-50 text-amber-900 border-amber-200',
        accent: 'text-amber-700',
      },
    },
    {
      type: 'lunch',
      label: 'Lunch',
      icon: <Sun className="w-5 h-5 text-orange-600" />,
      colorClasses: {
        badge: 'bg-orange-100 text-orange-800 border-orange-200',
        headerBg: 'bg-gradient-to-r from-orange-50/70 to-orange-100/30',
        subtotalBg: 'bg-orange-50 text-orange-900 border-orange-200',
        accent: 'text-orange-700',
      },
    },
    {
      type: 'dinner',
      label: 'Dinner',
      icon: <Sunset className="w-5 h-5 text-purple-600" />,
      colorClasses: {
        badge: 'bg-purple-100 text-purple-800 border-purple-200',
        headerBg: 'bg-gradient-to-r from-purple-50/70 to-purple-100/30',
        subtotalBg: 'bg-purple-50 text-purple-900 border-purple-200',
        accent: 'text-purple-700',
      },
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6 no-print">
      
      {/* Header with Date & Live Day Total */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Meal Logger
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500">
              Live Real-Time Calculator
            </span>
          </div>
          <div className="mt-1 flex items-center space-x-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {formatDisplayDate(selectedDate)}
            </h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && onSelectDate(e.target.value)}
              className="text-xs text-slate-600 border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
              title="Change Date"
            />
          </div>
        </div>

        {/* Live Day Total Pill */}
        <div className="flex items-center space-x-3 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl self-start sm:self-auto">
          <div>
            <div className="text-[10px] font-semibold uppercase text-emerald-700">
              Total Today
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-800 leading-none">
              {formatCurrency(currentRecord.dailyTotal)}
            </div>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
        </div>
      </div>

      {/* Filter Tabs for Mobile / Quick Views */}
      <div className="flex items-center space-x-1 mt-4 mb-5 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Meals
        </button>
        <button
          onClick={() => setActiveTab('breakfast')}
          className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'breakfast'
              ? 'bg-white text-amber-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sunrise className="w-3.5 h-3.5 text-amber-600" />
          <span>Breakfast ({formatCurrency(calculateMealSubtotal(currentRecord.breakfast))})</span>
        </button>
        <button
          onClick={() => setActiveTab('lunch')}
          className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'lunch'
              ? 'bg-white text-orange-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-orange-600" />
          <span>Lunch ({formatCurrency(calculateMealSubtotal(currentRecord.lunch))})</span>
        </button>
        <button
          onClick={() => setActiveTab('dinner')}
          className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'dinner'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sunset className="w-3.5 h-3.5 text-purple-600" />
          <span>Dinner ({formatCurrency(calculateMealSubtotal(currentRecord.dinner))})</span>
        </button>
      </div>

      {/* Meal Sections */}
      <div className="space-y-6">
        {mealSections
          .filter(section => activeTab === 'all' || activeTab === section.type)
          .map(({ type, label, icon, colorClasses }) => {
            const mealLog = currentRecord[type];
            const subtotal = calculateMealSubtotal(mealLog);
            const isAddingCustom = quickAddMeal === type;

            return (
              <div 
                key={type}
                className="rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs transition hover:shadow-sm"
              >
                {/* Meal Header */}
                <div className={`p-3.5 sm:p-4 ${colorClasses.headerBg} border-b border-slate-200 flex items-center justify-between`}>
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-white rounded-xl shadow-xs">
                      {icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                        {label}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Tap + or - to log your mess items
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-lg border font-bold text-sm ${colorClasses.subtotalBg}`}>
                      {formatCurrency(subtotal)}
                    </div>
                    {subtotal > 0 && (
                      <button
                        onClick={() => handleClearMeal(type)}
                        title={`Clear ${label}`}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Items Selection Grid */}
                <div className="p-3 sm:p-4 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                    {availableItems.map((item) => {
                      const qty = getItemQuantity(type, item.id);
                      const isSelected = qty > 0;

                      return (
                        <div
                          key={item.id}
                          className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between transition ${
                            isSelected
                              ? 'bg-slate-50 border-emerald-500/80 shadow-xs'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-semibold text-sm text-slate-800 truncate">
                              {item.name}
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                              {formatCurrency(item.price)} <span className="text-[10px] text-slate-400">/{item.unit || 'unit'}</span>
                            </div>
                            {isSelected && (
                              <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
                                = {formatCurrency(item.price * qty)}
                              </div>
                            )}
                          </div>

                          {/* Stepper Buttons */}
                          <div className="flex items-center space-x-1.5 shrink-0 bg-slate-100 p-1 rounded-lg border border-slate-200">
                            <button
                              onClick={() => updateItemQuantity(type, item, -1)}
                              disabled={qty === 0}
                              className={`w-7 h-7 rounded-md flex items-center justify-center transition ${
                                qty > 0
                                  ? 'bg-white text-slate-700 hover:bg-slate-200 active:scale-95 shadow-xs'
                                  : 'text-slate-300 cursor-not-allowed'
                              }`}
                              title="Decrease"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            <span
                              className={`w-6 text-center text-xs font-bold ${
                                isSelected ? 'text-emerald-700' : 'text-slate-400'
                              }`}
                            >
                              {qty}
                            </span>

                            <button
                              onClick={() => updateItemQuantity(type, item, 1)}
                              className="w-7 h-7 rounded-md bg-white hover:bg-emerald-600 hover:text-white text-slate-800 flex items-center justify-center shadow-xs transition active:scale-95"
                              title="Increase"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* One-off Custom Item or Extra for this meal */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
                    {!isAddingCustom ? (
                      <button
                        onClick={() => setQuickAddMeal(type)}
                        className="inline-flex items-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition py-1 self-start"
                      >
                        <PlusCircle className="w-4 h-4 mr-1.5 text-emerald-600" />
                        + Add Special / Extra item for this {label}
                      </button>
                    ) : (
                      <form onSubmit={handleQuickAddCustom} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2">
                        <div className="flex-1 min-w-[140px]">
                          <input
                            type="text"
                            placeholder="Dish name (e.g. Chicken 65, Tea)"
                            value={quickName}
                            onChange={(e) => setQuickName(e.target.value)}
                            required
                            className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        <div className="w-20">
                          <input
                            type="number"
                            placeholder="₹ Price"
                            min="0"
                            value={quickPrice}
                            onChange={(e) => setQuickPrice(Number(e.target.value))}
                            required
                            className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        <div className="w-16">
                          <input
                            type="number"
                            placeholder="Qty"
                            min="1"
                            value={quickQty}
                            onChange={(e) => setQuickQty(Number(e.target.value))}
                            required
                            className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <button
                            type="submit"
                            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setQuickAddMeal(null)}
                            className="px-2 py-1.5 text-slate-500 hover:text-slate-700 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Day Notes & Summary Bar */}
      <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <label className="flex items-center text-xs font-semibold text-slate-600 mb-1">
            <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />
            Day Note (Optional):
          </label>
          <input
            type="text"
            placeholder="e.g. Mess closed on Sunday evening, ate outside"
            value={currentRecord.generalNote || ''}
            onChange={(e) => handleNoteChange(e.target.value)}
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
          />
        </div>

        {/* Live Real-time Addition Calculation Footnote */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between sm:justify-end space-x-4 text-xs">
          <div className="text-slate-500">
            <span className="font-semibold text-amber-700">BF: {formatCurrency(calculateMealSubtotal(currentRecord.breakfast))}</span> +{' '}
            <span className="font-semibold text-orange-700">LN: {formatCurrency(calculateMealSubtotal(currentRecord.lunch))}</span> +{' '}
            <span className="font-semibold text-purple-700">DN: {formatCurrency(calculateMealSubtotal(currentRecord.dinner))}</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="font-extrabold text-sm text-slate-900">
            Total: {formatCurrency(currentRecord.dailyTotal)}
          </div>
        </div>
      </div>

    </div>
  );
};
