import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { WishlistItem } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select(`
            id,
            user_id,
            plant_id,
            created_at,
            plant:plants(*)
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        setWishlistItems(data as WishlistItem[]);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  const addToWishlist = async (plantId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .insert({ user_id: user.id, plant_id: plantId });

      if (error) throw error;

      // Refresh wishlist
      const { data } = await supabase
        .from('wishlists')
        .select(`
          id,
          user_id,
          plant_id,
          created_at,
          plant:plants(*)
        `)
        .eq('user_id', user.id);

      setWishlistItems(data as WishlistItem[]);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (plantId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('plant_id', plantId);

      if (error) throw error;

      setWishlistItems(items => items.filter(item => item.plant_id !== plantId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const isInWishlist = (plantId: string) => {
    return wishlistItems.some(item => item.plant_id === plantId);
  };

  return {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };
}