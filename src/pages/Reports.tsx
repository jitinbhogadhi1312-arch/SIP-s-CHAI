import { useMemo } from 'react';
import { IndianRupee, FileText, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { MetricCard } from '../components/MetricCard';

export function Reports() {
  const { bills } = useAppContext();

  const totalRevenue = bills.reduce((sum, b) => sum + b.total, 0);
  const totalBills = bills.length;
  const avgBillValue = totalBills > 0 ? (totalRevenue / totalBills) : 0;

  // Chart data: past 7 days
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);

      const dayBills = bills.filter(b => {
        const bDate = new Date(b.createdAt);
        bDate.setHours(0, 0, 0, 0);
        return bDate.getTime() === d.getTime();
      });

      const revenue = dayBills.reduce((s, b) => s + b.total, 0);
      data.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue,
      });
    }
    return data;
  }, [bills]);

  // Top 5 items
  const topItems = useMemo(() => {
    const itemMap = new Map<string, { name: string, qty: number, rev: number }>();

    bills.forEach(bill => {
      bill.items.forEach(item => {
        const existing = itemMap.get(item.stockItemId) || { name: item.itemName, qty: 0, rev: 0 };
        existing.qty += item.quantity;
        existing.rev += item.subtotal;
        itemMap.set(item.stockItemId, existing);
      });
    });

    return Array.from(itemMap.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [bills]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Financial Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">Overall cafe performance metrics.</p>
      </header>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Revenue (All Time)"
          value={`₹${totalRevenue.toFixed(2)}`}
          icon={<IndianRupee size={20} />}
        />
        <MetricCard
          title="Total Bills"
          value={totalBills}
          icon={<FileText size={20} />}
        />
        <MetricCard
          title="Avg Bill Value"
          value={`₹${avgBillValue.toFixed(2)}`}
          icon={<TrendingUp size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-card border border-border shadow-sm rounded-sm p-5">
          <h2 className="font-semibold mb-6 flex items-center gap-2">
            Weekly Revenue
          </h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={value => `₹${value}`}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                  contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`₹${value}`, 'Revenue']}
                />
                <Bar
                  dataKey="revenue"
                  fill="hsl(var(--secondary))"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Items table */}
        <div className="bg-card border border-border shadow-sm rounded-sm p-0 overflow-hidden flex flex-col">
          <div className="px-5 py-5 border-b border-border bg-muted/10 flex items-center gap-2">
            <Award className="text-secondary" size={20} />
            <h2 className="font-semibold">Top 5 Selling Items</h2>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left h-full">
              <thead className="bg-muted/5 text-muted-foreground uppercase text-[10px] font-semibold tracking-wider border-b border-border">
                <tr>
                  <th className="px-5 py-3 w-16">Rank</th>
                  <th className="px-5 py-3">Item Name</th>
                  <th className="px-5 py-3 text-right">Qty</th>
                  <th className="px-5 py-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/5 transition-colors">
                    <td className="px-5 py-3 text-center">
                      <div className="bg-muted text-muted-foreground w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mx-auto border border-border">
                        {idx + 1}
                      </div>
                    </td>
                    <td className="px-5 py-3 font-medium">{item.name}</td>
                    <td className="px-5 py-3 text-right font-mono text-xs">{item.qty}</td>
                    <td className="px-5 py-3 text-right font-mono font-medium text-primary">
                      ₹{item.rev.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {topItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                      No sales data available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
