import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Delete } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';

export function Login() {
  const [pin, setPin] = useState('');
  const { login, settings } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (pin.length === 4) {
      const timer = setTimeout(() => {
        const success = login(pin);
        if (success) {
          toast.success("Login successful!");
          navigate('/dashboard');
        } else {
          toast.error("Invalid PIN. Please try again.");
          setPin('');
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [pin, login, navigate]);

  const handleKeyClick = (key: string) => {
    if (key === 'back') {
      setPin(prev => prev.slice(0, -1));
    } else if (pin.length < 4) {
      setPin(prev => prev + key);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in duration-300">
        <div className="bg-primary p-4 rounded-xl shadow-lg mb-8 text-white">
          <Coffee size={40} />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-2">{settings.cafeName}</h1>
        <p className="text-muted-foreground mb-8 text-sm">Enter your 4-digit PIN</p>

        {/* PIN Indicators */}
        <div className="flex gap-4 mb-10">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i}
              className={cn(
                "w-4 h-4 rounded-full transition-all duration-200",
                i < pin.length ? "bg-secondary scale-110" : "bg-border"
              )}
            />
          ))}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleKeyClick(num.toString())}
              className="h-16 rounded-full bg-card shadow-sm border border-border text-2xl font-medium text-foreground hover:bg-muted active:bg-border transition-colors flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <div /> {/* Empty space */}
          <button
            onClick={() => handleKeyClick('0')}
            className="h-16 rounded-full bg-card shadow-sm border border-border text-2xl font-medium text-foreground hover:bg-muted active:bg-border transition-colors flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={() => handleKeyClick('back')}
            className="h-16 rounded-full bg-muted/50 border border-border text-foreground hover:bg-muted active:bg-border transition-colors flex items-center justify-center"
          >
            <Delete size={24} className="ml-[-4px]" />
          </button>
        </div>

      </div>
    </div>
  );
}
