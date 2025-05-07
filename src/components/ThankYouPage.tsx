
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CartSummary } from "@/types/types";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ThankYouPageProps {
  cart: CartSummary;
  onClearCart: () => void;
}

const ThankYouPage = ({ cart, onClearCart }: ThankYouPageProps) => {
  const navigate = useNavigate();
  const phoneNumber = "5521968428374";
  const [orderId, setOrderId] = useState<string | null>(null);
  
  useEffect(() => {
    const getLastOrder = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Erro ao buscar último pedido:', error);
        return;
      }
      
      if (data && data.length > 0) {
        setOrderId(data[0].id);
      }
    };
    
    getLastOrder();
  }, []);
  
  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Olá! Acabei de fazer um pedido #${orderId || ''} no valor de ${cart.totalPrice.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })}. Estou enviando o comprovante do pagamento via Pix.`);
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    onClearCart();
    navigate("/");
  };
  
  const formatPhoneNumber = (phone: string) => {
    return `+${phone.substring(0, 2)} ${phone.substring(2, 4)} ${phone.substring(4, 9)}-${phone.substring(9)}`;
  };
  
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Pedido Recebido!</h1>
        <p className="text-gray-600">
          Seu pedido foi registrado com sucesso. Agora é só fazer o pagamento e enviar o comprovante.
        </p>
        {orderId && (
          <p className="mt-2 font-medium">Número do pedido: #{orderId}</p>
        )}
      </div>
      
      <div className="bg-shop-accent p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Instruções de Pagamento</h2>
        <Separator className="mb-4" />
        
        <div className="space-y-4">
          <div>
            <p className="font-medium mb-1">1. Faça o pagamento via PIX para:</p>
            <p className="bg-white p-3 rounded border text-center font-bold">{formatPhoneNumber(phoneNumber)}</p>
          </div>
          
          <div>
            <p className="font-medium mb-1">2. Valor total do pedido:</p>
            <p className="bg-white p-3 rounded border text-center font-bold">
              {cart.totalPrice.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
          </div>
          
          <div>
            <p className="font-medium mb-1">3. Após o pagamento, clique no botão abaixo para enviar o comprovante pelo WhatsApp para o mesmo número.</p>
          </div>
        </div>
      </div>
      
      <Button
        onClick={handleWhatsApp}
        className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 py-6 text-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-whatsapp">
          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
        </svg>
        Enviar Comprovante pelo WhatsApp
      </Button>
    </div>
  );
};

export default ThankYouPage;
