import Link from 'next/link';

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

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  const formatRating = (rating: number) => rating?.toFixed(1) || 'N/A';
  
  const getPriceLevel = (level: number) => {
    return level ? '$'.repeat(level) : 'N/A';
  };

  return (
    <Link href={`/restaurants/${restaurant._id}`} className="block group">
      <div className="h-48 rounded-t-lg overflow-hidden bg-gray-200">
        {restaurant.photos && restaurant.photos.length > 0 ? (
          <img
            src={`/api/restaurants/photo?photo_reference=${restaurant.photos[0]}&maxwidth=600`}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No image available
          </div>
        )}
      </div>
      <div className="p-4 border-x border-b rounded-b-lg">
        <h3 className="font-bold text-lg group-hover:text-primary-600 transition-colors">
          {restaurant.name}
        </h3>
        <p className="text-gray-600 text-sm mb-2 truncate">{restaurant.address}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {restaurant.cuisineType.map(cuisine => (
            <span key={cuisine} className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs">
              {cuisine}
            </span>
          ))}
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            {getPriceLevel(restaurant.priceLevel)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium">{formatRating(restaurant.googleRating)}</span>
          </div>
          
          {restaurant.authenticityVotes > 0 && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium text-primary-700">
                {formatRating(restaurant.authenticityRating)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;