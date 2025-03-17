import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import dbConnect from '../../../lib/mongodb';
import Restaurant from '../../../models/Restaurant';

// This would be in a proper .env file in a real application
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

type ResponseData = {
  success: boolean;
  data?: any[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  try {
    await dbConnect();
    
    // Get the query parameters
    const { query, location, cuisine, radius = 5000, type = 'restaurant' } = req.query;
    
    // Check if we have this search cached in our database
    const searchFilter: any = {};
    
    if (cuisine) {
      searchFilter.cuisineType = { $in: [cuisine] };
    }
    
    if (location) {
      // If location is provided as lat,lng
      if (typeof location === 'string' && location.includes(',')) {
        const [lat, lng] = location.split(',').map(Number);
        
        // Use MongoDB's geospatial query to find nearby restaurants
        searchFilter.location = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat]
            },
            $maxDistance: Number(radius)
          }
        };
      }
    }
    
    // Check our database first
    const localRestaurants = await Restaurant.find(searchFilter).limit(20);
    
    // If we have enough restaurants in our database, return them without calling Google
    if (localRestaurants.length >= 10) {
      return res.status(200).json({
        success: true,
        data: localRestaurants
      });
    }
    
    // Otherwise, fetch from Google Places API
    let endpoint = `${GOOGLE_PLACES_API_BASE_URL}/textsearch/json`;
    let params: any = {
      key: GOOGLE_PLACES_API_KEY,
      type,
      radius,
    };
    
    // Add query or location based search
    if (query) {
      params.query = `${query} ${cuisine || ''}`.trim();
    } else if (location) {
      endpoint = `${GOOGLE_PLACES_API_BASE_URL}/nearbysearch/json`;
      
      // Location should be in the format "lat,lng"
      if (typeof location === 'string' && location.includes(',')) {
        params.location = location;
      } else {
        return res.status(400).json({ success: false, error: 'Please provide location as lat,lng' });
      }
      
      if (cuisine) {
        params.keyword = cuisine;
      }
    } else {
      return res.status(400).json({ success: false, error: 'Please provide either query or location' });
    }
    
    // Make the request to Google Places API
    const response = await axios.get(endpoint, { params });
    const data = response.data;
    
    // Process the results
    const googleResults = await Promise.all(
      data.results.map(async (place: any) => {
        // Check if restaurant already exists in our database
        let restaurant = await Restaurant.findOne({ placeId: place.place_id });
        
        if (!restaurant) {
          // Extract cuisine types (in a real app, use AI or a mapping of types to cuisines)
          let cuisineTypes = [];
          if (cuisine) {
            cuisineTypes.push(cuisine);
          }
          
          // Create new restaurant document
          restaurant = await Restaurant.create({
            placeId: place.place_id,
            name: place.name,
            address: place.vicinity || place.formatted_address,
            location: {
              type: 'Point',
              coordinates: [
                place.geometry.location.lng,
                place.geometry.location.lat
              ]
            },
            cuisineType: cuisineTypes,
            googleRating: place.rating,
            authenticityRating: 0,
            authenticityVotes: 0,
            photos: place.photos ? place.photos.map((p: any) => p.photo_reference) : [],
            priceLevel: place.price_level
          });
        }
        
        return restaurant;
      })
    );
    
    // Combine local and Google results, removing duplicates
    const allRestaurants = [...localRestaurants];
    const localPlaceIds = new Set(localRestaurants.map(r => r.placeId));
    
    for (const restaurant of googleResults) {
      if (!localPlaceIds.has(restaurant.placeId)) {
        allRestaurants.push(restaurant);
      }
    }
    
    // Return the results
    return res.status(200).json({
      success: true,
      data: allRestaurants
    });
  } catch (error: any) {
    console.error('Error searching restaurants:', error.response?.data || error.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch restaurants' });
  }
}