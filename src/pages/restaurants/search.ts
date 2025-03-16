import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// This would be in a proper .env file in a real application
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

type ResponseData = {
  results?: any[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Get the query parameters
    const { query, location, radius = 5000, type = 'restaurant', cuisine } = req.query;
    
    // Build the Google Places API request
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
      
      // Convert location string to lat,lng if it's not already
      if (typeof location === 'string' && !location.includes(',')) {
        // In a real app, you'd use a geocoding API to convert location name to coordinates
        // For now we'll just return an error
        return res.status(400).json({ error: 'Please provide location as lat,lng' });
      }
      
      params.location = location;
      
      if (cuisine) {
        params.keyword = cuisine;
      }
    } else {
      return res.status(400).json({ error: 'Please provide either query or location' });
    }
    
    // Make the request to Google Places API
    const response = await axios.get(endpoint, { params });
    const data = response.data;
    
    // Cache the results (in a real app, you'd store these in Redis or a similar cache)
    // Return the results
    return res.status(200).json({ results: data.results });
  } catch (error: any) {
    console.error('Error searching restaurants:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
}