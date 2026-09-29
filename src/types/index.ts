export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'all';
  unit: string; // e.g. 'piece', 'plate', 'cup'
  isCustom?: boolean;
}

export interface ConsumedItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

export interface MealLog {
  items: ConsumedItem[];
  subtotal: number;
  note?: string;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  breakfast: MealLog;
  lunch: MealLog;
  dinner: MealLog;
  dailyTotal: number;
  generalNote?: string;
}

export interface ItemStats {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  totalCost: number;
}

export interface MonthlyBillSummary {
  monthKey: string; // YYYY-MM
  monthName: string; // e.g. "September 2026"
  totalAmount: number;
  breakfastTotal: number;
  lunchTotal: number;
  dinnerTotal: number;
  daysLogged: number;
  averagePerActiveDay: number;
  itemBreakdown: ItemStats[];
  dailyRecords: DayRecord[];
}
