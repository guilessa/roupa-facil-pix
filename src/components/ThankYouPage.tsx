
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CartSummary } from "@/types/types";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";

interface ThankYouPageProps {
  cart: CartSummary;
  onClearCart: () => void;
}

const ThankYouPage = ({ cart, onClearCart }: ThankYouPageProps) => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<{
    id: string;
    customer_name: string;
    customer_phone: string;
  } | null>(null);
  
  useEffect(() => {
    // Buscar os dados do último pedido
    const fetchLatestOrder = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, customer_name, customer_phone')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (!error && data) {
        setOrderDetails(data);
      }
    };
    
    fetchLatestOrder();
    
    // Limpar o carrinho quando sair desta página
    return () => {
      onClearCart();
    };
  }, [onClearCart]);

  const formatPhone = (phone: string) => {
    if (!phone) return "";
    phone = phone.replace(/\D/g, '');
    if (phone.length === 11) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
    }
    if (phone.length === 10) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`;
    }
    return phone;
  };
  
  const handleWhatsApp = () => {
    const encodedMessage = encodeURIComponent(
      `Olá! Acabei de fazer um pedido na Roupa Fácil no valor de ${cart.totalPrice.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}. Gostaria de enviar o comprovante do PIX.`
    );
    
    // Número padrão da loja para receber comprovantes
    window.open(`https://wa.me/5521968428374?text=${encodedMessage}`, '_blank');
  };
  
  return (
    <div className="container max-w-2xl mx-auto py-16 px-4 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-600"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Obrigado pelo seu pedido!</h1>
        
        {orderDetails && (
          <div className="mb-4">
            <p className="text-lg">
              Olá, <span className="font-medium">{orderDetails.customer_name}</span>!
            </p>
            <p className="text-gray-600">
              Seu pedido foi registrado com sucesso.
            </p>
          </div>
        )}
        
        <div className="bg-white p-6 rounded-lg shadow-sm border my-8 text-left">
          <h3 className="font-bold text-lg mb-4">Resumo do Pedido</h3>
          <Separator className="mb-4" />
          
          {orderDetails && (
            <div className="mb-4">
              <p><span className="font-medium">Nome:</span> {orderDetails.customer_name}</p>
              <p><span className="font-medium">Telefone:</span> {formatPhone(orderDetails.customer_phone)}</p>
            </div>
          )}
          
          <p className="font-medium">Total: {cart.totalPrice.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}</p>
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Instruções de Pagamento:</h4>
            <p className="text-sm">
              1. Abra o aplicativo do seu banco<br />
              2. Selecione a opção PIX<br />
              3. Envie o valor para a chave PIX: <span className="font-medium">loja@roupafacil.com.br</span><br />
              4. Envie o comprovante pelo WhatsApp
            </p>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 mt-6">
          <Button
            onClick={handleWhatsApp}
            className="bg-green-600 hover:bg-green-700"
          >
            Enviar Comprovante via WhatsApp
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate("/")}
          >
            Voltar à Loja
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
