
import React from "react";
import { Size, SizeQuantity } from "@/types/types";
import { cn } from "@/lib/utils";
import QuantitySelector from "./QuantitySelector";

interface SizeSelectorProps {
  availableSizes: Size[];
  selectedSizes: SizeQuantity[];
  onSizeSelect: (size: Size, quantity: number) => void;
}

const SizeSelector = ({
  availableSizes,
  selectedSizes,
  onSizeSelect,
}: SizeSelectorProps) => {
  const getQuantityForSize = (size: Size) => {
    const sizeEntry = selectedSizes.find((entry) => entry.size === size);
    return sizeEntry ? sizeEntry.quantity : 0;
  };

  const handleQuantityChange = (size: Size, quantity: number) => {
    onSizeSelect(size, quantity);
  };

  return (
    <div className="flex flex-col mt-4">
      <h3 className="text-sm font-medium mb-2">Tamanhos:</h3>
      <div className="flex flex-wrap gap-3">
        {availableSizes.map((size) => {
          const quantity = getQuantityForSize(size);
          return (
            <div key={size} className="flex flex-col items-center">
              <button
                className={cn(
                  "w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium transition-colors",
                  quantity > 0
                    ? "bg-shop-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
                onClick={() => handleQuantityChange(size, quantity > 0 ? 0 : 1)}
              >
                {size}
              </button>
              
              {quantity > 0 && (
                <div className="mt-2">
                  <QuantitySelector
                    quantity={quantity}
                    onChange={(newQuantity) => handleQuantityChange(size, newQuantity)}
                    min={0}
                    max={99}
                    size="sm"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SizeSelector;
