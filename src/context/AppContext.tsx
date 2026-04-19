import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from 'react';
import type { AppState, AppAction, Bill, BillItem, AppSettings } from '../types';
import { initialSettings, seedStockItems, seedMenuItems } from './seedData';

const getInitialState = (): AppState => {
  const savedState = localStorage.getItem('sipsChaiState');
  if (savedState) {
    const parsed = JSON.parse(savedState);
    // Convert date strings back to Date objects
    parsed.bills = parsed.bills.map((b: any) => ({ ...b, createdAt: new Date(b.createdAt) }));
    parsed.stockHistory = parsed.stockHistory.map((h: any) => ({ ...h, timestamp: new Date(h.timestamp) }));
    return parsed;
  }
  return {
    isLoggedIn: false,
    role: null,
    isShiftActive: false,
    stockItems: seedStockItems,
    bills: [],
    stockHistory: [],
    settings: initialSettings,
  };
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  let newState = state;
  switch (action.type) {
    case 'LOAD_PERSISTED_STATE':
      return { ...action.payload, isLoggedIn: false, role: null };
    case 'LOGIN':
      newState = { ...state, isLoggedIn: true, role: action.payload };
      break;
    case 'LOGOUT':
      newState = { ...state, isLoggedIn: false, role: null };
      break;
    case 'TOGGLE_SHIFT':
      newState = { ...state, isShiftActive: action.payload };
      break;
    case 'SYNC_BILL_SUCCESS':
      newState = { ...state, bills: state.bills.map(b => b.id === action.payload ? { ...b, isSynced: true } : b) };
      break;
    case 'UPDATE_STOCK_QTY': {
      const { id, delta, changedBy, note } = action.payload;
      const item = state.stockItems.find(i => i.id === id);
      if (!item) return state;
      
      const newQuantity = Math.max(0, item.quantity + delta);
      const actualDelta = newQuantity - item.quantity;
      if (actualDelta === 0) return state;

      const historyEntry = {
        id: Math.random().toString(36).substr(2, 9),
        stockItemId: id,
        changeAmount: actualDelta,
        changeType: actualDelta < 0 ? 'deduct' as const : 'add' as const,
        changedBy,
        note: note || `Manual adjustment by ${changedBy}`,
        timestamp: new Date(),
      };

      return {
        ...state,
        stockItems: state.stockItems.map(i => i.id === id ? { ...i, quantity: newQuantity } : i),
        stockHistory: [historyEntry, ...state.stockHistory],
      };
    }
    case 'ADD_STOCK_ITEM':
      return { ...state, stockItems: [...state.stockItems, action.payload] };
    case 'UPDATE_STOCK_ITEM':
      return { ...state, stockItems: state.stockItems.map(i => i.id === action.payload.id ? action.payload : i) };
    case 'DELETE_STOCK_ITEM':
      return { ...state, stockItems: state.stockItems.filter(i => i.id !== action.payload) };
    case 'ADD_BILL': {
      const newBill = action.payload;
      // Auto-deduct stock based on bill items
      let updatedStockItems = [...state.stockItems];
      let newHistory = [...state.stockHistory];

      newBill.items.forEach(billItem => {
        const stockItemIndex = updatedStockItems.findIndex(i => i.id === billItem.stockItemId);
        if (stockItemIndex !== -1) {
          const stockItem = updatedStockItems[stockItemIndex];
          const newQty = Math.max(0, stockItem.quantity - billItem.quantity);
          const historyEntry = {
            id: Math.random().toString(36).substr(2, 9),
            stockItemId: stockItem.id,
            changeAmount: -billItem.quantity,
            changeType: 'sale' as const,
            changedBy: state.role || 'staff',
            note: `Sold on bill ${newBill.billNumber}`,
            timestamp: new Date(),
          };
          updatedStockItems[stockItemIndex] = { ...stockItem, quantity: newQty };
          newHistory.unshift(historyEntry);
        }
      });

      return {
        ...state,
        bills: [newBill, ...state.bills],
        stockItems: updatedStockItems,
        stockHistory: newHistory,
      };
    }
    case 'UPDATE_SETTINGS':
      newState = { ...state, settings: { ...state.settings, ...action.payload } };
      break;
    default:
      return state;
  }
  
  if (newState !== state) {
    localStorage.setItem('sips_chai_state', JSON.stringify(newState));
  }
  return newState;
};

