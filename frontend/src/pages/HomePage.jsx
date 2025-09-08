import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTours } from '../features/tour/tourSlice'
import { selectTours, selectToursLoading } from '../features/tour/tourSlice'
import { MapPin, Star, Users, Clock, ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const HomePage = () => {
  const dispatch = useDispatch()
  const tours = useSelector(selectTours)
  const isLoading = useSelector(selectToursLoading)

  useEffect(() => {
    dispatch(fetchTours())
  }, [dispatch])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Exciting tours for{' '}
              <span className="text-yellow-300">adventurous</span> people
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Discover the world's most beautiful places with our expertly crafted tours. 
              Adventure awaits around every corner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tours">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50">
                  Explore Tours
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/tours?difficulty=easy">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                  Start Easy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Why Choose Natours?
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              We provide exceptional experiences with professional guides, 
              comfortable accommodations, and unforgettable memories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Expert Guides
              </h3>
              <p className="text-secondary-600">
                Our certified guides have years of experience and deep knowledge 
                of the local areas and cultures.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Small Groups
              </h3>
              <p className="text-secondary-600">
                We keep our tour groups small to ensure personalized attention 
                and a more intimate experience.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Premium Quality
              </h3>
              <p className="text-secondary-600">
                From accommodation to transportation, we ensure the highest 
                quality standards throughout your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Popular Tours
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Discover our most loved tours, handpicked by our community of adventurers.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading tours..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(tours) && tours.slice(0, 6).map((tour) => (
                <div key={tour._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={`/img/tours/${tour.imageCover}`}
                      alt={tour.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-medium text-primary-600">
                      {tour.difficulty}
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
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/tours">
              <Button size="lg">
                View All Tours
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied travelers who have discovered the world with Natours.
          </p>
          <Link to="/tours">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50">
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
