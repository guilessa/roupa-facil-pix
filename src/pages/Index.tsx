
import React, { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import CartSummary from "@/components/CartSummary";
import { Product, Size, SizeQuantity, CartItem, CartSummary as CartSummaryType } from "@/types/types";

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Camisa Básica Branca",
    price: 49.90,
    imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Camisa básica de algodão na cor branca, ideal para o dia a dia."
  },
  {
    id: 2,
    name: "Camisa Listrada Azul",
    price: 69.90,
    imageUrl: "https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Camisa listrada em tons de azul, perfeita para ocasiões casuais."
  },
  {
    id: 3,
    name: "Camisa Estampada",
    price: 89.90,
    imageUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Camisa com estampa moderna e descolada, para um visual diferenciado."
  }
];

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Initialize cart with empty selections for each product
  useEffect(() => {
    const initialCart = PRODUCTS.map(product => ({
      product,
      selectedSizes: [] as SizeQuantity[]
    }));
    setCartItems(initialCart);
  }, []);

  const handleSizeSelect = (productId: number, size: Size, quantity: number) => {
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

  const calculateCartSummary = (): CartSummaryType => {
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
    setCartItems(prevItems => 
      prevItems.map(item => ({
        ...item,
        selectedSizes: []
      }))
    );
  };

  const cartSummary = calculateCartSummary();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 mb-6">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-shop-primary">Roupa Fácil</h1>
        </div>
      </header>
      
      <main className="container max-w-6xl mx-auto px-4 pb-24">
        <h2 className="text-xl font-semibold mb-6">Escolha suas camisas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cartItems.map(item => (
            <ProductCard
              key={item.product.id}
              product={item.product}
              selectedSizes={item.selectedSizes}
              onSizeSelect={handleSizeSelect}
            />
          ))}
        </div>
      </main>
      
      <CartSummary 
        cart={cartSummary} 
        onClearCart={handleClearCart}
      />
    </div>
  );
};

export default Index;
