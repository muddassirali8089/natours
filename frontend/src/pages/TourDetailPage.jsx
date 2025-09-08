import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Star,
  Clock,
  Users,
  MapPin,
  Calendar,
  ArrowLeft,
  Heart
} from 'lucide-react'
import { 
  fetchTour,
  selectCurrentTour,
  selectToursLoading,
  selectToursError
} from '../features/tour/tourSlice'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const TourDetailPage = () => {
  const { tourId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const tour = useSelector(selectCurrentTour)
  const isLoading = useSelector(selectToursLoading)
  const error = useSelector(selectToursError)

  useEffect(() => {
    if (tourId) {
      dispatch(fetchTour(tourId))
    }
  }, [dispatch, tourId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading tour details..." />
      </div>
    )
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Tour Not Found</h2>
          <p className="text-secondary-600 mb-6">{error || 'The tour you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/tours')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tours
          </Button>
        </div>
      </div>
    )
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 lg:h-[500px]">
        <img
          src={`/img/tours/${tour.imageCover}`}
          alt={tour.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">{tour.name}</h1>
            <div className="flex items-center justify-center space-x-6 text-lg">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span>{tour.ratingsAverage} ({tour.ratingsQuantity} reviews)</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-1" />
                <span>{tour.startLocation?.address}</span>
              </div>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="absolute top-4 left-4 text-white hover:bg-white hover:bg-opacity-20"
          onClick={() => navigate('/tours')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tours
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle>About this tour</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-700 leading-relaxed mb-6">
                  {tour.summary}
                </p>
                {tour.description && (
                  <div className="prose max-w-none">
                    <p className="text-secondary-700 leading-relaxed">
                      {tour.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tour Details */}
            <Card>
              <CardHeader>
                <CardTitle>Tour Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-primary-600 mr-3" />
                      <div>
                        <p className="font-medium text-secondary-900">Duration</p>
                        <p className="text-secondary-600">{tour.duration} days</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-primary-600 mr-3" />
                      <div>
                        <p className="font-medium text-secondary-900">Group Size</p>
                        <p className="text-secondary-600">Up to {tour.maxGroupSize} people</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-primary-600 mr-3" />
                      <div>
                        <p className="font-medium text-secondary-900">Difficulty</p>
                        <p className="text-secondary-600 capitalize">{tour.difficulty}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-primary-600 mr-3" />
                      <div>
                        <p className="font-medium text-secondary-900">Rating</p>
                        <div className="flex items-center">
                          {renderStars(tour.ratingsAverage)}
                          <span className="ml-2 text-secondary-600">
                            {tour.ratingsAverage} ({tour.ratingsQuantity} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Start Dates */}
            {tour.startDates && tour.startDates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Start Dates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tour.startDates.map((date, index) => (
                      <div key={index} className="flex items-center p-3 bg-secondary-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-primary-600 mr-3" />
                        <span className="text-secondary-900">{formatDate(date)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tour Images */}
            {tour.images && tour.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tour Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tour.images.map((image, index) => (
                      <img
                        key={index}
                        src={`/img/tours/${image}`}
                        alt={`${tour.name} ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    ${tour.price}
                  </div>
                  <p className="text-secondary-600">per person</p>
                </div>

                <div className="space-y-4">
                  <Button className="w-full" size="lg">
                    Book Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Add to Wishlist
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-secondary-200">
                  <h4 className="font-medium text-secondary-900 mb-3">What's included</h4>
                  <ul className="space-y-2 text-sm text-secondary-600">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                      Professional guide
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                      All equipment included
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                      Transportation
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                      Accommodation
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Guides */}
            {tour.guides && tour.guides.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Guides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tour.guides.map((guide) => (
                      <div key={guide._id} className="flex items-center">
                        <div className="flex-shrink-0">
                          {guide.photo ? (
                            <img
                              className="h-12 w-12 rounded-full object-cover"
                              src={guide.photo}
                              alt={guide.name}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-primary-600 font-medium">
                                {guide.name?.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-secondary-900">
                            {guide.name}
                          </p>
                          <p className="text-sm text-secondary-500">
                            {guide.roles?.includes('lead-guide') ? 'Lead Guide' : 'Guide'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TourDetailPage
