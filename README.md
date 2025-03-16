# Authentic Cuisine Finder

A web application to help users find authentic restaurants for various cuisines, based on reviews from people who know the cuisine best.

## Features

- Search for restaurants by location, cuisine type, or specific dishes
- View authenticity ratings based on review analysis
- User contributions for authenticity verification
- Premium features for enthusiasts and food explorers

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes, Node.js
- **Database**: MongoDB Atlas
- **Authentication**: Auth0
- **API Integration**: Google Places API, Yelp Fusion API
- **Payment Processing**: Stripe

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm or yarn
- MongoDB Atlas account
- Google Cloud Platform account (for Google Places API)
- Auth0 account
- Stripe account (for payment processing)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# API Keys
GOOGLE_PLACES_API_KEY=your_google_places_api_key
YELP_API_KEY=your_yelp_api_key

# Auth0
NEXT_PUBLIC_AUTH0_DOMAIN=your_auth0_domain
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_SECRET=your_auth0_secret

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/authentic-cuisine-finder.git
   cd authentic-cuisine-finder
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Run the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Project Structure

```
cuisine-authenticity-app/
├── public/                     # Static files
├── src/                        # Source code
│   ├── components/             # Reusable UI components
│   ├── context/                # React context providers
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Library code
│   ├── pages/                  # Next.js pages
│   │   ├── api/                # API routes
│   ├── services/               # External service integrations
│   ├── styles/                 # CSS styles
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Utility functions
```

## Deployment

The application can be easily deployed on Vercel or Netlify.

```
npm run build
# or
yarn build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.