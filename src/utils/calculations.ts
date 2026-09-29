import type { DayRecord, MealLog, MonthlyBillSummary, ItemStats } from '../types';

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getMonthKeyFromDate = (dateStr: string): string => {
  return dateStr.substring(0, 7); // "YYYY-MM"
};

export const formatDisplayDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatMonthName = (monthKey: string): string => {
  if (!monthKey) return '';
  const [y, m] = monthKey.split('-').map(Number);
  const date = new Date(y, m - 1, 1);
  return date.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });
};

export const calculateMealSubtotal = (meal: MealLog): number => {
  if (!meal || !meal.items) return 0;
  return meal.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export const calculateDayTotal = (record: Partial<DayRecord>): number => {
  const breakfast = record.breakfast ? calculateMealSubtotal(record.breakfast) : 0;
  const lunch = record.lunch ? calculateMealSubtotal(record.lunch) : 0;
  const dinner = record.dinner ? calculateMealSubtotal(record.dinner) : 0;
  return breakfast + lunch + dinner;
};

export const createEmptyMealLog = (): MealLog => ({
  items: [],
  subtotal: 0,
});

export const createEmptyDayRecord = (date: string): DayRecord => ({
  date,
  breakfast: createEmptyMealLog(),
  lunch: createEmptyMealLog(),
  dinner: createEmptyMealLog(),
  dailyTotal: 0,
});

export const calculateMonthlySummary = (
  records: Record<string, DayRecord>,
  monthKey: string
): MonthlyBillSummary => {
  let totalAmount = 0;
  let breakfastTotal = 0;
  let lunchTotal = 0;
  let dinnerTotal = 0;
  let daysLogged = 0;
  const itemMap: Record<string, ItemStats> = {};
  const monthRecords: DayRecord[] = [];

  Object.entries(records).forEach(([dateStr, record]) => {
    if (dateStr.startsWith(monthKey)) {
      const bSub = calculateMealSubtotal(record.breakfast);
      const lSub = calculateMealSubtotal(record.lunch);
      const dSub = calculateMealSubtotal(record.dinner);
      const dayTotal = bSub + lSub + dSub;

      if (dayTotal > 0) {
        daysLogged += 1;
        totalAmount += dayTotal;
        breakfastTotal += bSub;
        lunchTotal += lSub;
        dinnerTotal += dSub;
        monthRecords.push({
          ...record,
          breakfast: { ...record.breakfast, subtotal: bSub },
          lunch: { ...record.lunch, subtotal: lSub },
          dinner: { ...record.dinner, subtotal: dSub },
          dailyTotal: dayTotal,
        });

        // Tally items
        const tallyMeals = [record.breakfast, record.lunch, record.dinner];
        tallyMeals.forEach((meal) => {
          meal.items.forEach((item) => {
            if (item.quantity > 0) {
              if (!itemMap[item.name]) {
                itemMap[item.name] = {
                  itemId: item.itemId,
                  name: item.name,
                  price: item.price,
                  quantity: 0,
                  unit: item.unit || 'unit',
                  totalCost: 0,
                };
              }
              itemMap[item.name].quantity += item.quantity;
              itemMap[item.name].totalCost += item.price * item.quantity;
            }
          });
        });
      }
    }
  });

  // Sort daily records chronologically
  monthRecords.sort((a, b) => a.date.localeCompare(b.date));

  // Sort items by total spend descending
  const itemBreakdown = Object.values(itemMap).sort((a, b) => b.totalCost - a.totalCost);

  const averagePerActiveDay = daysLogged > 0 ? Math.round(totalAmount / daysLogged) : 0;

  return {
    monthKey,
    monthName: formatMonthName(monthKey),
    totalAmount,
    breakfastTotal,
    lunchTotal,
    dinnerTotal,
    daysLogged,
    averagePerActiveDay,
    itemBreakdown,
    dailyRecords: monthRecords,
  };
};
