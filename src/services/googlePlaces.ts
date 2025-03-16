import axios from 'axios';

// Define types for the responses
export interface GooglePlacesRestaurant {
  place_id: string;
  name: string;
  formatted_address: string;
  rating: number;
  user_ratings_total: number;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  price_level?: number;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  };
  types: string[];
}

export interface RestaurantSearchParams {
  query?: string;
  location?: string;
  radius?: number;
  type?: string;
  cuisine?: string;
}

// API endpoints go through our own backend to protect the API key
const API_BASE_URL = '/api/restaurants';

/**
 * Search for restaurants using the Google Places API
 */
export const searchRestaurants = async (params: RestaurantSearchParams) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, { params });
    return response.data;
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw error;
  }
};

/**
 * Get details for a specific restaurant by place_id
 */
export const getRestaurantDetails = async (placeId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/details`, {
      params: { place_id: placeId }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting restaurant details:', error);
    throw error;
  }
};

/**
 * Get reviews for a specific restaurant by place_id
 */
export const getRestaurantReviews = async (placeId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reviews`, {
      params: { place_id: placeId }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting restaurant reviews:', error);
    throw error;
  }
};

/**
 * Get a photo URL from a photo reference
 */
export const getPhotoUrl = (photoReference: string, maxWidth = 400) => {
  return `${API_BASE_URL}/photo?photo_reference=${photoReference}&maxwidth=${maxWidth}`;
};