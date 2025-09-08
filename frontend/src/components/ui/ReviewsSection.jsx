import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTourReviews, fetchMyReviews, selectReviews, selectMyReviews, selectReviewsLoading, selectReviewsError } from '../../features/review/reviewSlice'
import { selectUser, selectIsAuthenticated } from '../../features/auth/authSlice'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import Button from './Button'
import LoadingSpinner from './LoadingSpinner'
import ReviewCard from './ReviewCard'
import CreateReviewForm from './CreateReviewForm'
import { Star, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'

const ReviewsSection = ({ tourId, tour }) => {
  const dispatch = useDispatch()
  const reviews = useSelector(selectReviews)
  const myReviews = useSelector(selectMyReviews)
  const isLoading = useSelector(selectReviewsLoading)
  const error = useSelector(selectReviewsError)
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [hasLoadedReviews, setHasLoadedReviews] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    if (tourId && !hasLoadedReviews) {
      dispatch(fetchTourReviews(tourId))
      setHasLoadedReviews(true)
    }
  }, [dispatch, tourId, hasLoadedReviews])

  // Fetch user's reviews when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyReviews())
    }
  }, [dispatch, isAuthenticated])

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

  // Check if current user already has a review for this tour
  // Method 1: Check in current tour reviews (using the API data structure you provided)
  const userHasReviewInTour = isAuthenticated && reviews.some(review => {
    // From your API data: review.user._id = "68beb6957668301d2c050b3d"
    // We need to get the current user ID from localStorage or auth state
    const reviewUserId = review.user?._id || review.user
    const token = localStorage.getItem('token')
    if (!token) return false
    
    // Decode JWT to get user ID (simple approach)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentUserId = payload.id || payload._id
      return reviewUserId && currentUserId && reviewUserId.toString() === currentUserId.toString()
    } catch (error) {
      console.error('Error decoding token:', error)
      return false
    }
  })

  // Method 2: Check in user's reviews (more reliable)
  const userHasReviewInMyReviews = isAuthenticated && myReviews.some(review => {
    const reviewTourId = review.tour?._id || review.tour
    return reviewTourId && reviewTourId.toString() === tourId
  })

  // Use either method (prefer myReviews as it's more reliable)
  const userHasReview = userHasReviewInMyReviews || userHasReviewInTour

  // Debug: Log reviews data to understand the structure
  console.log('ReviewsSection - tourId:', tourId)
  console.log('ReviewsSection - reviews:', reviews)
  console.log('ReviewsSection - myReviews:', myReviews)
  console.log('ReviewsSection - current user:', user)
  console.log('ReviewsSection - userHasReviewInTour:', userHasReviewInTour)
  console.log('ReviewsSection - userHasReviewInMyReviews:', userHasReviewInMyReviews)
  console.log('ReviewsSection - userHasReview:', userHasReview)
  console.log('ReviewsSection - isAuthenticated:', isAuthenticated)
  
  // Debug token info
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      console.log('ReviewsSection - token payload:', payload)
    } catch (error) {
      console.error('ReviewsSection - token decode error:', error)
    }
  } else {
    console.log('ReviewsSection - no token found')
  }

  const handleReviewCreated = () => {
    // Refresh both tour reviews and user's reviews after creating a new one
    dispatch(fetchTourReviews(tourId))
    if (isAuthenticated) {
      dispatch(fetchMyReviews())
    }
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
        {/* Create Review Form - Only show for authenticated users who haven't reviewed */}
        {isAuthenticated && !userHasReview && (
          <>
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
          </>
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
              {Array.isArray(displayedReviews) && displayedReviews.map((review, index) => (
                <ReviewCard key={review._id || `review-${index}`} review={review} />
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
