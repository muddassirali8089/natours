import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
  Search,
  Filter,
  Star,
  Clock,
  Users,
  MapPin
} from 'lucide-react'
import { 
  fetchTours,
  selectTours, 
  selectToursLoading,
  selectToursError,
  setFilters,
  clearFilters,
  setSort,
  setPage
} from '../features/tour/tourSlice'
import { Card, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const ToursPage = () => {
  const dispatch = useDispatch()
  const tours = useSelector(selectTours)
  const isLoading = useSelector(selectToursLoading)
  const error = useSelector(selectToursError)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [sortBy, setSortBy] = useState('price')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    dispatch(fetchTours())
  }, [dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(setFilters({ search: searchTerm }))
  }

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty)
    dispatch(setFilters({ difficulty }))
  }

  const handleSortChange = (sort) => {
    setSortBy(sort)
    dispatch(setSort(sort))
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedDifficulty('')
    setSortBy('price')
    dispatch(clearFilters())
  }

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    difficult: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">All Tours</h1>
          <p className="text-secondary-600 mt-2">
            Discover amazing adventures around the world
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Input
                    placeholder="Search tours..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                </div>
              </form>

              {/* Sort */}
              <div className="lg:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="input w-full"
                >
                  <option value="price">Sort by Price</option>
                  <option value="-ratingsAverage">Sort by Rating</option>
                  <option value="duration">Sort by Duration</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-secondary-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Difficulty
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['easy', 'medium', 'difficult'].map((difficulty) => (
                        <button
                          key={difficulty}
                          onClick={() => handleDifficultyChange(
                            selectedDifficulty === difficulty ? '' : difficulty
                          )}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedDifficulty === difficulty
                              ? difficultyColors[difficulty]
                              : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                          }`}
                        >
                          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tours Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading tours..." />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(tours) && tours.map((tour) => (
              <Card key={tour._id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                
                <CardContent className="p-6">
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {Array.isArray(tours) && tours.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-secondary-500">No tours found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ToursPage
