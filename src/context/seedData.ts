import type { StockItem, AppSettings } from '../types';

export const initialSettings: AppSettings = {
  cafeName: "SIP's CHAI",
  ownerName: "JITIN BHOGADHI",
  address: "1234 Chai Street",
  phone: "9876543210",
  ownerPin: "1234",
  staffPin: "0000",
  gstEnabled: false,
  gstPercent: 5,
  currency: "INR",
  sheetWebhookUrl: import.meta.env.VITE_SHEET_WEBHOOK_URL || "",
  ownerPhone: import.meta.env.VITE_OWNER_PHONE || "919581312076"
};

export const seedStockItems: StockItem[] = [
  { id: '1', name: 'Cutting Chai', category: 'Beverages', quantity: 50, unit: 'cups', minThreshold: 20, sellPrice: 10 },
  { id: '2', name: 'Coffee Packets', category: 'Beverages', quantity: 25, unit: 'pcs', minThreshold: 10, sellPrice: 30 },
  { id: '3', name: 'Tea Packets', category: 'Beverages', quantity: 30, unit: 'pcs', minThreshold: 10, sellPrice: 15 },
  { id: '4', name: 'Chai Masala', category: 'Spices', quantity: 5, unit: 'kg', minThreshold: 2, sellPrice: 200 },
  { id: '5', name: 'Milk', category: 'Dairy', quantity: 15, unit: 'litres', minThreshold: 5, sellPrice: 25 },
  { id: '6', name: 'Sugar', category: 'Essentials', quantity: 12, unit: 'kg', minThreshold: 5, sellPrice: 45 },
  { id: '7', name: 'Cigarettes', category: 'Tobacco', quantity: 50, unit: 'pcs', minThreshold: 20, sellPrice: 20 },
  { id: '8', name: 'Biscuits', category: 'Snacks', quantity: 20, unit: 'packs', minThreshold: 8, sellPrice: 20 },
  { id: '9', name: 'Paper Cups', category: 'Supplies', quantity: 100, unit: 'pcs', minThreshold: 50, sellPrice: 1 },
  { id: '10', name: 'Napkins', category: 'Supplies', quantity: 15, unit: 'packs', minThreshold: 5, sellPrice: 10 },
];

export const seedMenuItems = [
  // Chai
  { id: 'm1', stockItemId: '1', name: "SIP's Chai (Single)", category: 'Chai', price: 15 },
  { id: 'm1-f', stockItemId: '1', name: "SIP's Chai (Full)", category: 'Chai', price: 20 },
  { id: 'm2', stockItemId: '1', name: 'Allam Chai', category: 'Chai', price: 25 },
  { id: 'm3', stockItemId: '1', name: 'Elaichi Chai', category: 'Chai', price: 25 },
  { id: 'm4', stockItemId: '1', name: 'Masala Chai', category: 'Chai', price: 25 },
  { id: 'm5', stockItemId: '1', name: 'Lemon Tea', category: 'Chai', price: 25 },
  { id: 'm6', stockItemId: '1', name: 'Kulhad Chai', category: 'Chai', price: 40 },
  { id: 'mba', stockItemId: '1', name: 'Boost / Bournvita / Horlicks', category: 'Chai', price: 30 },
  
  // Maggi
  { id: 'mg1', stockItemId: '5', name: 'Plain Maggi', category: 'Maggi', price: 60 },
  { id: 'mg2', stockItemId: '5', name: 'Double Masala Maggi', category: 'Maggi', price: 70 },
  { id: 'mg3', stockItemId: '5', name: 'Butter Maggi', category: 'Maggi', price: 70 },
  { id: 'mg4', stockItemId: '5', name: 'Cheese Maggi', category: 'Maggi', price: 80 },
  { id: 'mg5', stockItemId: '5', name: 'Egg Maggi', category: 'Maggi', price: 80 },
  { id: 'mg6', stockItemId: '5', name: 'Double Egg Maggi', category: 'Maggi', price: 90 },
  { id: 'mg7', stockItemId: '5', name: 'Chicken Maggi', category: 'Maggi', price: 100 },

  // Coffee
  { id: 'c1', stockItemId: '2', name: 'Coffee', category: 'Coffee', price: 20 },
  { id: 'c2', stockItemId: '2', name: "Cothas (SIP's Special)", category: 'Coffee', price: 30 },
  { id: 'c3', stockItemId: '2', name: 'Flavored Coffee', category: 'Coffee', price: 30 },
  { id: 'c4', stockItemId: '2', name: 'Filter Coffee', category: 'Coffee', price: 30 },

  // Fresh Juices & Milkshakes
  { id: 'j1', stockItemId: '5', name: 'Lemon Juice', category: 'Fresh Juices & Milkshakes', price: 40 },
  { id: 'j2', stockItemId: '5', name: 'Lemon Soda', category: 'Fresh Juices & Milkshakes', price: 50 },
  { id: 'j3', stockItemId: '5', name: 'Pineapple Juice', category: 'Fresh Juices & Milkshakes', price: 80 },
  { id: 'j4', stockItemId: '5', name: 'Watermelon Juice', category: 'Fresh Juices & Milkshakes', price: 80 },
  { id: 'j5', stockItemId: '5', name: 'Apple Milkshake', category: 'Fresh Juices & Milkshakes', price: 80 },
  { id: 'j6', stockItemId: '5', name: 'Banana Milkshake', category: 'Fresh Juices & Milkshakes', price: 70 },
  { id: 'j7', stockItemId: '5', name: 'Banana Milkshake w/Dates', category: 'Fresh Juices & Milkshakes', price: 80 },

  // Snacks
  { id: 's1', stockItemId: '8', name: 'Osmania Biscuits (4 Pcs)', category: 'Snacks', price: 20 },
  { id: 's2', stockItemId: '8', name: 'Samosa', category: 'Snacks', price: 25 },
  { id: 's3', stockItemId: '8', name: 'Bread & Butter / Jam', category: 'Snacks', price: 40 },
  { id: 's4', stockItemId: '8', name: 'Chilli Cheese Toast', category: 'Snacks', price: 50 },
  { id: 's5', stockItemId: '8', name: 'Bun Omlette', category: 'Snacks', price: 60 },
  { id: 's6', stockItemId: '8', name: 'Bread Omlette (Single Egg)', category: 'Snacks', price: 60 },
  { id: 's7', stockItemId: '8', name: 'Bread Omlette (Double Egg)', category: 'Snacks', price: 80 },
  { id: 's8', stockItemId: '8', name: 'Garlic Bread', category: 'Snacks', price: 90 },

  // Cigarettes (Keeping existing as requested)
  { id: 'm26', stockItemId: '7', name: 'Gold Flake', category: 'Cigarettes', price: 20 },
  { id: 'm27', stockItemId: '7', name: 'Classic Milds', category: 'Cigarettes', price: 18 },
  { id: 'm28', stockItemId: '7', name: 'Navy Cut', category: 'Cigarettes', price: 15 },
  { id: 'm29', stockItemId: '7', name: 'Marlboro', category: 'Cigarettes', price: 25 },
];
