import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Restaurant from '../../../models/Restaurant';
import axios from 'axios';

// Google Places API configuration
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        // Check if this is a MongoDB ID or a Google Place ID
        const isMongoId = id && id.length === 24; // MongoDB IDs are 24 hex characters
        
        let restaurant;
        
        if (isMongoId) {
          // Find restaurant by MongoDB ID
          restaurant = await Restaurant.findById(id);
        } else {
          // Find restaurant by Google Place ID
          restaurant = await Restaurant.findOne({ placeId: id });
        }
        
        // If restaurant exists in our database, return it
        if (restaurant) {
          return res.status(200).json({ success: true, data: restaurant });
        }
        
        // If not found and it's a place ID, fetch from Google Places API
        if (!isMongoId) {
          // Fetch details from Google Places API
          const response = await axios.get(
            `${GOOGLE_PLACES_API_BASE_URL}/details/json`,
            {
              params: {
                place_id: id,
                fields: 'name,formatted_address,geometry,rating,price_level,website,formatted_phone_number,types,photos',
                key: GOOGLE_PLACES_API_KEY
              }
            }
          );
          
          const placeDetails = response.data.result;
          
          if (!placeDetails) {
            return res.status(404).json({ success: false, error: 'Restaurant not found' });
          }
          
          // Extract cuisine types (in a real app, use AI or a mapping of types to cuisines)
          const cuisineTypes = ['Restaurant']; // Placeholder
          
          // Create new restaurant document
          restaurant = await Restaurant.create({
            placeId: id,
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
          
          return res.status(200).json({ success: true, data: restaurant });
        }
        
        // If we get here, the restaurant wasn't found
        return res.status(404).json({ success: false, error: 'Restaurant not found' });
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        return res.status(500).json({ success: false, error: 'Server error' });
      }
      
    case 'PUT':
      try {
        // Ensure we have a valid ID
        if (!id) {
          return res.status(400).json({ success: false, error: 'ID is required' });
        }
        
        // Find and update the restaurant
        const restaurant = await Restaurant.findByIdAndUpdate(
          id,
          req.body,
          {
            new: true,
            runValidators: true
          }
        );
        
        if (!restaurant) {
          return res.status(404).json({ success: false, error: 'Restaurant not found' });
        }
        
        return res.status(200).json({ success: true, data: restaurant });
      } catch (error) {
        console.error('Error updating restaurant:', error);
        return res.status(500).json({ success: false, error: 'Server error' });
      }
      
    default:
      res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
  }
}