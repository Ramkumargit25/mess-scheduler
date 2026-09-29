import React from 'react';
import { 
  UtensilsCrossed, 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  Settings2, 
  ReceiptText, 
  Download,
  Upload
} from 'lucide-react';
import { formatMonthName } from '../utils/calculations';

interface NavbarProps {
  currentMonthKey: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onOpenItemManager: () => void;
  onOpenReport: () => void;
  onOpenPrintBill: () => void;
  onExportBackup: () => void;
  onImportBackup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMonthKey,
  onPrevMonth,
  onNextMonth,
  onToday,
  onOpenItemManager,
  onOpenReport,
  onOpenPrintBill,
  onExportBackup,
  onImportBackup,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-200">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">
                  Mess Bill Scheduler
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Monthly Food Expense Calculator
                </p>
              </div>
            </div>

            {/* Quick action buttons for mobile */}
            <div className="flex md:hidden items-center space-x-1">
              <button
                onClick={onOpenItemManager}
                title="Food & Price Settings"
                className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
              >
                <Settings2 className="w-5 h-5" />
              </button>
              <button
                onClick={onOpenPrintBill}
                title="Monthly Bill"
                className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
              >
                <ReceiptText className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Month Selector Controls */}
          <div className="flex items-center justify-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-center">
            <button
              onClick={onPrevMonth}
              title="Previous Month"
              className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-lg transition shadow-sm active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="px-3 py-1 flex items-center space-x-2 min-w-[150px] justify-center text-center">
              <CalendarDays className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-800 text-sm">
                {formatMonthName(currentMonthKey)}
              </span>
            </div>

            <button
              onClick={onNextMonth}
              title="Next Month"
              className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-lg transition shadow-sm active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={onToday}
              className="text-xs font-semibold px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 rounded-lg border border-slate-200 shadow-sm transition active:scale-95"
            >
              Today
            </button>
          </div>

          {/* Action Toolbar on Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={onOpenItemManager}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition border border-slate-200"
            >
              <Settings2 className="w-4 h-4 mr-1.5 text-slate-600" />
              Prices & Items
            </button>

            <button
              onClick={onOpenReport}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition border border-slate-200"
            >
              Month Breakdown
            </button>

            <button
              onClick={onOpenPrintBill}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-200 transition active:scale-95"
            >
              <ReceiptText className="w-4 h-4 mr-1.5" />
              Print Monthly Bill
            </button>

            <div className="h-5 w-px bg-slate-200 mx-1" />

            <button
              onClick={onExportBackup}
              title="Export Data Backup"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onImportBackup}
              title="Import Data Backup"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
