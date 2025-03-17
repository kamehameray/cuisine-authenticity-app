import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Google Places API configuration
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_API_PHOTO_URL = 'https://maps.googleapis.com/maps/api/place/photo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { photo_reference, maxwidth = 400, maxheight } = req.query;

    if (!photo_reference) {
      return res.status(400).json({ success: false, error: 'Photo reference is required' });
    }

    // Create params for Google Places Photo API
    const params: Record<string, string> = {
      photoreference: photo_reference as string,
      key: GOOGLE_PLACES_API_KEY || '',
      maxwidth: maxwidth as string,
    };

    if (maxheight) {
      params.maxheight = maxheight as string;
    }

    // Make request to Google Places Photo API
    const response = await axios.get(GOOGLE_PLACES_API_PHOTO_URL, {
      params,
      responseType: 'arraybuffer'
    });

    // Set appropriate content type for the image
    const contentType = response.headers['content-type'];
    res.setHeader('Content-Type', contentType);
    
    // Set cache control headers
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours

    // Return the image data
    return res.send(response.data);
  } catch (error) {
    console.error('Error fetching photo:', error);
    
    // Redirect to a placeholder image
    return res.redirect('/images/placeholder-restaurant.jpg');
  }
}