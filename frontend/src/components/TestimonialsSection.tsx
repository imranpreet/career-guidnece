import React, { useState, useEffect } from 'react';
import { useToast } from './ui/ToastProvider';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon, XMarkIcon } from '@heroicons/react/24/solid';

// Default testimonials (fallback if no reviews from backend)
const defaultTestimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Software Engineer',
    company: 'Tech Corp',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    content: 'The AI career guidance helped me transition from marketing to tech. The personalized roadmap and interview prep were game-changers!',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Product Manager',
    company: 'Innovation Labs',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    content: 'Amazing platform! The AI-generated resume got me 3x more interviews. The industry insights feature is incredibly valuable.',
    rating: 5
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Data Scientist',
    company: 'Analytics Pro',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    content: 'The mock interviews with AI feedback boosted my confidence significantly. Landed my dream job within 2 months!',
    rating: 5
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'UX Designer',
    company: 'Design Studio',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    content: 'The career tracking feature helped me identify skill gaps and provided a clear path for improvement. Highly recommended!',
    rating: 5
  }
];

interface Review {
  _id: string;
  name: string;
  role: string;
  company?: string;
  rating: number;
  review: string;
  createdAt: string;
}

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<any[]>(defaultTestimonials);
  // loading state was unused; remove to avoid ESLint warning
  // (we keep an implicit loading UX via initial testimonials array)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    role: '',
    company: '',
    rating: 5,
    review: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const toast = useToast();

  // Fetch approved reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews/approved?limit=20');
        if (response.ok) {
          const data = await response.json();
          
          if (data.reviews && data.reviews.length > 0) {
            // Transform backend reviews to match testimonial format
            const transformedReviews = data.reviews.map((review: Review) => ({
              id: review._id,
              name: review.name,
              role: review.role,
              company: review.company || 'Our User',
              image: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=random&size=150`,
              content: review.review,
              rating: review.rating
            }));
            
            // Combine real reviews with default testimonials
            setTestimonials([...transformedReviews, ...defaultTestimonials]);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Keep default testimonials if fetch fails
      } finally {
        // no-op: remove loading state handling
      }
    };

    fetchReviews();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const openReviewModal = () => {
    setIsReviewModalOpen(true);
    setSubmitSuccess(false);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewForm({
      name: '',
      role: '',
      company: '',
      rating: 5,
      review: ''
    });
    setSubmitSuccess(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating: number) => {
    setReviewForm(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewForm),
      });

      // Parse JSON safely (some errors may return non-JSON responses)
      let data: any = null;
      try {
        data = await response.json();
      } catch (err) {
        console.warn('Response did not contain JSON:', err);
      }

      if (response.ok) {
        setSubmitSuccess(true);
        // Optimistically add the submitted review to testimonials as pending
        const pendingTestimonial = {
          id: data && data.id ? data.id : `pending-${Date.now()}`,
          name: reviewForm.name,
          role: reviewForm.role,
          company: reviewForm.company || 'Our User',
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewForm.name)}&background=random&size=150`,
          content: reviewForm.review,
          rating: reviewForm.rating,
          pending: true
        };

        setTestimonials(prev => [pendingTestimonial, ...prev]);
        setTimeout(() => {
          closeReviewModal();
        }, 2000);
      } else {
        const serverMessage = data && data.message ? data.message : response.statusText || 'Failed to submit review';
        console.error('Submit review failed:', { status: response.status, serverMessage, data });
        throw new Error(serverMessage);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      const message = error instanceof Error ? error.message : 'Failed to submit review. Please try again.';
      // Surface the server's message to the user when available
      toast.push({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            What Our <span className="text-primary-600">Users Say</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of professionals who have accelerated their careers 
            with our AI-powered career coaching platform.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          {/* Main Testimonial */}
          <div className="card text-center min-h-[300px] flex flex-col justify-center">
            <div className="mb-6">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              />
              
              {/* Star Rating */}
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-accent-500" />
                ))}
              </div>
            </div>
            
            <blockquote className="text-xl text-gray-600 dark:text-gray-300 mb-6 italic leading-relaxed">
              "{testimonials[currentIndex].content}"
            </blockquote>
            
            <div className="text-center">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                {testimonials[currentIndex].name}
              </h4>
              <p className="text-primary-600 font-semibold">
                {testimonials[currentIndex].role}
              </p>
              {testimonials[currentIndex].pending && (
                <div className="mt-2 inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Pending approval
                </div>
              )}
              <p className="text-gray-500 dark:text-gray-400">
                {testimonials[currentIndex].company}
              </p>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={prevTestimonial}
              className="p-3 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            
            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-primary-600 scale-125'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-primary-400'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextTestimonial}
              className="p-3 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
        
        {/* Submit Review CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Have you used our platform? Share your experience!
          </p>
          <button 
            onClick={openReviewModal}
            className="btn-secondary"
          >
            Submit Your Review
          </button>
        </div>

        {/* Review Submission Modal */}
        {isReviewModalOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeReviewModal}
          >
            <div 
              className="relative w-full max-w-md mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Submit Your Review
                    </h3>
                    <button
                      onClick={closeReviewModal}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Share your experience with our AI Career Coach platform
                  </p>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  {submitSuccess ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Thank You!
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Your review has been submitted! It will appear on the page after approval.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      {/* Name Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={reviewForm.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Enter your full name"
                        />
                      </div>

                      {/* Role Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Your Role *
                        </label>
                        <input
                          type="text"
                          name="role"
                          value={reviewForm.role}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                          placeholder="e.g., Software Engineer"
                        />
                      </div>

                      {/* Company Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Company (Optional)
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={reviewForm.company}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Company name"
                        />
                      </div>

                      {/* Rating */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Rating *
                        </label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRatingChange(star)}
                              className={`transition-colors ${
                                star <= reviewForm.rating
                                  ? 'text-accent-500'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            >
                              <StarIcon className="w-6 h-6" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Review Text */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Your Review *
                        </label>
                        <textarea
                          name="review"
                          value={reviewForm.review}
                          onChange={handleInputChange}
                          required
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white resize-none"
                          placeholder="Share your experience with our AI Career Coach platform..."
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={closeReviewModal}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
