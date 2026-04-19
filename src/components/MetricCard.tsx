import React from "react";
import { cn } from "../lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  highlighted?: boolean;
}

export function MetricCard({ title, value, icon, className, highlighted }: MetricCardProps) {
  return (
    <div className={cn(
      "bg-card text-foreground p-6 rounded-sm border border-border shadow-sm flex flex-col justify-between items-start",
      highlighted && "border-secondary/50 shadow-md",
      className
    )}>
      <div className="flex justify-between items-center w-full mb-4 text-muted-foreground">
        <h3 className="text-sm font-medium">{title}</h3>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="text-2xl font-bold">
        {value}
      </div>
    </div>
  );
}
