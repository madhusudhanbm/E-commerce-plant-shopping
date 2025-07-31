import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Product } from '../types';

interface UsePlantsProps {
  page?: number;
  pageSize?: number;
  category?: string;
  type?: string;
  careLevel?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  searchTerm?: string;
  sortBy?: string;
}

interface UsePlantsReturn {
  plants: Product[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
  hasMore: boolean;
}

export function usePlants({
  page = 1,
  pageSize = 12,
  category,
  type,
  careLevel,
  size,
  minPrice,
  maxPrice,
  inStockOnly,
  searchTerm,
  sortBy = 'name'
}: UsePlantsProps): UsePlantsReturn {
  const [plants, setPlants] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('plants')
          .select('*', { count: 'exact' });

        // Apply filters
        if (category && category !== 'All') {
          query = query.eq('category', category);
        }
        if (type && type !== 'All Types') {
          query = query.eq('type', type.toLowerCase());
        }
        if (careLevel && careLevel !== 'All Levels') {
          query = query.eq('care_level', careLevel.toLowerCase());
        }
        if (size && size !== 'All Sizes') {
          query = query.eq('size', size.toLowerCase());
        }
        if (minPrice !== undefined) {
          query = query.gte('price', minPrice);
        }
        if (maxPrice !== undefined && maxPrice !== Infinity) {
          query = query.lte('price', maxPrice);
        }
        if (inStockOnly) {
          query = query.eq('in_stock', true);
        }
        
        // Full-text search
        if (searchTerm) {
          query = query.textSearch('search_vector', searchTerm);
        }

        // Sorting
        switch (sortBy) {
          case 'price-low':
            query = query.order('price', { ascending: true });
            break;
          case 'price-high':
            query = query.order('price', { ascending: false });
            break;
          case 'name':
          default:
            query = query.order('name', { ascending: true });
        }

        // Pagination
        query = query
          .range((page - 1) * pageSize, page * pageSize - 1);

        const { data, error, count } = await query;

        if (error) throw error;

        setPlants(data as Product[]);
        setTotalCount(count || 0);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [
    page,
    pageSize,
    category,
    type,
    careLevel,
    size,
    minPrice,
    maxPrice,
    inStockOnly,
    searchTerm,
    sortBy
  ]);

  const hasMore = page * pageSize < totalCount;

  return { plants, loading, error, totalCount, hasMore };
}