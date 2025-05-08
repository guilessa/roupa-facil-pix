import React from "react";
import { CartItem, CartSummary as CartSummaryType, Size } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <div className="container mx-auto py-16 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Reservas Encerradas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            Obrigado pelo interesse! As reservas para esta coleção foram encerradas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;