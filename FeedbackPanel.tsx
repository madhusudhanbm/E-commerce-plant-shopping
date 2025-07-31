import { useState } from 'react';
import { supabase } from '../supabase';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Star } from 'lucide-react';

export default function FeedbackPanel() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to submit feedback');
      return;
    }

    try {
      const { error } = await supabase
        .from('feedback')
        .insert([{
          user_id: user.id,
          content: feedback,
          rating: rating
        }]);

      if (error) throw error;

      toast.success('Thank you for your feedback!');
      setFeedback('');
      setRating(5);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Share Your Feedback</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 ${
                    value <= rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Feedback
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
            rows={4}
            placeholder="Tell us what you think..."
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          disabled={!user}
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
}