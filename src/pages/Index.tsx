
import React from "react";
import ProductCard from "@/components/ProductCard";
import CartSummary from "@/components/CartSummary";
import { CartItem, CartSummary as CartSummaryType, Size } from "@/types/types";
import { Loader2 } from "lucide-react";

interface IndexProps {
  cartItems: CartItem[];
  isLoading: boolean;
  onSizeSelect: (productId: string, size: Size, quantity: number) => void;
  onClearCart: () => void;
  cartSummary: CartSummaryType;
}

const Index = ({
  cartItems,
  isLoading,
  onSizeSelect,
  onClearCart,
  cartSummary
}: IndexProps) => {
  const handleSizeSelect = (productId: string, size: Size, quantity: number) => {
    onSizeSelect(productId, size, quantity);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 mb-6">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-shop-primary">Roupa Fácil</h1>
        </div>
      </header>
      
      <main className="container max-w-6xl mx-auto px-4 pb-24">
        <h2 className="text-xl font-semibold mb-6">Escolha suas camisas</h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-shop-primary" />
            <span className="ml-2">Carregando produtos...</span>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p>Nenhum produto disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {cartItems.map(item => (
              <ProductCard
                key={item.product.id}
                product={item.product}
                selectedSizes={item.selectedSizes}
                onSizeSelect={(size, quantity) => handleSizeSelect(item.product.id, size, quantity)}
              />
            ))}
          </div>
        )}
      </main>
      
      <CartSummary 
        cart={cartSummary} 
        onClearCart={onClearCart}
      />
    </div>
  );
};

export default Index;
