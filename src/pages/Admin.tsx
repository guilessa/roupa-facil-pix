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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 