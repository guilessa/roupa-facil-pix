import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CheckoutPage from "./components/CheckoutPage";
import ThankYouPage from "./components/ThankYouPage";
import { Admin } from "./pages/Admin";
import { CartSummary, CartItem, Size, SizeQuantity } from "./types/types";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      // Inicializar o carrinho com os produtos do Supabase
      const initialCart = products.map(product => ({
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.image_url,
          description: product.description || ''
        },
        selectedSizes: [] as SizeQuantity[]
      }));
      
      setCartItems(initialCart);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
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
  
  const handleSizeSelect = (productId: string, size: Size, quantity: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.product.id === productId) {
          // Check if this size already exists
          const existingIndex = item.selectedSizes.findIndex(s => s.size === size);
          
          let updatedSizes = [...item.selectedSizes];
          
          if (existingIndex >= 0) {
            // Update existing size quantity
            if (quantity === 0) {
              // Remove size if quantity is 0
              updatedSizes = updatedSizes.filter(s => s.size !== size);
            } else {
              // Update quantity for existing size
              updatedSizes[existingIndex] = { ...updatedSizes[existingIndex], quantity };
            }
          } else if (quantity > 0) {
            // Add new size if quantity > 0
            updatedSizes.push({ size, quantity });
          }
          
          return {
            ...item,
            selectedSizes: updatedSizes
          };
        }
        return item;
      })
    );
  };
  
  const handleClearCart = () => {
    setCartItems(prevItems => 
      prevItems.map(item => ({
        ...item,
        selectedSizes: []
      }))
    );
  };
  
  const cartSummary = calculateCartSummary();
  
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Index 
              cartItems={cartItems} 
              isLoading={isLoading} 
              onSizeSelect={handleSizeSelect} 
              onClearCart={handleClearCart} 
              cartSummary={cartSummary}
            />
          } />
          <Route path="/checkout" element={<CheckoutPage cart={cartSummary} />} />
          <Route path="/obrigado" element={<ThankYouPage cart={cartSummary} onClearCart={handleClearCart} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
