import { useState } from 'react';
import axios from 'axios';
import useAuthentication from '../../hooks/useAuth';

interface ReviewFormProps {
  restaurantId: string;
  onReviewSubmitted: (review: any) => void;
  onCancel: () => void;
}

const ReviewForm = ({ restaurantId, onReviewSubmitted, onCancel }: ReviewFormProps) => {
  const { user, isLoading, login } = useAuthentication();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    rating: 5,
    authenticityRating: 5,
    comment: '',
    dishes: ['']
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDishChange = (index: number, value: string) => {
    const updatedDishes = [...formData.dishes];
    updatedDishes[index] = value;
    setFormData({
      ...formData,
      dishes: updatedDishes
    });
  };

  const addDish = () => {
    setFormData({
      ...formData,
      dishes: [...formData.dishes, '']
    });
  };

  const removeDish = (index: number) => {
    const updatedDishes = formData.dishes.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      dishes: updatedDishes
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    if (!user) {
      login();
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Filter out empty dishes
      const filteredDishes = formData.dishes.filter(dish => dish.trim() !== '');
      
      const response = await axios.post('/api/reviews', {
        restaurantId,
        auth0Id: user.sub,
        ...formData,
        dishes: filteredDishes
      });
      
      onReviewSubmitted(response.data.data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Write Your Review</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="rating" className="block text-gray-700 text-sm font-bold mb-2">
            Overall Rating
          </label>
          <select
            id="rating"
            name="rating"
            className="input w-full"
            value={formData.rating}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="authenticityRating" className="block text-gray-700 text-sm font-bold mb-2">
            Authenticity Rating
          </label>
          <select
            id="authenticityRating"
            name="authenticityRating"
            className="input w-full"
            value={formData.authenticityRating}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Rate how authentic you found the cuisine based on your knowledge or experience.
          </p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 text-sm font-bold mb-2">
            Your Review
          </label>
          <textarea
            id="comment"
            name="comment"
            className="input w-full"
            rows={4}
            value={formData.comment}
            onChange={handleChange}
            placeholder="Share your experience with the food, atmosphere, and authenticity..."
            disabled={isSubmitting}
            required
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Dishes You Tried
          </label>
          {formData.dishes.map((dish, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                className="input flex-1"
                value={dish}
                onChange={(e) => handleDishChange(index, e.target.value)}
                placeholder="Enter a dish name"
                disabled={isSubmitting}
              />
              
              {index === formData.dishes.length - 1 ? (
                <button
                  type="button"
                  onClick={addDish}
                  className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  disabled={isSubmitting}
                >
                  Add
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => removeDish(index)}
                  className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  disabled={isSubmitting}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;