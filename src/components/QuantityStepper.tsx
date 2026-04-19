import { Plus, Minus } from "lucide-react";
import { cn } from "../lib/utils";

interface QuantityStepperProps {
  quantity: number;
  unit: string;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
}

export function QuantityStepper({ quantity, unit, onIncrease, onDecrease, disabled }: QuantityStepperProps) {
  return (
    <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-sm border border-border">
      <button 
        onClick={onDecrease} 
        disabled={disabled}
        className={cn("p-1.5 rounded bg-card hover:bg-muted text-foreground transition-colors disabled:opacity-50")}
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <div className="min-w-[4rem] text-center font-mono text-sm leading-none flex flex-col justify-center">
        <span>{quantity}</span>
        <span className="text-[10px] text-muted-foreground uppercase">{unit}</span>
      </div>
      <button 
        onClick={onIncrease} 
        disabled={disabled}
        className={cn("p-1.5 rounded bg-card hover:bg-muted text-foreground transition-colors disabled:opacity-50")}
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
