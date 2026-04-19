import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { StatusPill } from '../components/StatusPill';
import { QuantityStepper } from '../components/QuantityStepper';
import type { StockItem } from '../types';

export function Stock() {
  const { stockItems, updateStockQty } = useAppContext();
  const [search, setSearch] = useState('');

  const filteredStock = useMemo(() => {
    const s = search.toLowerCase();
    return stockItems.filter(item =>
      item.name.toLowerCase().includes(s) ||
      item.category.toLowerCase().includes(s)
    );
  }, [stockItems, search]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(filteredStock.map(i => i.category)));
    return cats.sort();
  }, [filteredStock]);

  const getStatus = (item: StockItem) => {
    if (item.quantity === 0) return 'critical';
    if (item.quantity <= item.minThreshold) return 'low';
    return 'good';
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stock Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Track and manage your inventory levels.</p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search item or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
      </header>

      <div className="bg-card border border-border shadow-sm rounded-sm">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No items found matching "{search}"
          </div>
        ) : (
          categories.map((category, cIdx) => (
            <div key={category} className={cIdx > 0 ? "border-t border-border" : ""}>
              <div className="bg-muted/10 px-5 py-3 border-b border-border">
                <h2 className="font-semibold text-[13px] uppercase tracking-wider text-primary">{category}</h2>
              </div>
              <div className="divide-y divide-border">
                {filteredStock.filter(i => i.category === category).map(item => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-muted/5 transition-colors">

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-[15px]">{item.name}</span>
                        <StatusPill status={getStatus(item)} />
                      </div>
                      <div className="font-mono text-xs text-muted-foreground">
                        Sell Price: ₹{item.sellPrice} / {item.unit}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <QuantityStepper
                        quantity={item.quantity}
                        unit={item.unit}
                        onIncrease={() => updateStockQty(item.id, 1)}
                        onDecrease={() => updateStockQty(item.id, -1)}
                      />
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
