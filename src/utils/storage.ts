import type { FoodItem, DayRecord } from '../types';
import { DEFAULT_FOOD_ITEMS } from '../data/defaultItems';
import { getTodayDateString } from './calculations';

const ITEMS_STORAGE_KEY = 'mess_food_items_v1';
const RECORDS_STORAGE_KEY = 'mess_day_records_v1';

export const loadFoodItems = (): FoodItem[] => {
  try {
    const raw = localStorage.getItem(ITEMS_STORAGE_KEY);
    if (!raw) {
      saveFoodItems(DEFAULT_FOOD_ITEMS);
      return DEFAULT_FOOD_ITEMS;
    }
    const items = JSON.parse(raw);
    return Array.isArray(items) && items.length > 0 ? items : DEFAULT_FOOD_ITEMS;
  } catch (e) {
    console.error('Failed to load food items from localStorage', e);
    return DEFAULT_FOOD_ITEMS;
  }
};

export const saveFoodItems = (items: FoodItem[]): void => {
  try {
    localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save food items', e);
  }
};

export const loadDayRecords = (): Record<string, DayRecord> => {
  try {
    const raw = localStorage.getItem(RECORDS_STORAGE_KEY);
    if (!raw) {
      // Seed with friendly starter demo data for today so user immediately sees how it works
      const initial = generateSampleData();
      saveDayRecords(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load day records', e);
    return {};
  }
};

export const saveDayRecords = (records: Record<string, DayRecord>): void => {
  try {
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save day records', e);
  }
};

export const exportAllData = (): string => {
  const items = loadFoodItems();
  const records = loadDayRecords();
  return JSON.stringify({
    version: '1.0',
    exportedAt: new Date().toISOString(),
    items,
    records,
  }, null, 2);
};

export const importAllData = (jsonStr: string): boolean => {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed.items && Array.isArray(parsed.items)) {
      saveFoodItems(parsed.items);
    }
    if (parsed.records && typeof parsed.records === 'object') {
      saveDayRecords(parsed.records);
    }
    return true;
  } catch (e) {
    console.error('Failed to parse imported data', e);
    return false;
  }
};

const generateSampleData = (): Record<string, DayRecord> => {
  const today = getTodayDateString();
  const [y, m, dStr] = today.split('-');
  const d = parseInt(dStr, 10);

  const sample: Record<string, DayRecord> = {};

  // Today
  sample[today] = {
    date: today,
    breakfast: {
      items: [
        { itemId: 'idly', name: 'Idly', price: 8, quantity: 3, unit: 'piece' },
        { itemId: 'tea', name: 'Tea / Coffee', price: 10, quantity: 1, unit: 'cup' },
      ],
      subtotal: 34,
      note: 'Normal breakfast',
    },
    lunch: {
      items: [
        { itemId: 'meals', name: 'Meals', price: 70, quantity: 1, unit: 'plate' },
        { itemId: 'omelette', name: 'Omelette / Egg', price: 15, quantity: 1, unit: 'piece' },
      ],
      subtotal: 85,
    },
    dinner: {
      items: [
        { itemId: 'chappathi', name: 'Chappathi', price: 15, quantity: 3, unit: 'piece' },
      ],
      subtotal: 45,
    },
    dailyTotal: 164,
  };

  // Add 1 or 2 past days in current month if possible
  if (d > 1) {
    const prevDayStr = `${y}-${m}-${String(d - 1).padStart(2, '0')}`;
    sample[prevDayStr] = {
      date: prevDayStr,
      breakfast: {
        items: [
          { itemId: 'poori', name: 'Poori', price: 15, quantity: 2, unit: 'piece' },
        ],
        subtotal: 30,
      },
      lunch: {
        items: [
          { itemId: 'variety_rice', name: 'Variety Rice', price: 40, quantity: 1, unit: 'plate' },
        ],
        subtotal: 40,
      },
      dinner: {
        items: [
          { itemId: 'dosa', name: 'Dosa', price: 15, quantity: 2, unit: 'piece' },
        ],
        subtotal: 30,
      },
      dailyTotal: 100,
    };
  }

  return sample;
};
