
import React from "react";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

const QuantitySelector = ({
  quantity,
  onChange,
  min = 0,
  max = 99,
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
    <div className="flex items-center border rounded-md">
      <button
        className="px-3 py-1 border-r hover:bg-gray-100"
        onClick={decreaseQuantity}
        disabled={quantity <= min}
      >
        -
      </button>
      <span className="px-4 py-1 text-center min-w-[40px]">{quantity}</span>
      <button
        className="px-3 py-1 border-l hover:bg-gray-100"
        onClick={increaseQuantity}
        disabled={quantity >= max}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
