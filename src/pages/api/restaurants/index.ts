import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Restaurant from '../../../models/Restaurant';
import axios from 'axios';

// This would be in a proper .env file in a real application
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const { location, cuisine, radius = 5000, limit = 10 } = req.query;

        // If there's no query parameters, just return restaurants from our database
        if (!location && !cuisine) {
          const restaurants = await Restaurant.find()
            .sort({ authenticityRating: -1 })
            .limit(Number(limit));
          
          return res.status(200).json({ success: true, data: restaurants });
        }

        // Check if we have any restaurants in our database that match the filter
        const query: any = {};
        
        if (cuisine) {
          query.cuisineType = { $in: [cuisine] };
        }

        if (location) {
          // In a real app, we would convert location string to coordinates
          // Then use MongoDB's geospatial queries to find nearby restaurants
          // For now, we'll just use the Google Places API
        }

        // Check if we have these restaurants in our database first
        let restaurants = await Restaurant.find(query)
          .limit(Number(limit));

        // If we don't have enough restaurants in our database, fetch from Google Places API
        if (restaurants.length < Number(limit) && location) {
          // Make request to Google Places API
          const googleResponse = await axios.get(
            `${GOOGLE_PLACES_API_BASE_URL}/nearbysearch/json`,
            {
              params: {
                location,
                radius,
                type: 'restaurant',
                keyword: cuisine,
                key: GOOGLE_PLACES_API_KEY
              }
            }
          );

          const placesResults = googleResponse.data.results;

          // Process and save each restaurant to our database
          const newRestaurants = await Promise.all(
            placesResults.map(async (place: any) => {
              // Check if restaurant already exists in our database
              const existingRestaurant = await Restaurant.findOne({ placeId: place.place_id });

              if (existingRestaurant) {
                return existingRestaurant;
              }

              // Extract cuisine types from place types and name
              let cuisineTypes = [];
              if (cuisine) {
                cuisineTypes.push(cuisine);
              }

              // Create new restaurant document
              const newRestaurant = await Restaurant.create({
                placeId: place.place_id,
                name: place.name,
                address: place.vicinity,
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

              return newRestaurant;
            })
          );

          // Combine with existing restaurants
          restaurants = [...restaurants, ...newRestaurants];
        }

        res.status(200).json({ success: true, data: restaurants });
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ success: false, error: 'Server error' });
      }
      break;

    case 'POST':
      try {
        const { placeId } = req.body;

        if (!placeId) {
          return res.status(400).json({ success: false, error: 'Place ID is required' });
        }

        // Check if restaurant already exists
        const existingRestaurant = await Restaurant.findOne({ placeId });

        if (existingRestaurant) {
          return res.status(200).json({ success: true, data: existingRestaurant });
        }

        // Fetch details from Google Places API
        const detailsResponse = await axios.get(
          `${GOOGLE_PLACES_API_BASE_URL}/details/json`,
          {
            params: {
              place_id: placeId,
              fields: 'name,formatted_address,geometry,rating,price_level,website,formatted_phone_number,types,photos',
              key: GOOGLE_PLACES_API_KEY
            }
          }
        );

        const placeDetails = detailsResponse.data.result;

        // Extract cuisine types from place types (in a real app, you would use AI or a mapping of types to cuisines)
        const cuisineTypes = ['Restaurant']; // Placeholder

        // Create new restaurant document
        const restaurant = await Restaurant.create({
          placeId,
          name: placeDetails.name,
          address: placeDetails.formatted_address,
          location: {
            type: 'Point',
            coordinates: [
              placeDetails.geometry.location.lng,
              placeDetails.geometry.location.lat
            ]
          },
          cuisineType: cuisineTypes,
          googleRating: placeDetails.rating,
          authenticityRating: 0,
          authenticityVotes: 0,
          photos: placeDetails.photos ? placeDetails.photos.map((p: any) => p.photo_reference) : [],
          priceLevel: placeDetails.price_level,
          website: placeDetails.website,
          phoneNumber: placeDetails.formatted_phone_number
        });

        res.status(201).json({ success: true, data: restaurant });
      } catch (error) {
        console.error('Error creating restaurant:', error);
        res.status(500).json({ success: false, error: 'Server error' });
      }
      break;

    default:
      res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
  }
}