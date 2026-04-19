import { IndianRupee, FileText, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MetricCard } from '../components/MetricCard';

import { toast } from 'sonner';

export function Dashboard() {
  const { role, settings, bills, logout, isShiftActive, toggleShift } = useAppContext();

  // Metrics calculation
  const today = new Date();
  const todayStr = today.toDateString();
  const todaysBills = bills.filter(b => new Date(b.createdAt).toDateString() === todayStr);
  
  const todayRevenue = todaysBills.reduce((sum, b) => sum + b.total, 0);
  
  // Additional Revenue Calculations
  const startOfWeek = new Date();
  startOfWeek.setDate(today.getDate() - today.getDay());
  const weeklyRevenue = bills
    .filter(b => new Date(b.createdAt) >= startOfWeek)
    .reduce((sum, b) => sum + b.total, 0);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthlyRevenue = bills
    .filter(b => new Date(b.createdAt) >= startOfMonth)
    .reduce((sum, b) => sum + b.total, 0);

  const handleStartStore = () => {
    if (window.confirm("Start a new session for today?")) {
      toggleShift(true);
      toast.success("Store is now OPEN! Happy selling! ☕");
    }
  };

  const handleCloseStore = async () => {
    if (window.confirm(`Are you sure you want to close the store for today?\n\nToday's Revenue: ₹${todayRevenue.toFixed(2)}`)) {
      
      const dailyItemAggregate = todaysBills.reduce((acc, bill) => {
        bill.items.forEach(item => {
          acc[item.itemName] = (acc[item.itemName] || 0) + item.quantity;
        });
        return acc;
      }, {} as Record<string, number>);

      const itemSummaryString = Object.entries(dailyItemAggregate)
        .map(([name, qty]) => `• ${qty}x ${name}`)
        .join("\n");

      const topItemEntry = Object.entries(dailyItemAggregate).sort((a,b) => b[1] - a[1])[0];
      const topItemName = topItemEntry ? topItemEntry[0] : "None";
      
      // Generate Professional WhatsApp Message
      const message = `*🌿 SIP'S CHAI - END OF DAY REPORT*\n` +
        `📅 *Date:* ${todayStr}\n` +
        `---------------------------\n` +
        `💰 *Today's Revenue:* ₹${todayRevenue.toFixed(2)}\n` +
        `🧾 *Bills Issued:* ${todaysBills.length}\n` +
        `⭐ *Best Seller:* ${topItemName}\n\n` +
        `*📈 Current Period Totals:*\n` +
        `• This Week: ₹${weeklyRevenue.toFixed(0)}\n` +
        `• This Month: ₹${monthlyRevenue.toFixed(0)}\n\n` +
        `*📦 Item Breakdown:*\n${itemSummaryString}\n\n` +
        `_Store closed successfully._`;

      const whatsappUrl = `https://wa.me/${settings.ownerPhone || '919581312076'}?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
      toast.success("Opening WhatsApp Summary...");
      toggleShift(false);
      logout();
    }
  };

  const pendingSyncCount = bills.filter(b => !b.isSynced).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {role === 'owner' ? settings.ownerName : 'Staff'}</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-muted-foreground text-sm">Today at {settings.cafeName}</p>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted border border-border">
              {pendingSyncCount === 0 ? (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                  <span className="text-[10px] font-bold text-muted-foreground">ALL SYNCED</span>
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                  <span className="text-[10px] font-bold text-amber-600 tracking-tight">{pendingSyncCount} PENDING SYNC</span>
                </>
              )}
            </div>
          </div>
        </div>
        {!isShiftActive ? (
          <button 
            onClick={handleStartStore}
            className="bg-[#6F4E37] hover:bg-[#5D4037] text-white px-6 py-2 rounded-sm text-sm font-bold transition-all shadow-md"
          >
            START STORE
          </button>
        ) : (
          <button 
            onClick={handleCloseStore}
            className="bg-[#D32F2F] hover:bg-[#C62828] text-white px-6 py-2 rounded-sm text-sm font-bold transition-all shadow-md"
          >
            CLOSE STORE
          </button>
        )}
      </header>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Today's Sales" 
          value={`₹${todayRevenue.toFixed(0)}`} 
          icon={<IndianRupee size={20} />} 
        />
        <MetricCard 
          title="This Week" 
          value={`₹${weeklyRevenue.toFixed(0)}`} 
          icon={<TrendingUp size={20} />} 
        />
        <MetricCard 
          title="This Month" 
          value={`₹${monthlyRevenue.toFixed(0)}`} 
          icon={<TrendingUp size={20} />} 
        />
        <MetricCard 
          title="Total Bills" 
          value={todaysBills.length} 
          icon={<FileText size={20} />} 
        />
      </div>



      {/* Recent Bills */}
      <div className="bg-card border border-border shadow-sm rounded-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-muted/20">
          <h2 className="font-semibold">Recent Bills</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/10 text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3">Bill Number</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bills.slice(0, 5).map(bill => (
                <tr key={bill.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs">{bill.billNumber}</td>
                  <td className="px-5 py-3">{bill.items.reduce((s, i) => s + i.quantity, 0)} items</td>
                  <td className="px-5 py-3">
                    <span className="capitalize px-2 py-0.5 bg-muted rounded font-medium text-[11px] border border-border/50">
                      {bill.paymentMode}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-mono font-medium">
                    ₹{bill.total.toFixed(2)}
                  </td>
                </tr>
              ))}
              {bills.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                    No bills generated yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
