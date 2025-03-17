import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthentication from '../../hooks/useAuth';
import Head from 'next/head';
import Link from 'next/link';
import ReviewForm from '../../components/restaurant/ReviewForm';

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
  website: string;
  phoneNumber: string;
}

interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
    picture: string;
    cuisineExpertise: string[];
  };
  rating: number;
  authenticityRating: number;
  comment: string;
  dishes: string[];
  helpfulVotes: number;
  createdAt: string;
}

const RestaurantDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, isLoading, canContribute, isExpertIn, login } = useAuthentication();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  // State for review form
  const [reviewFormOpen, setReviewFormOpen] = useState(false);

  // Fetch restaurant details
  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/restaurants/${id}`);
        setRestaurant(response.data.data);
        
        // Fetch reviews for this restaurant
        const reviewsResponse = await axios.get(`/api/reviews?restaurantId=${id}`);
        setReviews(reviewsResponse.data.data);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  // Function to handle review button click
  const handleReviewClick = () => {
    if (!isAuthenticated) {
      login();
    } else {
      setReviewFormOpen(true);
    }
  };

  // Helper functions
  const formatRating = (rating: number) => rating?.toFixed(1) || 'N/A';
  const getPriceLevel = (level: number) => {
    return level ? '$'.repeat(level) : 'Not available';
  };
  
  const isExpertReview = (review: Review) => {
    return restaurant?.cuisineType.some(cuisine => 
      review.userId.cuisineExpertise?.includes(cuisine)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-4">Loading restaurant details...</h1>
          <div className="w-12 h-12 border-t-4 border-primary-600 border-solid rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Restaurant Not Found</h1>
          <p className="mb-4">We couldn't find the restaurant you're looking for.</p>
          <Link href="/restaurants" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{restaurant.name} | Authentic Cuisine Finder</title>
        <meta name="description" content={`Details and authenticity ratings for ${restaurant.name}`} />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="lg:w-2/3">
            <div className="mb-6">
              <Link href="/restaurants" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
                ← Back to restaurants
              </Link>
              <h1 className="text-3xl font-bold">{restaurant.name}</h1>
              <p className="text-gray-600 mb-2">{restaurant.address}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {restaurant.cuisineType.map(cuisine => (
                  <span key={cuisine} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                    {cuisine}
                  </span>
                ))}
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {getPriceLevel(restaurant.priceLevel)}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-6 mb-4">
                <div>
                  <div className="text-sm text-gray-600">Google Rating</div>
                  <div className="font-bold text-lg flex items-center">
                    {formatRating(restaurant.googleRating)}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">Authenticity Rating</div>
                  <div className="font-bold text-lg flex items-center">
                    {formatRating(restaurant.authenticityRating)}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-500">Based on {restaurant.authenticityVotes} ratings</div>
                </div>
              </div>
              
              {restaurant.website && (
                <a 
                  href={restaurant.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 mr-4"
                >
                  Visit Website
                </a>
              )}
              
              {restaurant.phoneNumber && (
                <a 
                  href={`tel:${restaurant.phoneNumber}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {restaurant.phoneNumber}
                </a>
              )}
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Photos</h2>
              {restaurant.photos && restaurant.photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {restaurant.photos.map((photo, index) => (
                    <div key={index} className="h-40 rounded-lg overflow-hidden">
                      <img 
                        src={`/api/restaurants/photo?photo_reference=${photo}&maxwidth=400`}
                        alt={`${restaurant.name} - Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No photos available</p>
              )}
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Reviews</h2>
                {!reviewFormOpen && (
                  <button
                    onClick={handleReviewClick}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    {isAuthenticated ? 'Write a Review' : 'Login to Review'}
                  </button>
                )}
              </div>
              
              {reviewFormOpen && (
                <div className="mb-6">
                  <ReviewForm 
                    restaurantId={restaurant._id}
                    onReviewSubmitted={(newReviewData) => {
                      // Add the new review to the list
                      setReviews([newReviewData, ...reviews]);
                      
                      // Update the restaurant's authenticity rating
                      const updatedRestaurant = { ...restaurant } as Restaurant;
                      updatedRestaurant.authenticityVotes += 1;
                      const totalRating = (restaurant?.authenticityRating || 0) * (restaurant?.authenticityVotes || 0) + newReviewData.authenticityRating;
                      updatedRestaurant.authenticityRating = totalRating / updatedRestaurant.authenticityVotes;
                      setRestaurant(updatedRestaurant);
                      
                      // Close the form
                      setReviewFormOpen(false);
                    }}
                    onCancel={() => setReviewFormOpen(false)}
                  />
                </div>
              )}
              
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review._id} className="border-b border-gray-200 pb-6">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <img
                            src={review.userId.picture || "/images/default-avatar.png"}
                            alt={review.userId.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <div className="font-semibold">{review.userId.name}</div>
                            <div className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        
                        {isExpertReview(review) && (
                          <div className="px-3 py-1 bg-secondary-100 text-secondary-800 rounded-full text-sm">
                            Cuisine Expert
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-4 mb-2">
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Rating:</span>
                          <span className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Authenticity:</span>
                          <span className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`h-4 w-4 ${i < review.authenticityRating ? 'text-primary-500' : 'text-gray-300'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      
                      {review.dishes && review.dishes.length > 0 && review.dishes[0] !== '' && (
                        <div className="mb-2">
                          <span className="font-medium text-sm">Dishes tried:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {review.dishes.map((dish, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                {dish}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <button className="flex items-center hover:text-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          Helpful ({review.helpfulVotes})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet. Be the first to review this restaurant!</p>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white shadow rounded-lg p-6 sticky top-4">
              <h3 className="text-xl font-semibold mb-4">About {restaurant.name}</h3>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Cuisine</h4>
                <div className="flex flex-wrap gap-2">
                  {restaurant.cuisineType.map(cuisine => (
                    <span key={cuisine} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                      {cuisine}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Price Level</h4>
                <p>{getPriceLevel(restaurant.priceLevel)}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Address</h4>
                <p>{restaurant.address}</p>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}&query_place_id=${restaurant.placeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 text-sm mt-1 inline-block"
                >
                  View on Google Maps
                </a>
              </div>
              
              {restaurant.website && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Website</h4>
                  <a 
                    href={restaurant.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 break-all"
                  >
                    {restaurant.website.replace(/(^\w+:|^)\/\//, '')}
                  </a>
                </div>
              )}
              
              {restaurant.phoneNumber && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Phone</h4>
                  <a 
                    href={`tel:${restaurant.phoneNumber}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {restaurant.phoneNumber}
                  </a>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => isAuthenticated ? setReviewFormOpen(true) : login()}
                  className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  {isAuthenticated ? 'Write a Review' : 'Login to Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantDetails;