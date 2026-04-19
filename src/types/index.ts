export type UserRole = 'owner' | 'staff';

export interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  sellPrice: number;
}

export type StockStatus = 'good' | 'low' | 'critical';

export interface StockHistory {
  id: string;
  stockItemId: string;
  changeAmount: number;
  changeType: 'add' | 'deduct' | 'sale';
  changedBy: UserRole;
  note: string;
  timestamp: Date;
}

export interface BillItem {
  stockItemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Bill {
  id: string;
  billNumber: string; // format: SC-YYYYMMDD-XXXX
  items: BillItem[];
  subtotal: number;
  discount: number;
  gst: number;
  total: number;
  paymentMode: 'cash' | 'upi';
  servedBy: string; // the role or username
  createdAt: Date;
  isSynced: boolean;
}

export interface AppSettings {
  cafeName: string;
  ownerName: string;
  address: string;
  phone: string;
  ownerPin: string; // default '1234'
  staffPin: string; // default '0000'
  gstEnabled: boolean;
  gstPercent: number; // default 5
  currency: string; // default 'INR'
  sheetWebhookUrl: string; // Google Apps Script URL
  ownerPhone: string; // WhatsApp number
}

export interface AppState {
  isLoggedIn: boolean;
  role: UserRole | null;
  stockItems: StockItem[];
  bills: Bill[];
  stockHistory: StockHistory[];
  settings: AppSettings;
  isShiftActive: boolean;
}

export type AppAction =
  | { type: 'LOGIN'; payload: UserRole }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_STOCK_QTY'; payload: { id: string; delta: number; changedBy: UserRole; note?: string } }
  | { type: 'ADD_STOCK_ITEM'; payload: StockItem }
  | { type: 'UPDATE_STOCK_ITEM'; payload: StockItem }
  | { type: 'DELETE_STOCK_ITEM'; payload: string }
  | { type: 'ADD_BILL'; payload: Bill }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'TOGGLE_SHIFT'; payload: boolean }
  | { type: 'SYNC_BILL_SUCCESS'; payload: string }
  | { type: 'LOAD_PERSISTED_STATE'; payload: any };
