import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import RestaurantCard from '../components/restaurant/RestaurantCard';

// Types
interface Restaurant {
  _id: string;
  placeId: string;
  name: string;
  address: string;
  cuisineType: string[];
  googleRating: number;
  authenticityRating: number;
  authenticityVotes: number;
  photos: string[];
  priceLevel: number;
}

const popularCuisines = [
  'Italian', 'Chinese', 'Mexican', 'Japanese', 'Indian', 'Thai', 'Greek', 'French',
  'Spanish', 'Korean', 'Vietnamese', 'Turkish', 'Lebanese', 'Ethiopian'
];

const RestaurantsPage = () => {
  const router = useRouter();
  const { query: urlQuery, cuisine: urlCuisine } = router.query;
  
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState(urlQuery as string || '');
  const [selectedCuisine, setSelectedCuisine] = useState(urlCuisine as string || '');
  const [location, setLocation] = useState('');
  
  useEffect(() => {
    // Update search inputs when URL parameters change
    if (urlQuery) setSearchQuery(urlQuery as string);
    if (urlCuisine) setSelectedCuisine(urlCuisine as string);
  }, [urlQuery, urlCuisine]);
  
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let endpoint = '/api/restaurants';
        
        // If we have search criteria, use the search endpoint
        if (searchQuery || selectedCuisine || location) {
          endpoint = '/api/restaurants/search';
        }
        
        const params: Record<string, string> = {};
        
        if (searchQuery) params.query = searchQuery;
        if (selectedCuisine) params.cuisine = selectedCuisine;
        if (location) params.location = location;
        
        const response = await axios.get(endpoint, { params });
        setRestaurants(response.data.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setError('Failed to load restaurants. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurants();
  }, [searchQuery, selectedCuisine, location]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL with search parameters
    const query: Record<string, string> = {};
    if (searchQuery) query.query = searchQuery;
    if (selectedCuisine) query.cuisine = selectedCuisine;
    
    router.push({
      pathname: '/restaurants',
      query
    });
  };
  
  const handleCuisineClick = (cuisine: string) => {
    setSelectedCuisine(cuisine);
    
    router.push({
      pathname: '/restaurants',
      query: { cuisine }
    });
  };
  
  return (
    <>
      <Head>
        <title>Find Authentic Restaurants | Authentic Cuisine Finder</title>
        <meta name="description" content="Discover authentic restaurants with genuine cuisine verified by people who know it best." />
      </Head>
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Restaurants</h1>
        
        <div className="mb-8">
          <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  placeholder="Restaurant name or keywords"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="md:w-1/4">
                <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-1">
                  Cuisine
                </label>
                <select
                  id="cuisine"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                >
                  <option value="">All Cuisines</option>
                  {popularCuisines.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:w-48 flex items-end">
                <button
                  type="submit"
                  className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Popular Cuisines</h2>
          <div className="flex flex-wrap gap-2">
            {popularCuisines.slice(0, 8).map(cuisine => (
              <button
                key={cuisine}
                onClick={() => handleCuisineClick(cuisine)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCuisine === cuisine
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-t-4 border-primary-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading restaurants...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.reload()}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Try Again
            </button>
          </div>
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map(restaurant => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No restaurants found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCuisine('');
                router.push('/restaurants');
              }}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default RestaurantsPage;