import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  Users
} from 'lucide-react'
import { 
  fetchTours, 
  deleteTour, 
  selectTours, 
  selectToursLoading, 
  selectToursError,
  selectToursPagination,
  selectToursFilters,
  setPage,
  setFilters,
  clearFilters
} from '../../features/tour/tourSlice'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const AdminTours = () => {
  const dispatch = useDispatch()
  const tours = useSelector(selectTours)
  const pagination = useSelector(selectToursPagination)
  const filters = useSelector(selectToursFilters)
  const isLoading = useSelector(selectToursLoading)
  const error = useSelector(selectToursError)
  
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [selectedDifficulty, setSelectedDifficulty] = useState(filters.difficulty || '')
  const [selectedDuration, setSelectedDuration] = useState(filters.duration || '')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    console.log('🔄 AdminTours: Fetching all tours (no parameters)')
    dispatch(fetchTours()) // Fetch all tours without any parameters
  }, [dispatch])

  // Debug tours data
  useEffect(() => {
    console.log('📊 AdminTours: Tours data:', tours)
    console.log('📊 AdminTours: Tours length:', tours?.length)
    console.log('📊 AdminTours: Loading:', isLoading)
    console.log('📊 AdminTours: Error:', error)
    console.log('📊 AdminTours: Pagination:', pagination)
  }, [tours, isLoading, error, pagination])

  // Test direct API call to see if there are tours
  useEffect(() => {
    const testDirectAPI = async () => {
      try {
        console.log('🧪 Testing direct API call to /api/v1/tours')
        const response = await fetch('http://localhost:8000/api/v1/tours')
        const data = await response.json()
        console.log('🧪 Direct API response:', data)
      } catch (error) {
        console.error('🧪 Direct API error:', error)
      }
    }
    testDirectAPI()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(setFilters({ ...filters, search: searchTerm }))
  }

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ ...filters, [filterType]: value }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
    setSearchTerm('')
    setSelectedDifficulty('')
    setSelectedDuration('')
  }

  const handleDeleteTour = async (tourId, tourName) => {
    if (window.confirm(`Are you sure you want to delete "${tourName}"?`)) {
      try {
        await dispatch(deleteTour(tourId)).unwrap()
        toast.success('Tour deleted successfully')
        // Refresh the tours list
        dispatch(fetchTours({
          page: pagination.currentPage,
          limit: pagination.toursPerPage,
          ...filters
        }))
      } catch (error) {
        toast.error(error || 'Failed to delete tour')
      }
    }
  }

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage))
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDuration = (duration) => {
    return `${duration} day${duration > 1 ? 's' : ''}`
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'difficult': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading && tours.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tour Management</h1>
              <p className="text-gray-600 mt-2">Manage all tours in your system</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Tour
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search tours by name, location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>

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

            {/* Advanced Filters */}
            {(showFilters || window.innerWidth >= 1024) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => {
                        setSelectedDifficulty(e.target.value)
                        handleFilterChange('difficulty', e.target.value)
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Difficulties</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="difficult">Difficult</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <select
                      value={selectedDuration}
                      onChange={(e) => {
                        setSelectedDuration(e.target.value)
                        handleFilterChange('duration', e.target.value)
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Durations</option>
                      <option value="1-3">1-3 days</option>
                      <option value="4-7">4-7 days</option>
                      <option value="8-14">8-14 days</option>
                      <option value="15+">15+ days</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {tours.map((tour) => (
            <Card key={tour._id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                {tour.imageCover && (
                  <img
                    src={tour.imageCover}
                    alt={tour.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(tour.difficulty)}`}>
                    {tour.difficulty}
                  </span>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {tour.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {tour.summary}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {tour.startLocation?.description || 'Location not specified'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDuration(tour.duration)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {formatPrice(tour.price)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-2" />
                    {tour.ratingsAverage?.toFixed(1) || 'No rating'} ({tour.ratingsQuantity || 0} reviews)
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {/* View tour details */}}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {/* Edit tour */}}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTour(tour._id, tour.name)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {tours.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tours found</h3>
              <p className="text-gray-600 mb-4">
                {Object.values(filters).some(filter => filter) 
                  ? 'Try adjusting your filters to see more results.'
                  : 'Get started by creating your first tour.'
                }
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Tour
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {((pagination.currentPage - 1) * pagination.toursPerPage) + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.toursPerPage, pagination.totalTours)} of{' '}
                  {pagination.totalTours} tours
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === pagination.currentPage ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Tours</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <Button
                  onClick={() => dispatch(fetchTours({
                    page: pagination.currentPage,
                    limit: pagination.toursPerPage,
                    ...filters
                  }))}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AdminTours