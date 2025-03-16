import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';

const Home: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisine, setCuisine] = useState('');

  const popularCuisines = [
    'Italian', 'Chinese', 'Mexican', 'Japanese', 'Indian', 'Thai', 'Greek', 'French'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Will implement search functionality later
    console.log('Searching for:', searchQuery, cuisine);
  };

  return (
    <div className="min-h-screen">
      <Head>
        <title>Authentic Cuisine Finder</title>
        <meta name="description" content="Find authentic restaurants for any cuisine" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find <span className="text-primary-600">Authentic</span> Cuisine
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover restaurants serving genuine, authentic dishes from around the world,
            verified by people who know the cuisine best.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <form 
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow-md"
          >
            <input
              type="text"
              placeholder="Enter a location or restaurant name"
              className="input flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
            />
            <select 
              className="input"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            >
              <option value="">All Cuisines</option>
              {popularCuisines.map(c => (
                <option key={c} value={c.toLowerCase()}>{c}</option>
              ))}
            </select>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Popular Cuisines</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularCuisines.map((cuisine) => (
              <div key={cuisine} className="card hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center">
                  <h3 className="font-bold">{cuisine}</h3>
                  <p className="text-gray-600 text-sm">Explore authentic {cuisine} restaurants</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="font-bold mb-2">Search</h3>
              <p>Find restaurants by location, cuisine type, or specific dishes you're looking for.</p>
            </div>
            <div className="card">
              <h3 className="font-bold mb-2">Discover</h3>
              <p>See authenticity ratings based on reviews from people who know the cuisine.</p>
            </div>
            <div className="card">
              <h3 className="font-bold mb-2">Contribute</h3>
              <p>Share your own knowledge to help others find authentic dining experiences.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">Authentic Cuisine Finder</h2>
              <p className="text-gray-400">© 2025 All Rights Reserved</p>
            </div>
            <div className="flex gap-4">
              <Link href="/about" className="text-gray-300 hover:text-white">About</Link>
              <Link href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-300 hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;