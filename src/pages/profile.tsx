import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useAuthentication from '../hooks/useAuth';

const popularCuisines = [
  'Italian', 'Chinese', 'Mexican', 'Japanese', 'Indian', 'Thai', 'Greek', 'French',
  'Spanish', 'Korean', 'Vietnamese', 'Turkish', 'Lebanese', 'Ethiopian', 'Brazilian'
];

export default function Profile() {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    dbUser,
    getUserName, 
    getUserEmail, 
    getUserAvatar,
    getUserPreferences,
    getUserExpertise,
    updateUserPreferences,
    updateUserExpertise
  } = useAuthentication();
  
  const router = useRouter();
  const [editingPreferences, setEditingPreferences] = useState(false);
  const [editingExpertise, setEditingExpertise] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);

  useEffect(() => {
    // If user is not authenticated and not loading, redirect to home
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (dbUser) {
      setSelectedPreferences(dbUser.preferences || []);
      setSelectedExpertise(dbUser.cuisineExpertise || []);
    }
  }, [dbUser]);

  const handleSavePreferences = async () => {
    await updateUserPreferences(selectedPreferences);
    setEditingPreferences(false);
  };

  const handleSaveExpertise = async () => {
    await updateUserExpertise(selectedExpertise);
    setEditingExpertise(false);
  };

  const togglePreference = (cuisine: string) => {
    if (selectedPreferences.includes(cuisine)) {
      setSelectedPreferences(selectedPreferences.filter(p => p !== cuisine));
    } else {
      setSelectedPreferences([...selectedPreferences, cuisine]);
    }
  };

  const toggleExpertise = (cuisine: string) => {
    if (selectedExpertise.includes(cuisine)) {
      setSelectedExpertise(selectedExpertise.filter(e => e !== cuisine));
    } else {
      setSelectedExpertise([...selectedExpertise, cuisine]);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-4">Loading...</h1>
          <div className="w-12 h-12 border-t-4 border-primary-600 border-solid rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // If not authenticated (and not redirected yet), show unauthorized message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
          <p className="mb-4">Please log in to view your profile.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start">
          <div className="w-32 h-32 mb-4 sm:mb-0 sm:mr-6">
            <img
              src={getUserAvatar() || "/images/default-avatar.png"}
              alt={getUserName()}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{getUserName()}</h2>
            <p className="text-gray-600">{getUserEmail()}</p>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Account Information</h3>
              <p><span className="font-medium">Email:</span> {getUserEmail()}</p>
              <p><span className="font-medium">Member since:</span> {new Date(user?.updated_at || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Your Cuisine Preferences</h3>
          {!editingPreferences ? (
            <button 
              onClick={() => setEditingPreferences(true)}
              className="px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Edit
            </button>
          ) : (
            <button 
              onClick={handleSavePreferences}
              className="px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Save
            </button>
          )}
        </div>
        
        {!editingPreferences ? (
          getUserPreferences().length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {getUserPreferences().map((cuisine) => (
                <span 
                  key={cuisine} 
                  className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                >
                  {cuisine}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 mb-4">You haven't set any cuisine preferences yet.</p>
          )
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {popularCuisines.map((cuisine) => (
              <div key={cuisine} className="flex items-center">
                <input
                  type="checkbox"
                  id={`pref-${cuisine}`}
                  checked={selectedPreferences.includes(cuisine)}
                  onChange={() => togglePreference(cuisine)}
                  className="mr-2"
                />
                <label htmlFor={`pref-${cuisine}`}>{cuisine}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Your Cuisine Expertise</h3>
          {!editingExpertise ? (
            <button 
              onClick={() => setEditingExpertise(true)}
              className="px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Edit
            </button>
          ) : (
            <button 
              onClick={handleSaveExpertise}
              className="px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Save
            </button>
          )}
        </div>
        
        {!editingExpertise ? (
          getUserExpertise().length > 0 ? (
            <div>
              <p className="mb-2 text-gray-600">You've indicated expertise in the following cuisines:</p>
              <div className="flex flex-wrap gap-2">
                {getUserExpertise().map((cuisine) => (
                  <span 
                    key={cuisine} 
                    className="px-3 py-1 bg-secondary-100 text-secondary-800 rounded-full text-sm"
                  >
                    {cuisine}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">You haven't indicated expertise in any cuisines yet.</p>
              <p className="text-sm text-gray-500">
                Indicating cuisines you're familiar with helps us prioritize your reviews for authenticity ratings.
              </p>
            </div>
          )
        ) : (
          <div>
            <p className="mb-4 text-sm text-gray-600">
              Select cuisines you have extensive knowledge of, either from heritage, living in a region, or deep culinary experience.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {popularCuisines.map((cuisine) => (
                <div key={cuisine} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`exp-${cuisine}`}
                    checked={selectedExpertise.includes(cuisine)}
                    onChange={() => toggleExpertise(cuisine)}
                    className="mr-2"
                  />
                  <label htmlFor={`exp-${cuisine}`}>{cuisine}</label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}