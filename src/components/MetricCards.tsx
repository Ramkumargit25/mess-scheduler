import React from 'react';
import { IndianRupee, TrendingUp, CalendarCheck, Sun, Sunrise, Sunset } from 'lucide-react';
import { formatCurrency, formatDisplayDate } from '../utils/calculations';
import type { MonthlyBillSummary, DayRecord } from '../types';

interface MetricCardsProps {
  monthlySummary: MonthlyBillSummary;
  selectedDate: string;
  selectedDayRecord?: DayRecord;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  monthlySummary,
  selectedDate,
  selectedDayRecord,
}) => {
  const selectedDayTotal = selectedDayRecord ? selectedDayRecord.dailyTotal : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 no-print">
      
      {/* Monthly Total */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Month Total
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <IndianRupee className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(monthlySummary.totalAmount)}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 font-medium truncate">
          For {monthlySummary.monthName}
        </p>
        <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Selected Day Total */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Selected Day
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <CalendarCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(selectedDayTotal)}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 font-medium truncate">
          {formatDisplayDate(selectedDate)}
        </p>
      </div>

      {/* Daily Average */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Daily Average
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(monthlySummary.averagePerActiveDay)}
          </span>
          <span className="text-xs text-slate-500">/ active day</span>
        </div>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          {monthlySummary.daysLogged} days logged this month
        </p>
      </div>

      {/* Meal Category Quick Breakdown */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Meal Distribution
        </span>
        <div className="grid grid-cols-3 gap-1 mt-2 text-center">
          <div className="p-1.5 rounded-lg bg-amber-50/80 border border-amber-100">
            <div className="flex items-center justify-center text-amber-600 mb-0.5">
              <Sunrise className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] text-amber-700 font-medium">Breakf.</div>
            <div className="text-xs font-bold text-slate-800">
              {formatCurrency(monthlySummary.breakfastTotal)}
            </div>
          </div>

          <div className="p-1.5 rounded-lg bg-orange-50/80 border border-orange-100">
            <div className="flex items-center justify-center text-orange-600 mb-0.5">
              <Sun className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] text-orange-700 font-medium">Lunch</div>
            <div className="text-xs font-bold text-slate-800">
              {formatCurrency(monthlySummary.lunchTotal)}
            </div>
          </div>

          <div className="p-1.5 rounded-lg bg-purple-50/80 border border-purple-100">
            <div className="flex items-center justify-center text-purple-600 mb-0.5">
              <Sunset className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] text-purple-700 font-medium">Dinner</div>
            <div className="text-xs font-bold text-slate-800">
              {formatCurrency(monthlySummary.dinnerTotal)}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
