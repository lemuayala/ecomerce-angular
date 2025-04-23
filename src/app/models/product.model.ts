export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  tags?: string[];
  metadata?: { [key: string]: string };
  discount?: number; // Para manejar descuentos
  imageUrl?: string;
  featured?: boolean;
}
