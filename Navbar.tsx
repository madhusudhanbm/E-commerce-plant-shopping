import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { items } = useCart();
  const [isAdmin, setIsAdmin] = useState(false);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user?.id)
        .single();
      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="text-xl font-bold text-gray-800">
              Plant Paradise
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link to="/orders" className="text-gray-600 hover:text-gray-900">
                  My Orders
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                  Profile
                </Link>
                <Link to="/cart" className="relative">
                  <ShoppingCart className="h-6 w-6 text-gray-600" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <div className="relative">
                  <button 
                    onClick={() => signOut()} 
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="h-6 w-6" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}