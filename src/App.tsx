import React, { useState, useMemo, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { MetricCards } from './components/MetricCards';
import { CalendarView } from './components/CalendarView';
import { MealLogger } from './components/MealLogger';
import { ItemManagerModal } from './components/ItemManagerModal';
import { MonthlyReportModal } from './components/MonthlyReportModal';
import { PrintableBillModal } from './components/PrintableBillModal';
import type { FoodItem, DayRecord } from './types';
import {
  loadFoodItems,
  saveFoodItems,
  loadDayRecords,
  saveDayRecords,
  exportAllData,
  importAllData,
} from './utils/storage';
import {
  getTodayDateString,
  getMonthKeyFromDate,
  calculateMonthlySummary,
} from './utils/calculations';
import { ReceiptText, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const today = useMemo(() => getTodayDateString(), []);
  
  // App states
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [currentMonthKey, setCurrentMonthKey] = useState<string>(() => getMonthKeyFromDate(today));
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => loadFoodItems());
  const [dayRecords, setDayRecords] = useState<Record<string, DayRecord>>(() => loadDayRecords());

  // Modal open states
  const [isItemManagerOpen, setIsItemManagerOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isPrintBillOpen, setIsPrintBillOpen] = useState(false);

  // Hidden file input for import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize month key when selected date changes across months
  const handleSelectDate = (newDate: string) => {
    setSelectedDate(newDate);
    const dateMonthKey = getMonthKeyFromDate(newDate);
    if (dateMonthKey !== currentMonthKey) {
      setCurrentMonthKey(dateMonthKey);
    }
  };

  // Month navigation
  const handlePrevMonth = () => {
    const [year, month] = currentMonthKey.split('-').map(Number);
    const prevDate = new Date(year, month - 2, 1);
    const newY = prevDate.getFullYear();
    const newM = String(prevDate.getMonth() + 1).padStart(2, '0');
    const newKey = `${newY}-${newM}`;
    setCurrentMonthKey(newKey);
    // Set selected date to 1st of that month if not already in that month
    setSelectedDate(`${newKey}-01`);
  };

  const handleNextMonth = () => {
    const [year, month] = currentMonthKey.split('-').map(Number);
    const nextDate = new Date(year, month, 1);
    const newY = nextDate.getFullYear();
    const newM = String(nextDate.getMonth() + 1).padStart(2, '0');
    const newKey = `${newY}-${newM}`;
    setCurrentMonthKey(newKey);
    // Set selected date to 1st of that month
    setSelectedDate(`${newKey}-01`);
  };

  const handleToday = () => {
    setSelectedDate(today);
    setCurrentMonthKey(getMonthKeyFromDate(today));
  };

  // Update a single day's record
  const handleUpdateDayRecord = (record: DayRecord) => {
    const updated = {
      ...dayRecords,
      [record.date]: record,
    };
    setDayRecords(updated);
    saveDayRecords(updated);
  };

  // Update food items catalog
  const handleSaveItems = (newItems: FoodItem[]) => {
    setFoodItems(newItems);
    saveFoodItems(newItems);
  };

  // Export backup JSON
  const handleExportBackup = () => {
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mess-food-data-${currentMonthKey}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Trigger import
  const handleImportBackup = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && importAllData(content)) {
        setFoodItems(loadFoodItems());
        setDayRecords(loadDayRecords());
        alert('Data imported successfully!');
      } else {
        alert('Failed to import file. Please check format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Calculate monthly summary reactively
  const monthlySummary = useMemo(() => {
    return calculateMonthlySummary(dayRecords, currentMonthKey);
  }, [dayRecords, currentMonthKey]);

  const selectedDayRecord = dayRecords[selectedDate];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Top Navigation */}
      <Navbar
        currentMonthKey={currentMonthKey}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onOpenItemManager={() => setIsItemManagerOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenPrintBill={() => setIsPrintBillOpen(true)}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        
        {/* Top Metric Cards */}
        <MetricCards
          monthlySummary={monthlySummary}
          selectedDate={selectedDate}
          selectedDayRecord={selectedDayRecord}
        />

        {/* Core Layout: Calendar on Left/Top + Meal Logger on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Calendar & Monthly Action Card (5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            <CalendarView
              currentMonthKey={currentMonthKey}
              selectedDate={selectedDate}
              dayRecords={dayRecords}
              onSelectDate={handleSelectDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />

            {/* Quick Action Banner */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-md shadow-emerald-900/10 no-print flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start space-x-1.5 text-emerald-200 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Mess Statement</span>
                </div>
                <h3 className="font-extrabold text-lg text-white">
                  Monthly Food Bill
                </h3>
                <p className="text-xs text-emerald-100 max-w-xs">
                  Generate a clean, itemized invoice statement ready to print or save as PDF.
                </p>
              </div>

              <button
                onClick={() => setIsPrintBillOpen(true)}
                className="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold text-xs shadow-md transition active:scale-95 shrink-0 flex items-center space-x-2"
              >
                <ReceiptText className="w-4 h-4" />
                <span>View Full Bill</span>
              </button>
            </div>
          </div>

          {/* Right Column: Meal Logger (7 columns) */}
          <div className="lg:col-span-7">
            <MealLogger
              selectedDate={selectedDate}
              dayRecord={selectedDayRecord}
              availableItems={foodItems}
              onUpdateDayRecord={handleUpdateDayRecord}
              onSelectDate={handleSelectDate}
            />
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-8 no-print">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Mess Food Expense Scheduler • Real-Time Daily & Monthly Bill Calculator
          </div>
          <div className="text-[11px] text-slate-400 flex items-center space-x-1">
            <span>Data stored locally in your browser</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ItemManagerModal
        isOpen={isItemManagerOpen}
        onClose={() => setIsItemManagerOpen(false)}
        items={foodItems}
        onSaveItems={handleSaveItems}
      />

      <MonthlyReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        monthlySummary={monthlySummary}
        onOpenPrintBill={() => setIsPrintBillOpen(true)}
      />

      <PrintableBillModal
        isOpen={isPrintBillOpen}
        onClose={() => setIsPrintBillOpen(false)}
        monthlySummary={monthlySummary}
      />

    </div>
  );
};

export default App;
