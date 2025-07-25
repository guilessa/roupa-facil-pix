import * as React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OrderItem {
  id: string;
  size: string;
  quantity: number;
  price: number;
  product_id: string;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  order_items: OrderItem[];
}

export function Admin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<{ [key: string]: { [key: string]: number } }>({});
  const [totalSales, setTotalSales] = useState(0);
  const [estimatedTotal, setEstimatedTotal] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (
              name
            )
          )
        `)
        .order('customer_name', { ascending: true });

      if (error) throw error;
      setOrders(data || []);
      
      // Calcular o total de vendas aprovadas
      const approvedTotal = data
        ?.filter(order => order.status === 'approved')
        .reduce((sum, order) => sum + order.total_amount, 0) || 0;
      setTotalSales(approvedTotal);

      // Calcular o valor estimado total (todos os pedidos)
      const totalEstimated = data
        ?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      setEstimatedTotal(totalEstimated);
      
      // Calcular o resumo dos pedidos
      const newSummary: { [key: string]: { [key: string]: number } } = {};
      data?.forEach(order => {
        order.order_items.forEach(item => {
          if (!newSummary[item.product.name]) {
            newSummary[item.product.name] = {};
          }
          newSummary[item.product.name][item.size] = (newSummary[item.product.name][item.size] || 0) + item.quantity;
        });
      });
      setSummary(newSummary);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmPayment(orderId: string) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'approved' })
        .eq('id', orderId);

      if (error) throw error;

      toast.success('Pagamento confirmado com sucesso!');
      fetchOrders(); // Atualiza a lista de pedidos
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      toast.error('Erro ao confirmar pagamento. Tente novamente.');
    }
  }

  async function handleCancelPayment(orderId: string) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'pending' })
        .eq('id', orderId);

      if (error) throw error;

      toast.success('Pagamento cancelado com sucesso!');
      fetchOrders(); // Atualiza a lista de pedidos
    } catch (error) {
      console.error('Erro ao cancelar pagamento:', error);
      toast.error('Erro ao cancelar pagamento. Tente novamente.');
    }
  }

  function calculateTotalBySize(items: OrderItem[]) {
    const totals: { [key: string]: { [key: string]: number } } = {};
    items.forEach(item => {
      if (!totals[item.product.name]) {
        totals[item.product.name] = {};
      }
      totals[item.product.name][item.size] = (totals[item.product.name][item.size] || 0) + item.quantity;
    });
    return totals;
  }

  function formatPhone(phone: string) {
    if (!phone) return "";
    phone = phone.replace(/\D/g, '');
    if (phone.length === 11) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
    }
    if (phone.length === 10) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`;
    }
    return phone;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Painel de Administração</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total de Vendas Aprovadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {totalSales.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valor Estimado Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {estimatedTotal.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
          <TabsTrigger value="summary">Resumo de Camisas</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Camisas</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{formatPhone(order.customer_phone)}</TableCell>
                      <TableCell>{order.status || 'Pendente'}</TableCell>
                      <TableCell>
                        {order.total_amount.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </TableCell>
                      <TableCell>
                        {order.order_items.map((item, index) => (
                          <div key={index}>
                            {item.product.name} - {item.size}: {item.quantity}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {order.status !== 'approved' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleConfirmPayment(order.id)}
                            >
                              Confirmar Pagamento
                            </Button>
                          )}
                          {order.status === 'approved' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelPayment(order.id)}
                            >
                              Cancelar Pagamento
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Resumo de Camisas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(summary).map(([productName, sizes]) => (
                  <div key={productName} className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">{productName}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(sizes).map(([size, quantity]) => (
                        <div key={size} className="flex justify-between items-center">
                          <span className="font-medium">{size}:</span>
                          <span>{quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 