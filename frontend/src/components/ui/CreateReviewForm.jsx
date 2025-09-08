import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { createReview, selectReviewsLoading, selectReviewsError } from '../../features/review/reviewSlice'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import Button from './Button'
import LoadingSpinner from './LoadingSpinner'
import { Star, MessageCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const CreateReviewForm = ({ tourId, onReviewCreated }) => {
  const dispatch = useDispatch()
  const isLoading = useSelector(selectReviewsLoading)
  const error = useSelector(selectReviewsError)
  
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const onSubmit = async (data) => {
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    try {
      await dispatch(createReview({
        tourId,
        reviewData: {
          review: data.review,
          rating: rating
        }
      })).unwrap()
      
      toast.success('Review submitted successfully!')
      reset()
      setRating(0)
      setHoveredRating(0)
      
      if (onReviewCreated) {
        onReviewCreated()
      }
    } catch (error) {
      // Handle specific error cases
      if (error.includes('duplicate key error') || error.includes('E11000')) {
        toast.error('You have already reviewed this tour. Only one review per tour is allowed.')
      } else {
        toast.error(error || 'Failed to submit review')
      }
    }
  }

  const renderStars = (currentRating, isInteractive = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        className={`w-6 h-6 transition-colors ${
          isInteractive
            ? 'cursor-pointer hover:scale-110'
            : 'cursor-default'
        }`}
        onClick={isInteractive ? () => setRating(index + 1) : undefined}
        onMouseEnter={isInteractive ? () => setHoveredRating(index + 1) : undefined}
        onMouseLeave={isInteractive ? () => setHoveredRating(0) : undefined}
      >
        <Star
          className={`w-full h-full ${
            index < (hoveredRating || currentRating)
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      </button>
    ))
  }

  // Authentication check is now handled in parent component

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Write a Review
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            <div className="flex items-center space-x-1">
              {renderStars(rating, true)}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 ? `${rating}/5` : 'Select rating'}
              </span>
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              {...register('review', {
                required: 'Review is required',
                minLength: {
                  value: 10,
                  message: 'Review must be at least 10 characters'
                },
                maxLength: {
                  value: 1000,
                  message: 'Review must be less than 1000 characters'
                }
              })}
              id="review"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Share your experience with this tour..."
            />
            {errors.review && (
              <p className="mt-1 text-sm text-red-600">{errors.review.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || rating === 0}
            className="w-full"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Submitting Review...
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateReviewForm
