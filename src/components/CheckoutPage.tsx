
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CartSummary } from "@/types/types";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CheckoutPageProps {
  cart: CartSummary;
}

const CheckoutPage = ({ cart }: CheckoutPageProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    phone: ""
  });
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      phone: ""
    };
    
    if (!customerName.trim()) {
      newErrors.name = "Nome é obrigatório";
      isValid = false;
    }
    
    if (!customerPhone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
      isValid = false;
    } else if (!/^[0-9]{10,11}$/.test(customerPhone.replace(/\D/g, ''))) {
      newErrors.phone = "Telefone inválido (DDD + número)";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value);
    setCustomerPhone(formattedPhone);
  };
  
  const handleConfirmOrder = async () => {
    if (cart.totalQuantity === 0) {
      toast.error("Seu carrinho está vazio.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Criar o pedido principal com os dados do cliente
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName,
          customer_phone: customerPhone.replace(/\D/g, ''), // Remove formatação
          total_amount: cart.totalPrice,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Criar os itens do pedido
      const orderItems = [];
      for (const item of cart.items) {
        for (const size of item.selectedSizes) {
          if (size.quantity > 0) {
            orderItems.push({
              order_id: orderData.id,
              product_id: item.product.id,
              size: size.size,
              quantity: size.quantity,
              price: item.product.price
            });
          }
        }
      }

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast.success("Pedido criado com sucesso!");
      navigate("/obrigado");
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      toast.error("Ocorreu um erro ao finalizar o pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
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
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Seus Dados</h2>
        <Separator className="mb-4" />
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input 
              id="name" 
              type="text" 
              placeholder="Digite seu nome completo" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <Label htmlFor="phone">Telefone (WhatsApp)</Label>
            <Input 
              id="phone" 
              type="text" 
              placeholder="(00) 00000-0000" 
              value={customerPhone}
              onChange={handlePhoneChange}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
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
        disabled={isSubmitting || cart.totalQuantity === 0}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          "Confirmar Pedido"
        )}
      </Button>
    </div>
  );
};

export default CheckoutPage;
