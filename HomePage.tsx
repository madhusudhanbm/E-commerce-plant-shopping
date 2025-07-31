import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types';
import { Search, Heart, Leaf, Droplets, Sun, Filter, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { usePlants } from '../hooks/usePlants';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../contexts/AuthContext';

const categories = ['All', 'Indoor Plants', 'Outdoor Plants', 'Herbs', 'Flowers', 'Succulents', 'Tropical Plants', 'Fruit Trees'];
const types = ['All Types', 'plant', 'herb', 'flower'];
const careLevels = ['All Levels', 'easy', 'medium', 'expert'];
const sizes = ['All Sizes', 'small', 'medium', 'large'];
const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹1660', min: 0, max: 20 },
  { label: '₹1660 - ₹4150', min: 20, max: 50 },
  { label: '₹4150 - ₹8300', min: 50, max: 100 },
  { label: 'Over ₹8300', min: 100, max: Infinity }
];

export default function HomePage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedCareLevel, setSelectedCareLevel] = useState('All Levels');
  const [selectedSize, setSelectedSize] = useState('All Sizes');
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name');

  const {
    plants,
    loading,
    error,
    totalCount,
    hasMore
  } = usePlants({
    page,
    pageSize: 12,
    category: selectedCategory,
    type: selectedType,
    careLevel: selectedCareLevel,
    size: selectedSize,
    minPrice: selectedPriceRange.min,
    maxPrice: selectedPriceRange.max,
    inStockOnly: showInStockOnly,
    searchTerm,
    sortBy
  });

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loading: wishlistLoading
  } = useWishlist();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = async (product: Product) => {
    if (!user) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }

    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
        toast.success(`${product.name} removed from wishlist`);
      } else {
        await addToWishlist(product.id);
        toast.success(`${product.name} added to wishlist`);
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            <p>Error loading plants: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-green-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to GreenThumb Nursery</h1>
            <p className="text-xl">Discover our collection of over 10,000+ plants, herbs, and flowers</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search plants, herbs, and flowers..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1); // Reset to first page on search
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* In Stock Filter */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={showInStockOnly}
                  onChange={(e) => setShowInStockOnly(e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="inStock" className="ml-2 text-gray-700">
                  Show In Stock Only
                </label>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={selectedCareLevel}
                onChange={(e) => {
                  setSelectedCareLevel(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {careLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              <select
                value={selectedSize}
                onChange={(e) => {
                  setSelectedSize(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>

              <select
                value={selectedPriceRange.label}
                onChange={(e) => {
                  setSelectedPriceRange(priceRanges.find(range => range.label === e.target.value)!);
                  setPage(1);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {priceRanges.map(range => (
                  <option key={range.label} value={range.label}>{range.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-gray-600 mb-4">
            Showing {plants.length} of {totalCount} results
          </p>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {loading ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <Loader className="h-8 w-8 animate-spin text-green-600" />
                </div>
              ) : (
                plants.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() => handleWishlistToggle(product)}
                        disabled={wishlistLoading}
                        className={`absolute top-2 right-2 p-2 bg-white rounded-full shadow-md transition-colors ${
                          isInWishlist(product.id) ? 'text-red-500' : 'hover:text-red-500'
                        }`}
                      >
                        <Heart
                          className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`}
                        />
                      </button>
                      {!product.in_stock && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-sm rounded">
                          Out of Stock
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                      
                      <div className="mt-2 flex items-center space-x-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Sun className="h-4 w-4 mr-1" />
                          {product.sunlight}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Droplets className="h-4 w-4 mr-1" />
                          {product.water}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Leaf className="h-4 w-4 mr-1" />
                          {product.care_level}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">
                          ₹{(product.price * 83).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.in_stock}
                          className={`px-4 py-2 rounded-lg ${
                            product.in_stock
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          } transition-colors`}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setPage(page + 1)}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}