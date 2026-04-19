import { NavLink as RouterNavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, BarChart3, Settings, LogOut, Coffee } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export function AppLayout() {
  const { role, logout, settings } = useAppContext();
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/pos", icon: ShoppingCart, label: "POS" },
    ...(role === 'owner' ? [
      { to: "/reports", icon: BarChart3, label: "Reports" },
      { to: "/settings", icon: Settings, label: "Settings" }
    ] : [])
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-primary text-primary-foreground fixed inset-y-0 z-20">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-sm text-primary">
              <Coffee size={24} />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-white">{settings.cafeName}</h1>
          </div>
        </div>
        
        <nav className="flex-1 mt-8 px-4 space-y-1">
          {navItems.map((item) => (
            <RouterNavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors text-sm font-medium",
                isActive 
                  ? "bg-secondary text-white" 
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </RouterNavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-primary-foreground/10">
          <div className="mb-4 px-3 text-xs text-white/50 uppercase tracking-wider font-semibold">
            {role === 'owner' ? 'Owner' : 'Staff'}
          </div>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-sm transition-colors text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-56 pb-20 md:pb-0 min-h-screen">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-primary text-primary-foreground flex justify-around items-center border-t border-primary/20 z-50 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <RouterNavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 p-3 transition-colors",
                isActive ? "text-secondary" : "text-white/60"
              )}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </RouterNavLink>
          );
        })}
        <button 
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 p-3 transition-colors text-white/60"
        >
          <LogOut size={20} />
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </nav>
    </div>
  );
}
