
import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}

const QuantitySelector = ({
  quantity,
  onChange,
  min = 0,
  max = 99,
  size = "md",
}: QuantitySelectorProps) => {
  const decreaseQuantity = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className={cn(
      "flex items-center border rounded-md",
      size === "sm" ? "h-8" : "h-10",
    )}>
      <Button
        type="button"
        variant="ghost"
        size={size === "sm" ? "sm" : "default"}
        className={cn(
          "h-full px-2 rounded-l-md rounded-r-none border-r hover:bg-gray-100",
          quantity <= min && "opacity-50 cursor-not-allowed"
        )}
        onClick={decreaseQuantity}
        disabled={quantity <= min}
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <span 
        className={cn(
          "px-2 py-1 text-center font-medium select-none",
          size === "sm" ? "min-w-[30px] text-sm" : "min-w-[40px]"
        )}
      >
        {quantity}
      </span>
      <Button
        type="button"
        variant="ghost"
        size={size === "sm" ? "sm" : "default"}
        className={cn(
          "h-full px-2 rounded-r-md rounded-l-none border-l hover:bg-gray-100",
          quantity >= max && "opacity-50 cursor-not-allowed"
        )}
        onClick={increaseQuantity}
        disabled={quantity >= max}
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default QuantitySelector;
