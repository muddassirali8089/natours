import { Star, User, Calendar } from 'lucide-react'
import { format } from 'date-fns'

const ReviewCard = ({ review }) => {
  // Safety check for review data
  if (!review) {
    return <div className="p-4 text-center text-gray-500">Invalid review data</div>
  }
  
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          {review.user?.photo ? (
            <img
              src={review.user.photo}
              alt={review.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
          )}
        </div>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                {review.user?.name || 'Anonymous'}
              </h4>
              <div className="flex items-center space-x-1">
                {renderStars(review.rating || 0)}
                <span className="text-sm text-gray-500 ml-1">
                  {review.rating || 0}/5
                </span>
              </div>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {review.createdAt ? (() => {
                try {
                  const date = new Date(review.createdAt)
                  return isNaN(date.getTime()) ? 'Unknown date' : format(date, 'MMM dd, yyyy')
                } catch (error) {
                  return 'Unknown date'
                }
              })() : 'Unknown date'}
            </div>
          </div>
          
          <p className="text-sm text-gray-700 leading-relaxed">
            {review.review || 'No review text available'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ReviewCard
