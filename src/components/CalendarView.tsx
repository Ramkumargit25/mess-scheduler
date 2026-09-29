import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import type { DayRecord } from '../types';
import { formatCurrency, getTodayDateString, formatMonthName } from '../utils/calculations';

interface CalendarViewProps {
  currentMonthKey: string; // YYYY-MM
  selectedDate: string; // YYYY-MM-DD
  dayRecords: Record<string, DayRecord>;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentMonthKey,
  selectedDate,
  dayRecords,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}) => {
  const [yearStr, monthStr] = currentMonthKey.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10); // 1-indexed

  // Days in month
  const totalDays = new Date(year, month, 0).getDate();
  // First day of month (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const firstDayIndex = new Date(year, month - 1, 1).getDay();

  const todayStr = getTodayDateString();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days array including leading empty slots
  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    const dayDateStr = `${yearStr}-${String(monthStr).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({
      dayNum: d,
      dateStr: dayDateStr,
      record: dayRecords[dayDateStr],
    });
  }

  // Quick jump helpers
  const handleQuickYesterday = () => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const yStr = today.getFullYear();
    const mStr = String(today.getMonth() + 1).padStart(2, '0');
    const dStr = String(today.getDate()).padStart(2, '0');
    onSelectDate(`${yStr}-${mStr}-${dStr}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 no-print">
      
      {/* Calendar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800">
              {formatMonthName(currentMonthKey)}
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={onPrevMonth}
            title="Previous month"
            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNextMonth}
            title="Next month"
            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <button
            onClick={() => onSelectDate(todayStr)}
            className={`px-2 py-1 rounded-md text-xs font-semibold transition ${
              selectedDate === todayStr 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Today
          </button>
          <button
            onClick={handleQuickYesterday}
            className="px-2 py-1 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            Yesterday
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-3 text-center">
        {weekDays.map((w, idx) => (
          <div
            key={w}
            className={`text-[11px] font-semibold tracking-wider uppercase py-1 ${
              idx === 0 || idx === 6 ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-1">
        {calendarCells.map((cell, idx) => {
          if (!cell) {
            return (
              <div
                key={`empty-${idx}`}
                className="min-h-[58px] sm:min-h-[72px] bg-slate-50/50 rounded-xl border border-transparent"
              />
            );
          }

          const { dayNum, dateStr, record } = cell;
          const isSelected = selectedDate === dateStr;
          const isToday = todayStr === dateStr;
          const hasRecord = record && record.dailyTotal > 0;
          const dailyTotal = record ? record.dailyTotal : 0;

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`min-h-[58px] sm:min-h-[72px] p-1.5 sm:p-2 rounded-xl text-left flex flex-col justify-between transition relative group border ${
                isSelected
                  ? 'bg-emerald-50/90 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                  : hasRecord
                  ? 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                  : 'bg-white/60 hover:bg-slate-50 border-slate-100 hover:border-slate-200 text-slate-400'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs font-bold leading-none ${
                    isSelected
                      ? 'text-emerald-700'
                      : isToday
                      ? 'w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]'
                      : hasRecord
                      ? 'text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {dayNum}
                </span>

                {isToday && !isSelected && (
                  <span className="hidden sm:inline-block text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded">
                    Today
                  </span>
                )}

                {hasRecord && (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 sm:hidden" />
                )}
              </div>

              {/* Amount Badge */}
              <div className="mt-1 w-full text-right sm:text-left">
                {hasRecord ? (
                  <div className="inline-block sm:block">
                    <span
                      className={`text-[10px] sm:text-xs font-bold px-1 sm:px-1.5 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-emerald-600 text-white font-extrabold'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {formatCurrency(dailyTotal)}
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-300 hidden sm:inline-block">
                    —
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend & Help */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Meals Logged</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-emerald-500 bg-emerald-100 inline-block" />
            <span>Active Day</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400">
          Click any date to view and record meals.
        </p>
      </div>

    </div>
  );
};
