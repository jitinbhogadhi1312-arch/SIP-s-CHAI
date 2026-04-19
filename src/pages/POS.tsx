import { useState, useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import type { BillItem } from '../types';
import { cn } from '../lib/utils';
import { QuantityStepper } from '../components/QuantityStepper';

export function POS() {
  const { menuItems, confirmSale } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('Chai');
  const [cart, setCart] = useState<BillItem[]>([]);
  const total = cart.reduce((s, i) => s + i.subtotal, 0);

  const categories = useMemo(() => Array.from(new Set(menuItems.map(i => i.category))), [menuItems]);
  const currentItems = useMemo(() => menuItems.filter(i => i.category === activeCategory), [menuItems, activeCategory]);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.stockItemId === item.stockItemId && i.itemName === item.name);
      if (existing) {
        return prev.map(i =>
          i.stockItemId === item.stockItemId && i.itemName === item.name
            ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.unitPrice }
            : i
        );
      }
      return [...prev, {
        stockItemId: item.stockItemId,
        itemName: item.name,
        quantity: 1,
        unitPrice: item.price,
        subtotal: item.price
      }];
    });
  };

  const updateCartQty = (idx: number, delta: number) => {
    setCart(prev => {
      const updated = [...prev];
      const item = updated[idx];
      const newQty = item.quantity + delta;

      if (newQty <= 0) {
        updated.splice(idx, 1);
      } else {
        updated[idx] = { ...item, quantity: newQty, subtotal: newQty * item.unitPrice };
      }
      return updated;
    });
  };

  const handleQuickPay = () => {
    if (cart.length === 0) return;
    try {
      const bill = confirmSale(cart);
      if (bill) {
        toast.success(`Success! Bill ${bill.billNumber}`, {
          description: `₹${bill.total.toFixed(2)}`,
          duration: 2000,
        });
        setCart([]);
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] flex flex-col md:grid md:grid-cols-12 gap-4">

      {/* Category Panel */}
      <div className="md:col-span-2 overflow-x-auto md:overflow-y-auto no-scrollbar border-b md:border-b-0 md:border-r border-border pb-2 md:pb-0 md:pr-2 flex flex-row md:flex-col gap-2 shrink-0">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-3 rounded-sm whitespace-nowrap text-sm font-medium transition-colors text-left flex-shrink-0 md:w-full",
              activeCategory === cat
                ? "bg-secondary text-white shadow-sm"
                : "bg-card text-foreground border border-border hover:bg-muted"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="md:col-span-6 overflow-y-auto pr-2 space-y-3 pb-32 md:pb-0">
        <h2 className="font-semibold text-lg sticky top-0 bg-background pt-1 pb-3 z-10">{activeCategory}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {currentItems.map(item => {
            const inCart = cart.find(c => c.stockItemId === item.stockItemId && c.itemName === item.name);
            return (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-card border border-border rounded-sm p-4 text-left shadow-sm hover:border-secondary/50 hover:shadow-md transition-all active:scale-95 relative flex flex-col justify-between min-h-[100px]"
              >
                <span className="font-medium text-sm leading-tight">{item.name}</span>
                <span className="font-mono font-semibold text-primary mt-2">₹{item.price}</span>

                {inCart && (
                  <div className="absolute top-2 right-2 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {inCart.quantity}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="md:col-span-4 bg-card border border-border rounded-sm shadow-sm flex flex-col h-full overflow-hidden fixed inset-x-0 bottom-0 md:relative md:inset-auto z-50 md:z-auto max-h-[60vh] md:max-h-full">
        <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center shrink-0">
          <h2 className="font-semibold flex items-center gap-2">
            <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
            Order
          </h2>
          <button
            onClick={() => { setCart([]); }}
            className="text-xs text-muted-foreground hover:text-red-500 flex items-center gap-1 transition-colors"
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 py-10">
              <ShoppingBasketIcon />
              <p className="mt-4 text-sm font-medium">Add items to bill</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm pr-2">{item.itemName}</span>
                  <span className="font-mono font-medium text-sm whitespace-nowrap">₹{item.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span className="font-mono">₹{item.unitPrice} each</span>
                  <QuantityStepper
                    quantity={item.quantity}
                    unit="qty"
                    onIncrease={() => updateCartQty(idx, 1)}
                    onDecrease={() => updateCartQty(idx, -1)}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-border bg-muted/20 p-4 space-y-3 shrink-0">
          <div className="flex justify-between text-sm">
            <span className="font-bold text-lg">Total</span>
            <span className="font-mono font-bold text-2xl text-primary">₹{total.toFixed(2)}</span>
          </div>

          <div className="mt-2">
            <button
              onClick={() => handleQuickPay()}
              disabled={cart.length === 0}
              className="w-full bg-[#2B1D1D] hover:bg-[#3D2B2B] disabled:opacity-50 text-white font-bold py-5 rounded-sm flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 transition-all"
            >
              <span className="text-xs opacity-70 tracking-widest uppercase">Tap to Finalize</span>
              <span className="text-xl">COLLECT CASH</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Cart (Optional implementation detail, ignoring full complex mobile cart for brevity, focusing on the UI defined) */}
    </div>
  );
}

function ShoppingBasketIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 11-1 9" />
      <path d="m19 11-4-7" />
      <path d="M2 11h20" />
      <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" />
      <path d="M4.5 15.5h15" />
      <path d="m5 11 4-7" />
      <path d="m9 11 1 9" />
    </svg>
  );
}