interface AppContextType extends AppState {
  login: (pin: string) => boolean;
  logout: () => void;
  updateStockQty: (id: string, delta: number, note?: string) => void;
  confirmSale: (items: BillItem[], discount: number, paymentMode: Bill['paymentMode']) => Bill | null;
  updateSettings: (settings: Partial<AppSettings>) => void;
  toggleShift: (active: boolean) => void;
  menuItems: typeof seedMenuItems;
  addMenuItem: (item: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);
  const [menuItems, setMenuItems] = useState(seedMenuItems);

  // Persistence: Load on mount
  useEffect(() => {
    const saved = localStorage.getItem('sipsChaiState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          dispatch({ type: 'LOAD_PERSISTED_STATE', payload: parsed });
        }
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  // Persistence: Save on change
  useEffect(() => {
    localStorage.setItem('sipsChaiState', JSON.stringify(state));
  }, [state]);

  // Background Sync Logic (Google Sheets Turbo)
  useEffect(() => {
    const syncPending = async () => {
      // Don't sync if offline or no URL
      if (!navigator.onLine || !state.settings.sheetWebhookUrl) return;

      const unsyncedBills = state.bills.filter(b => !b.isSynced);
      if (unsyncedBills.length === 0) return;

      const bill = unsyncedBills[unsyncedBills.length - 1];
      
      try {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = state.settings.sheetWebhookUrl;
        const iframeName = 'sync_iframe_' + bill.id;
        const iframe = document.createElement('iframe');
        iframe.name = iframeName;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        form.target = iframeName;
        
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'billData';
        // Send simplified data
        input.value = JSON.stringify({
          id: bill.id,
          bill_number: bill.billNumber,
          items: bill.items,
          total: bill.total,
          created_at: bill.createdAt
        });
        form.appendChild(input);
        
        document.body.appendChild(form);
        form.submit();
        
        // Faster mark-as-success for Google Sheets
        setTimeout(() => {
          if (document.body.contains(form)) document.body.removeChild(form);
          if (document.body.contains(iframe)) document.body.removeChild(iframe);
          dispatch({ type: 'SYNC_BILL_SUCCESS', payload: bill.id });
        }, 3000);
      } catch (e) {
        console.error("Sync failed", e);
      }
    };

    const interval = setInterval(syncPending, 5000);
    syncPending();

    return () => clearInterval(interval);
  }, [state.bills, state.settings.sheetWebhookUrl]);

  const login = (pin: string): boolean => {
    if (pin === state.settings.ownerPin) {
      dispatch({ type: 'LOGIN', payload: 'owner' });
      return true;
    }
    if (pin === state.settings.staffPin) {
      dispatch({ type: 'LOGIN', payload: 'staff' });
      return true;
    }
    return false;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateStockQty = (id: string, delta: number, note?: string) => {
    if (!state.role) return;
    dispatch({ type: 'UPDATE_STOCK_QTY', payload: { id, delta, changedBy: state.role, note } });
  };

  const confirmSale = (items: BillItem[]): Bill | null => {
    if (items.length === 0) return null;

    const total = items.reduce((s, i) => s + i.subtotal, 0);

    const newBill: Bill = {
      id: crypto.randomUUID(),
      billNumber: `B${state.bills.length + 1}`.padStart(5, '0'),
      items,
      subtotal: total,
      discount: 0,
      gst: 0,
      total: total,
      paymentMode: 'cash',
      servedBy: 'Staff',
      createdAt: new Date(),
      isSynced: false
    };

    dispatch({ type: 'ADD_BILL', payload: newBill });
    return newBill;
  };

  const updateSettings = (settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const addMenuItem = (item: any) => {
    setMenuItems(prev => [...prev, item]);
  };

  return (
    <AppContext.Provider value={{
      ...state,
      login,
      logout,
      toggleShift: (val: boolean) => dispatch({ type: 'TOGGLE_SHIFT', payload: val }),
      updateStockQty,
      confirmSale,
      updateSettings,
      menuItems,
      addMenuItem,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
