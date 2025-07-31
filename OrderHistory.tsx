import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { Order } from '../types';

// Mock data for demonstration
const mockOrders: Order[] = [
  {
    id: '1',
    user_id: '123',
    items: [
      {
        id: 1,
        name: "Eco-Friendly Water Bottle",
        price: 24.99,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
        description: "Sustainable stainless steel water bottle",
        category: "Accessories"
      }
    ],
    total: 49.98,
    status: 'delivered',
    created_at: '2024-02-20T10:00:00Z',
    shipping_address: {
      street: '123 Green St',
      city: 'Eco City',
      state: 'EC',
      zip: '12345'
    }
  },
  // Add more mock orders as needed
];

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // In a real application, you would fetch orders from your backend
    setOrders(mockOrders);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Order History</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className={`
                        px-3 py-1 rounded-full text-sm font-medium
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'}
                      `}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900">Items</h3>
                    <div className="mt-4 space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity} × ₹{(item.price * 83).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-6">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Shipping Address</p>
                        <p className="text-sm text-gray-600">{order.shipping_address.street}</p>
                        <p className="text-sm text-gray-600">
                          {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">Total</p>
                        <p className="text-xl font-semibold text-green-600">
                          ₹{(order.total * 83).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}