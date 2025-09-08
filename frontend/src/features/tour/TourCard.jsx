import { Link } from 'react-router-dom'
import { Star, Clock, Users, MapPin } from 'lucide-react'
import Button from '../../components/ui/Button'

function TourCard({ tour }) {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    difficult: 'bg-red-100 text-red-800',
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={`/img/tours/${tour.imageCover}`}
          alt={tour.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[tour.difficulty]}`}>
            {tour.difficulty}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">
          {tour.name}
        </h3>
        <p className="text-secondary-600 mb-4 line-clamp-2">
          {tour.summary}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-secondary-500">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {tour.duration} days
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {tour.maxGroupSize} people
            </div>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{tour.ratingsAverage}</span>
            <span className="text-sm text-secondary-500 ml-1">
              ({tour.ratingsQuantity})
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary-600">
            ${tour.price}
          </div>
          <Link to={`/tours/${tour._id}`}>
            <Button size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TourCard
