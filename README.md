# 🍛 Mess Food Expense Scheduler & Monthly Bill Calculator

A clean, responsive, and easy-to-use web application built for college students and mess members to track daily meals (**Breakfast**, **Lunch**, and **Dinner**), maintain an interactive monthly expense calendar, and calculate monthly mess food bills in real-time.

---

## 🌟 Key Features

1. **Pre-configured Mess Menu & Rates**:
   - **Idly**: ₹8 / piece
   - **Chappathi**: ₹15 / piece
   - **Poori**: ₹15 / piece
   - **Dosa**: ₹15 / piece
   - **Biryani**: ₹100 / plate
   - **Meals**: ₹70 / plate
   - **Upma**: ₹30 / plate
   - **Variety Rice**: ₹40 / plate
   - **Tea / Coffee**: ₹10 / cup
   - **Omelette / Egg**: ₹15 / piece

2. **Custom Foods & Price Manager ("Update as per our own wish")**:
   - Add any new dish with custom price and unit (e.g. *Special Chicken 65 ₹80*, *Vadai ₹8*, *Curd Rice ₹35*).
   - Edit existing default prices whenever mess rates change.
   - Delete custom dishes or reset back to default menu anytime.

3. **1-Click Meal Logger & Real-Time Addition**:
   - Stepper `+` and `-` buttons for quick logging during breakfast, lunch, or dinner.
   - Subtotals for each meal auto-update immediately as you click.
   - Live daily total calculation: `Breakfast + Lunch + Dinner = Today's Total`.
   - Add inline special extra items for any meal.
   - Day notes (e.g., *"Sunday feast"*, *"Mess closed, ate outside"*).

4. **Interactive Monthly Calendar**:
   - Visual monthly grid showing daily totals directly on date badges (e.g. `₹164`, `₹100`).
   - Quick jump to **Today**, **Yesterday**, or any date.
   - Navigate across past and upcoming months (`< Prev Month`, `Next Month >`).

5. **Monthly Food Bill & Printable Statement**:
   - **Monthly Total Spent**: Instant grand total in Indian Rupee format.
   - **Daily Average**: Average daily expense per active day.
   - **Meal Share Distribution**: Visual comparison of Breakfast vs Lunch vs Dinner spending.
   - **Item Consumption Summary**: Breakdown of how many Idlys, Dosas, Meals, and Biryanis you consumed in the month.
   - **Printable Bill / Invoice**: Clean printable receipt with member name, room number, date-by-date itemized breakdown, and net payable amount.

6. **100% Offline & Private Local Storage**:
   - All data is saved securely in your browser (`localStorage`).
   - Includes **Export Backup (JSON)** and **Import Backup** buttons so you never lose your records.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher) and npm installed.

### Commands

1. **Open the project folder**:
   ```bash
   cd mess-food-scheduler
   ```

2. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open the displayed URL (usually `http://localhost:5173`) in your browser or phone browser.

3. **Build for production**:
   ```bash
   npm run build
   ```
   The production-ready static files are generated in the `dist/` directory.

4. **Preview the production build**:
   ```bash
   npm run preview
   ```
