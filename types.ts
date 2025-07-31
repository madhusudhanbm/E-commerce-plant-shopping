export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  type: 'plant' | 'herb' | 'flower';
  care_level: 'easy' | 'medium' | 'expert';
  sunlight: 'full' | 'partial' | 'shade';
  water: 'low' | 'moderate' | 'high';
  in_stock: boolean;
  stock_quantity: number;
  size: 'small' | 'medium' | 'large';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  created_at: string;
  shipping_address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface WishlistItem {
  id: string;
  user_id: string;
  plant_id: string;
  created_at: string;
  plant: Product;
}