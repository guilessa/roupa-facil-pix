
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CheckoutPage from "./components/CheckoutPage";
import ThankYouPage from "./components/ThankYouPage";
import { CartSummary, CartItem } from "./types/types";

const queryClient = new QueryClient();

const App = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const calculateCartSummary = (): CartSummary => {
    let totalQuantity = 0;
    let totalPrice = 0;
    
    cartItems.forEach(item => {
      const itemQuantity = item.selectedSizes.reduce((sum, size) => sum + size.quantity, 0);
      totalQuantity += itemQuantity;
      totalPrice += item.product.price * itemQuantity;
    });
    
    return {
      items: cartItems,
      totalQuantity,
      totalPrice
    };
  };
  
  const handleClearCart = () => {
    setCartItems([]);
  };
  
  const cartSummary = calculateCartSummary();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/checkout" element={<CheckoutPage cart={cartSummary} />} />
            <Route path="/obrigado" element={<ThankYouPage cart={cartSummary} onClearCart={handleClearCart} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
