# ☕ SIP's CHAI - Turbo POS & Management System

[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

An ultra-high-speed, offline-first Point of Sale (POS) system designed specifically for the fast-paced environment of **SIP's CHAI**. Optimized for rapid billing, inventory tracking, and smart business insights.

## 🚀 Speed & Efficiency
*   ⚡ **Turbo-Billing**: Complete a transaction in under 2 seconds.
*   🖱️ **One-Tap Checkout**: High-contrast "Collect Cash" button for zero-delay operations.
*   ☕ **Unlimited Stock Logic**: Prevents billing interruptions during rush hours.

## 📶 Smart Continuity
*   🔌 **Offline-First Architecture**: Works entirely without internet. All sales are saved locally.
*   ☁️ **Background Cloud Sync**: Automatically uploads bills to Google Sheets when connection is detected.
*   🔄 **Automatic Retry**: Built-in sync engine ensures no data loss.

## 📊 Business Intelligence
*   📱 **Smart WhatsApp Reports**: Sends categorized daily summaries (Total Revenue, Top Items, Trends).
*   📈 **Weekly Analytics**: Visualizes revenue trends and top-performing products.
*   📦 **Proactive Stock Alerts**: Visual indicators for Low and Critical stock levels.

## 🔒 Security & Access
*   🔢 **PIN-Based Access**: Separate roles for Owners and Staff.
*   🛡️ **Privacy Guard**: Private configurations (phone numbers, API keys) are secured via environment variables.

---

## 🛠️ Tech Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Storage**: Browser LocalStorage & Google Sheets (via Google Apps Script)
- **Tooling**: Vite

## ⚙️ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/jitinbhogadhi1312-arch/-sips-chai.git
   cd -sips-chai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory:
   ```env
   VITE_OWNER_PHONE=your_whatsapp_number
   VITE_SHEET_WEBHOOK_URL=your_google_script_url
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

---

*Designed with ❤️ for SIP's CHAI.*
