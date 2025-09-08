import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Search,
  Star,
  Trash2,
  Eye,
  User,
  Calendar
} from 'lucide-react'
import { 
  fetchReviews, 
  deleteReview,
  selectReviews, 
  selectReviewsLoading,
  selectReviewsError 
} from '../../features/review/reviewSlice'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const AdminReviews = () => {
  const dispatch = useDispatch()
  const reviews = useSelector(selectReviews)
  const isLoading = useSelector(selectReviewsLoading)
  const error = useSelector(selectReviewsError)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRating, setSelectedRating] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState(null)

  useEffect(() => {
    dispatch(fetchReviews())
  }, [dispatch])

  const handleDeleteReview = async (reviewId) => {
    try {
      await dispatch(deleteReview(reviewId)).unwrap()
      toast.success('Review deleted successfully')
      setShowDeleteModal(false)
      setReviewToDelete(null)
    } catch (error) {
      toast.error(error || 'Failed to delete review')
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.tour?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = !selectedRating || review.rating === parseInt(selectedRating)
    return matchesSearch && matchesRating
  })

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Manage Reviews</h1>
          <p className="text-secondary-600 mt-2">
            Moderate and manage user reviews and ratings
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              </div>
              <div className="sm:w-48">
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="input w-full"
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading reviews..." />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card key={review._id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {review.user?.photo ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={review.user.photo}
                            alt={review.user.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-secondary-900">
                          {review.user?.name}
                        </h4>
                        <p className="text-sm text-secondary-500">
                          {review.tour?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setReviewToDelete(review)
                          setShowDeleteModal(true)
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                    <div className="flex items-center text-sm text-secondary-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(review.createdAt)}
                    </div>
                  </div>

                  <p className="text-secondary-700 leading-relaxed">
                    {review.review}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredReviews.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-secondary-500">No reviews found matching your criteria.</p>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="text-red-600">Delete Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600 mb-6">
                  Are you sure you want to delete this review? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteModal(false)
                      setReviewToDelete(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteReview(reviewToDelete._id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminReviews
