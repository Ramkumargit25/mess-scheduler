import React, { useState } from 'react';
import { X, Printer, Receipt, Utensils } from 'lucide-react';
import type { MonthlyBillSummary } from '../types';
import { formatCurrency } from '../utils/calculations';

interface PrintableBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthlySummary: MonthlyBillSummary;
}

export const PrintableBillModal: React.FC<PrintableBillModalProps> = ({
  isOpen,
  onClose,
  monthlySummary,
}) => {
  const [studentName, setStudentName] = useState('Mess Member');
  const [roomNumber, setRoomNumber] = useState('');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const {
    monthName,
    totalAmount,
    breakfastTotal,
    lunchTotal,
    dinnerTotal,
    daysLogged,
    itemBreakdown,
    dailyRecords,
  } = monthlySummary;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Controls Bar (Hidden during print) */}
        <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-100 flex items-center justify-between no-print">
          <div className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-emerald-700" />
            <span className="font-bold text-slate-800 text-sm">
              Printable Mess Bill Preview
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 flex items-center space-x-1.5 transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-white print:p-0 print:overflow-visible text-slate-800">
          
          {/* Bill Header */}
          <div className="border-b-2 border-slate-900 pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <div className="flex items-center space-x-2 text-emerald-700">
                <Utensils className="w-6 h-6 inline-block" />
                <span className="text-xs font-black uppercase tracking-widest">
                  Monthly Mess Food Statement
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                MESS BILL RECEIPT
              </h1>
              <p className="text-sm font-semibold text-slate-600">
                Billing Period: {monthName}
              </p>
            </div>

            {/* Editable Member Details */}
            <div className="text-left sm:text-right text-xs space-y-1">
              <div className="flex items-center sm:justify-end space-x-2">
                <span className="text-slate-500 font-medium">Name:</span>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="font-bold text-slate-800 border-b border-dashed border-slate-300 focus:outline-none focus:border-emerald-600 px-1 py-0.5 print:border-none print:p-0"
                />
              </div>
              <div className="flex items-center sm:justify-end space-x-2">
                <span className="text-slate-500 font-medium">Room / Roll No:</span>
                <input
                  type="text"
                  placeholder="Optional"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="font-bold text-slate-800 border-b border-dashed border-slate-300 focus:outline-none focus:border-emerald-600 px-1 py-0.5 print:border-none print:p-0"
                />
              </div>
              <div className="text-slate-400 text-[11px]">
                Generated on: {new Date().toLocaleDateString('en-IN')}
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-center text-xs">
            <div>
              <div className="text-slate-500 uppercase text-[10px] font-semibold">Total Days</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{daysLogged} days</div>
            </div>
            <div>
              <div className="text-slate-500 uppercase text-[10px] font-semibold">Breakfast Total</div>
              <div className="text-sm font-bold text-amber-800 mt-0.5">{formatCurrency(breakfastTotal)}</div>
            </div>
            <div>
              <div className="text-slate-500 uppercase text-[10px] font-semibold">Lunch Total</div>
              <div className="text-sm font-bold text-orange-800 mt-0.5">{formatCurrency(lunchTotal)}</div>
            </div>
            <div>
              <div className="text-slate-500 uppercase text-[10px] font-semibold">Dinner Total</div>
              <div className="text-sm font-bold text-purple-800 mt-0.5">{formatCurrency(dinnerTotal)}</div>
            </div>
          </div>

          {/* Daily Table */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Daily Itemized Log
            </h3>
            <table className="w-full text-left text-xs border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase text-[10px]">
                  <th className="p-2 border-r border-slate-200 w-28">Date</th>
                  <th className="p-2 border-r border-slate-200">Breakfast</th>
                  <th className="p-2 border-r border-slate-200">Lunch</th>
                  <th className="p-2 border-r border-slate-200">Dinner</th>
                  <th className="p-2 text-right w-24">Daily Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {dailyRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-400">
                      No records logged for this month.
                    </td>
                  </tr>
                ) : (
                  dailyRecords.map((r) => (
                    <tr key={r.date} className="even:bg-slate-50/50">
                      <td className="p-2 border-r border-slate-200 font-semibold whitespace-nowrap">
                        {r.date}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-600">
                        {r.breakfast.items.length > 0 ? (
                          <span>
                            {r.breakfast.items.map(i => `${i.name} × ${i.quantity}`).join(', ')}
                            <span className="font-semibold text-amber-800 ml-1">
                              ({formatCurrency(r.breakfast.subtotal)})
                            </span>
                          </span>
                        ) : '—'}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-600">
                        {r.lunch.items.length > 0 ? (
                          <span>
                            {r.lunch.items.map(i => `${i.name} × ${i.quantity}`).join(', ')}
                            <span className="font-semibold text-orange-800 ml-1">
                              ({formatCurrency(r.lunch.subtotal)})
                            </span>
                          </span>
                        ) : '—'}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-600">
                        {r.dinner.items.length > 0 ? (
                          <span>
                            {r.dinner.items.map(i => `${i.name} × ${i.quantity}`).join(', ')}
                            <span className="font-semibold text-purple-800 ml-1">
                              ({formatCurrency(r.dinner.subtotal)})
                            </span>
                          </span>
                        ) : '—'}
                      </td>
                      <td className="p-2 text-right font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(r.dailyTotal)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Item Consumption Summary Table */}
          {itemBreakdown.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Food Item Quantity Summary
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {itemBreakdown.map((item, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex justify-between">
                    <div>
                      <div className="font-bold text-slate-800">{item.name}</div>
                      <div className="text-[10px] text-slate-500">
                        {item.quantity} {item.unit} @ {formatCurrency(item.price)}
                      </div>
                    </div>
                    <div className="font-bold text-slate-900 text-right self-center">
                      {formatCurrency(item.totalCost)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grand Total Footer */}
          <div className="border-t-2 border-slate-900 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-xs text-slate-500">
              * Verified Mess food statement with automated real-time calculation.
            </div>

            <div className="bg-slate-900 text-white px-5 py-3 rounded-xl flex items-center space-x-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Monthly Net Payable:
              </span>
              <span className="text-2xl font-black text-emerald-400">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
