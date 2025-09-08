import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTourReviews, selectReviews, selectReviewsLoading, selectReviewsError } from '../../features/review/reviewSlice'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import Button from './Button'
import LoadingSpinner from './LoadingSpinner'
import ReviewCard from './ReviewCard'
import CreateReviewForm from './CreateReviewForm'
import { Star, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'

const ReviewsSection = ({ tourId, tour }) => {
  const dispatch = useDispatch()
  const reviews = useSelector(selectReviews)
  const isLoading = useSelector(selectReviewsLoading)
  const error = useSelector(selectReviewsError)
  
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [hasLoadedReviews, setHasLoadedReviews] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    if (tourId && !hasLoadedReviews) {
      dispatch(fetchTourReviews(tourId))
      setHasLoadedReviews(true)
    }
  }, [dispatch, tourId, hasLoadedReviews])

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3)
  const hasMoreReviews = reviews.length > 3

  const handleReviewCreated = () => {
    // Refresh reviews after creating a new one
    dispatch(fetchTourReviews(tourId))
    setShowCreateForm(false)
  }

  if (isLoading && !hasLoadedReviews) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Failed to load reviews</p>
            <Button 
              onClick={() => dispatch(fetchTourReviews(tourId))}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Reviews ({reviews.length})
          </CardTitle>
          
          {/* Rating Summary */}
          {tour && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {renderStars(Math.round(tour.ratingsAverage))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {tour.ratingsAverage} ({tour.ratingsQuantity} reviews)
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Create Review Form */}
        {showCreateForm ? (
          <div className="mb-6">
            <CreateReviewForm 
              tourId={tourId} 
              onReviewCreated={handleReviewCreated}
            />
          </div>
        ) : (
          <div className="text-center mb-6">
            <Button 
              onClick={() => setShowCreateForm(true)}
              variant="outline"
              className="w-full"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Write a Review
            </Button>
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-500">Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Reviews List */}
            <div className="space-y-4">
              {displayedReviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>

            {/* Show More/Less Button */}
            {hasMoreReviews && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="flex items-center mx-auto"
                >
                  {showAllReviews ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Show All Reviews ({reviews.length})
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Loading indicator for when fetching more */}
            {isLoading && hasLoadedReviews && (
              <div className="flex justify-center py-4">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ReviewsSection
