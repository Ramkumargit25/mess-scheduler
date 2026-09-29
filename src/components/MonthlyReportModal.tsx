import React from 'react';
import { X, PieChart, Calendar, Printer, Utensils } from 'lucide-react';
import type { MonthlyBillSummary } from '../types';
import { formatCurrency, formatDisplayDate } from '../utils/calculations';

interface MonthlyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthlySummary: MonthlyBillSummary;
  onOpenPrintBill: () => void;
}

export const MonthlyReportModal: React.FC<MonthlyReportModalProps> = ({
  isOpen,
  onClose,
  monthlySummary,
  onOpenPrintBill,
}) => {
  if (!isOpen) return null;

  const {
    monthName,
    totalAmount,
    breakfastTotal,
    lunchTotal,
    dinnerTotal,
    daysLogged,
    averagePerActiveDay,
    itemBreakdown,
    dailyRecords,
  } = monthlySummary;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Monthly Food Expense Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                {monthName} • Complete Summary & Item Consumption
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Top Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Grand Total</span>
              <div className="text-xl font-black text-emerald-700 mt-0.5">
                {formatCurrency(totalAmount)}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Days Active</span>
              <div className="text-xl font-black text-slate-800 mt-0.5">
                {daysLogged} days
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Daily Average</span>
              <div className="text-xl font-black text-amber-700 mt-0.5">
                {formatCurrency(averagePerActiveDay)}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Meal Share</span>
              <div className="text-xs font-bold text-slate-700 mt-1">
                BF {formatCurrency(breakfastTotal)} • LN {formatCurrency(lunchTotal)} • DN {formatCurrency(dinnerTotal)}
              </div>
            </div>
          </div>

          {/* Itemized Food Consumption */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center">
              <Utensils className="w-4 h-4 mr-1.5 text-emerald-600" />
              Item-Wise Food Consumption
            </h4>

            {itemBreakdown.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center border border-dashed rounded-xl">
                No items recorded for this month yet.
              </p>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {itemBreakdown.map((item, idx) => {
                  const percentage = totalAmount > 0 ? Math.round((item.totalCost / totalAmount) * 100) : 0;
                  return (
                    <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{item.name}</span>
                        <span className="ml-2 text-slate-500">
                          {item.quantity} {item.unit || 'units'} eaten ({formatCurrency(item.price)} each)
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">{formatCurrency(item.totalCost)}</div>
                        <div className="text-[10px] text-slate-400">{percentage}% of monthly bill</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Day-by-day Log Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-1.5 text-blue-600" />
              Daily Expense Statement
            </h4>

            {dailyRecords.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center border border-dashed rounded-xl">
                No daily logs recorded yet.
              </p>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px]">
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Breakfast</th>
                      <th className="p-2.5">Lunch</th>
                      <th className="p-2.5">Dinner</th>
                      <th className="p-2.5 text-right">Daily Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dailyRecords.map((rec) => (
                      <tr key={rec.date} className="hover:bg-slate-50/70 transition">
                        <td className="p-2.5 font-medium text-slate-800">
                          {formatDisplayDate(rec.date)}
                        </td>
                        <td className="p-2.5 text-amber-700 font-medium">
                          {formatCurrency(rec.breakfast.subtotal)}
                        </td>
                        <td className="p-2.5 text-orange-700 font-medium">
                          {formatCurrency(rec.lunch.subtotal)}
                        </td>
                        <td className="p-2.5 text-purple-700 font-medium">
                          {formatCurrency(rec.dinner.subtotal)}
                        </td>
                        <td className="p-2.5 text-right font-bold text-slate-900">
                          {formatCurrency(rec.dailyTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenPrintBill();
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center space-x-1.5 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Generate Printable Bill Slip</span>
          </button>
        </div>

      </div>
    </div>
  );
};
