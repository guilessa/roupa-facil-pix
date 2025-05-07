
import React from "react";
import { Button } from "@/components/ui/button";
import { CartItem, CartSummary as CartSummaryType } from "@/types/types";
import { useNavigate } from "react-router-dom";

interface CartSummaryProps {
  cart: CartSummaryType;
  onClearCart: () => void;
}

const CartSummary = ({ cart, onClearCart }: CartSummaryProps) => {
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    navigate("/checkout");
  };
  
  if (cart.totalQuantity === 0) {
    return null;
  }
  
  return (
    <div className="sticky bottom-0 bg-white border-t shadow-md p-4 mt-8">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Total de itens:</span>
            <span>{cart.totalQuantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-lg">Total:</span>
            <span className="font-bold text-lg">
              {cart.totalPrice.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
          
          <div className="flex space-x-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClearCart}
            >
              Limpar
            </Button>
            <Button 
              className="flex-1 bg-shop-primary hover:bg-shop-secondary"
              onClick={handleCheckout}
              disabled={cart.totalQuantity === 0}
            >
              Finalizar Pedido
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
