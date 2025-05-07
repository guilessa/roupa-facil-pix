
import React from "react";
import { Button } from "@/components/ui/button";
import { CartSummary } from "@/types/types";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

interface CheckoutPageProps {
  cart: CartSummary;
}

const CheckoutPage = ({ cart }: CheckoutPageProps) => {
  const navigate = useNavigate();
  
  const handleConfirmOrder = () => {
    navigate("/obrigado");
  };
  
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Resumo do Pedido</h1>
        <Separator className="mb-4" />
        
        {cart.items.map((item) => (
          item.selectedSizes.some(size => size.quantity > 0) && (
            <div key={item.product.id} className="border-b py-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 flex-shrink-0">
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">{item.product.description}</p>
                  
                  <div className="mt-2">
                    {item.selectedSizes
                      .filter(size => size.quantity > 0)
                      .map(size => (
                        <span 
                          key={size.size}
                          className="inline-block mr-3 text-sm"
                        >
                          {size.size} x {size.quantity}
                        </span>
                      ))
                    }
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {(item.product.price * item.selectedSizes.reduce((sum, s) => sum + s.quantity, 0)).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </p>
                </div>
              </div>
            </div>
          )
        ))}
        
        <div className="mt-4 py-4">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Total de itens:</span>
            <span>{cart.totalQuantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-xl">Total:</span>
            <span className="font-bold text-xl">
              {cart.totalPrice.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Forma de Pagamento</h2>
        <Separator className="mb-4" />
        
        <div className="bg-shop-accent p-4 rounded-md">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-shop-primary rounded-full flex items-center justify-center text-white mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="12" x="2" y="6" rx="2" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold">PIX</h3>
              <p className="text-sm text-gray-600">Pagamento instantâneo</p>
            </div>
          </div>
        </div>
      </div>
      
      <Button 
        className="w-full mt-8 bg-shop-primary hover:bg-shop-secondary text-white py-3 text-lg"
        onClick={handleConfirmOrder}
      >
        Confirmar Pedido
      </Button>
    </div>
  );
};

export default CheckoutPage;
