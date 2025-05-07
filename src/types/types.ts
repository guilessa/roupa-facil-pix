
export type Size = "PP" | "P" | "M" | "G" | "GG";

export interface SizeQuantity {
  size: Size;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

export interface CartItem {
  product: Product;
  selectedSizes: SizeQuantity[];
}

export interface CartSummary {
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}
