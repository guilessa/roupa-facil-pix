
import React from "react";
import { Product, Size, SizeQuantity } from "@/types/types";
import SizeSelector from "./SizeSelector";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
  selectedSizes: SizeQuantity[];
  onSizeSelect: (productId: number, size: Size, quantity: number) => void;
}

const ProductCard = ({
  product,
  selectedSizes,
  onSizeSelect,
}: ProductCardProps) => {
  const availableSizes: Size[] = ["PP", "P", "M", "G", "GG"];
  
  const handleSizeSelect = (size: Size, quantity: number) => {
    onSizeSelect(product.id, size, quantity);
  };

  const totalQuantity = selectedSizes.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative pt-[100%]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium">{product.name}</h3>
          <span className="font-bold text-shop-primary">
            {product.price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 mb-3">{product.description}</p>
        
        <SizeSelector
          availableSizes={availableSizes}
          selectedSizes={selectedSizes}
          onSizeSelect={handleSizeSelect}
        />

        {totalQuantity > 0 && (
          <div className="mt-4 bg-shop-accent p-2 rounded-md">
            <p className="text-sm text-shop-secondary font-medium">
              {totalQuantity} item{totalQuantity > 1 ? 'ns' : ''} selecionado{totalQuantity > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
